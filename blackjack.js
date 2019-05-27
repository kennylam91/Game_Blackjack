const START_GAME_BTN = document.getElementById("start_game_btn");
const START_SCREEN = document.getElementById("start_screen");
const GAME_SCREEN = document.getElementById("game_screen");
const NEW_HAND_BTN = document.getElementById("new_hand_btn");
const START_DEALING_BTN = document.getElementById("start_dealing_btn");
const PLAYER_CARD = document.getElementById("player_card");
const HOUSE_CARD = document.getElementById("house_card");
const HIT_BTN = document.getElementById("hit_btn");
const HOLD_BTN = document.getElementById("hold_btn");
const PLAYER_POINT = document.getElementById("player_point");
const HOUSE_POINT = document.getElementById("house_point");
const WINNING_SHOW = document.getElementById("winning_show");
const PLAYER_NAME = document.getElementById("player_name");
const HOUSE_NAME = document.getElementById("house_name");
const PLAYER_NAME_INPUT = document.getElementById("player_name_input");
const PLAYER_SCORE = document.getElementById("player_score");
const LEADER_BOARD = document.getElementById("leader_board");
const DEALING_DELAY = 0;
let player;
let house;
let dealer;
let newDeck;
let newDeckSource;
let playerScore;
let startingScore = 10;
let cookieArray = [];
PLAYER_CARD.innerHTML = "";
HOUSE_CARD.innerHTML = "";
PLAYER_POINT.innerHTML = "";
HOUSE_POINT.innerHTML = "";
WINNING_SHOW.innerHTML = "";

PLAYER_NAME_INPUT.onclick=function(){
    PLAYER_NAME_INPUT.value="";
}

START_GAME_BTN.onclick = function () {
    if(is_userName(PLAYER_NAME_INPUT.value)){
        START_SCREEN.classList.remove("start_background");
        START_GAME_BTN.classList.add("disappear");
        GAME_SCREEN.classList.remove("disappear");
        PLAYER_NAME.value = PLAYER_NAME_INPUT.value.toUpperCase();
        HOUSE_NAME.value = "ROYAL CASINO";
        showPlayerScore();
        showLeaderBoard();

        disAppear(START_DEALING_BTN);
        disAppear(HIT_BTN);
        disAppear(HOLD_BTN);
        disAppear(WINNING_SHOW);
    }
    else
        alert("Username has at least 3 characters and only contain character+number");
};
NEW_HAND_BTN.onclick = function () {
    dealer = new Dealer();
    player = new Player(PLAYER_NAME.value);
    house = new Player(HOUSE_NAME.value);
    initNewDeck();
    showPlayerScore();

    disAppear(WINNING_SHOW);
    disAppear(NEW_HAND_BTN);
    appear(START_DEALING_BTN);
    disAppear(HIT_BTN);
    disAppear(HOLD_BTN);

};
START_DEALING_BTN.onclick = function () {
    disAppear(START_DEALING_BTN);
    appear(HOLD_BTN);
    appear(HIT_BTN);
    startDealing();
};

function startDealing() {
    dealer.dealCardTo(player);
    dealer.calculateTotalPointFor(player);
    dealer.calculateFinalPointFor(player);
    setTimeout(function () {
        PLAYER_CARD.innerHTML = player.cards_html;
        PLAYER_POINT.innerHTML = player.final_point + ' points';
    }, DEALING_DELAY);

    setTimeout(function () {
        dealer.dealCardTo(player);
        dealer.calculateTotalPointFor(player);
        dealer.calculateFinalPointFor(player);
        PLAYER_CARD.innerHTML = player.cards_html;
        PLAYER_POINT.innerHTML = player.final_point + ' points';
    }, DEALING_DELAY * 2);

    setTimeout(function () {
        dealer.dealCardTo(house);
        dealer.calculateTotalPointFor(house);
        dealer.calculateFinalPointFor(house);
        HOUSE_CARD.innerHTML = house.cards_html;
        HOUSE_POINT.innerHTML = house.final_point + ' points';
    }, DEALING_DELAY * 3);
}

HIT_BTN.onclick = function () {
    dealer.dealCardTo(player);
    dealer.calculateTotalPointFor(player);
    setTimeout(function () {
        PLAYER_CARD.innerHTML = player.cards_html;
        dealer.calculateFinalPointFor(player);
        PLAYER_CARD.innerHTML = player.cards_html;
        PLAYER_POINT.innerHTML = player.final_point + ' points';
        if (dealer.isThePlayerBurnt(player)) {
            doAfterTheHouseWin();
            disAppear(HIT_BTN);
            disAppear(HOLD_BTN);
            appear(NEW_HAND_BTN)
        }
    }, DEALING_DELAY);

};
HOLD_BTN.onclick = function () {
    disAppear(HOLD_BTN);
    appear(NEW_HAND_BTN);
    disAppear(START_DEALING_BTN);
    disAppear(HIT_BTN);
    dealer.dealCardTo(house);
    dealer.calculateTotalPointFor(house);
    while (house.point < player.point) {
        dealer.dealCardTo(house);
        dealer.calculateTotalPointFor(house);
        if (house.point > 21) break;
    }
    while (house.point < 17) {
        dealer.dealCardTo(house);
        dealer.calculateTotalPointFor(house);

        if (house.point > 21) break;
    }
    dealer.calculateFinalPointFor(house);
    HOUSE_CARD.innerHTML = house.cards_html;
    HOUSE_POINT.innerHTML = house.final_point + ' points';
    if (dealer.isTheHouseWin(house, player)) doAfterTheHouseWin();
    if (!dealer.isTheHouseWin(house, player)) doAfterThePlayerWin();
};


function disAppear(button) {
    // button.classList.add("button_block");
    button.classList.add("disappear");
}

function appear(button) {
    // button.classList.remove("button_block");
    button.classList.remove("disappear");
}

function getRandomNumberFrom0To(number) {
    return Math.floor(Math.random() * number);
}

function convertCardValuetoNumber(cardvalue) {
    switch (cardvalue[0]) {
        case "T":
        case "J":
        case "Q":
        case "K":
            return 10;

        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
            return Number(cardvalue[0]);

        case "A":
            return 1;
    }
}

function doAfterTheHouseWin() {
    appear(WINNING_SHOW);
    WINNING_SHOW.innerHTML = "THE HOUSE WIN";
    WINNING_SHOW.classList.add("house_win");
    WINNING_SHOW.classList.remove("player_win");
    playerScore--;
    updateLeaderBoard();
    showLeaderBoard();
}

function doAfterThePlayerWin() {
    WINNING_SHOW.innerHTML = "THE PLAYER WIN";
    appear(WINNING_SHOW);
    WINNING_SHOW.classList.add("player_win");
    WINNING_SHOW.classList.remove("house_win");
    playerScore++;
    updateLeaderBoard();
    showLeaderBoard();


}

function createCookie(name, value) {
    document.cookie = name + "=" + value;
}

function readCookie(name) {
    let nameEQ = name + "=";
    cookieArray = document.cookie.split(";");
    for (let i = 0; i < cookieArray.length; i++) {
        let c = cookieArray[i];
        while (c.charAt(0) === " ") {
            c = c.substring(1, c.length);
        }
        if (c.indexOf(nameEQ) === 0)
            return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function updateLeaderBoard() {
    createCookie(PLAYER_NAME_INPUT.value.toUpperCase(), playerScore);
}

function showLeaderBoard() {
    let cookieArraySorted = document.cookie.split(";");
    let playerScore;
    playerScore = '<h2>Leader Board</h2>\n';
    cookieArraySorted.sort(function (a, b) {
        return b.substring(b.indexOf("=") + 1, b.length) - a.substring(a.indexOf("=") + 1, a.length);
    });
    for (let i = 0; i < 10; i++) {
        playerScore += '<p>' + (i + 1) + '. ' + cookieArraySorted[i] + '</p>\n';
    }
    LEADER_BOARD.innerHTML = playerScore;

}

function showPlayerScore() {
    playerScore = readCookie(PLAYER_NAME.value);
    if (playerScore == null) playerScore = startingScore;
    PLAYER_SCORE.value = 'score: ' + playerScore;
}

function initNewDeck() {
    newDeck = ["2c", "3c", "4c", "5c", "6c", "7c", "8c", "9c", "Tc", "Jc", "Qc", "Kc", "Ac",
        "2h", "3h", "4h", "5h", "6h", "7h", "8h", "9h", "Th", "Jh", "Qh", "Kh", "Ah",
        "2d", "3d", "4d", "5d", "6d", "7d", "8d", "9d", "Td", "Jd", "Qd", "Kd", "Ad",
        "2s", "3s", "4s", "5s", "6s", "7s", "8s", "9s", "Ts", "Js", "Qs", "Ks", "As"];
    newDeckSource = ["./card_deck/2C.jpg", "./card_deck/3C.jpg", "./card_deck/4C.jpg", "./card_deck/5C.jpg", "./card_deck/6C.jpg", "./card_deck/7C.jpg", "./card_deck/8C.jpg", "./card_deck/9C.jpg", "./card_deck/10C.jpg", "./card_deck/JC.jpg", "./card_deck/QC.jpg", "./card_deck/KC.jpg", "./card_deck/AC.jpg",
        "./card_deck/2H.jpg", "./card_deck/3H.jpg", "./card_deck/4H.jpg", "./card_deck/5H.jpg", "./card_deck/6H.jpg", "./card_deck/7H.jpg", "./card_deck/8H.jpg", "./card_deck/9H.jpg", "./card_deck/10H.jpg", "./card_deck/JH.jpg", "./card_deck/QH.jpg", "./card_deck/KH.jpg", "./card_deck/AH.jpg",
        "./card_deck/2D.jpg", "./card_deck/3D.jpg", "./card_deck/4D.jpg", "./card_deck/5D.jpg", "./card_deck/6D.jpg", "./card_deck/7D.jpg", "./card_deck/8D.jpg", "./card_deck/9D.jpg", "./card_deck/10D.jpg", "./card_deck/JD.jpg", "./card_deck/QD.jpg", "./card_deck/KD.jpg", "./card_deck/AD.jpg",
        "./card_deck/2S.jpg", "./card_deck/3S.jpg", "./card_deck/4S.jpg", "./card_deck/5S.jpg", "./card_deck/6S.jpg", "./card_deck/7S.jpg", "./card_deck/8S.jpg", "./card_deck/9S.jpg", "./card_deck/10S.jpg", "./card_deck/JS.jpg", "./card_deck/QS.jpg", "./card_deck/KS.jpg", "./card_deck/AS.jpg",];
}
function is_userName(str){
    regexp=/^[_a-zA-Z0-9]{3,}$/;
    if(regexp.test(str)){
        return true;
    }
    return false;
}