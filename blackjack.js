const NEW_GAME = document.getElementById("new_game");
const START_DEALING = document.getElementById("start_button");
const PLAYER_CARD = document.getElementById("player_card");
const HOUSE_CARD = document.getElementById("house_card");
const DEAL_BUTTON = document.getElementById("deal_button");
const HOLD_BUTTON = document.getElementById("hold_button");
const PLAYER_POINT = document.getElementById("player_point");
const HOUSE_POINT = document.getElementById("house_point");
const WINNING_SHOW= document.getElementById("winning_show");
let player;
let house;
let dealer;
let newDeck;
let newDeckSource;
NEW_GAME.onclick=function(){
    disableButton(NEW_GAME);
    enableButton(START_DEALING);
    enableButton(DEAL_BUTTON);
    enableButton(HOLD_BUTTON);
    dealer = new Dealer();
    player = new Player(player);
    house = new Player(house);
    newDeck = ["2c", "3c", "4c", "5c", "6c", "7c", "8c", "9c", "Tc", "Jc", "Qc", "Kc", "Ac",
        "2h", "3h", "4h", "5h", "6h", "7h", "8h", "9h", "Th", "Jh", "Qh", "Kh", "Ah",
        "2d", "3d", "4d", "5d", "6d", "7d", "8d", "9d", "Td", "Jd", "Qd", "Kd", "Ad",
        "2s", "3s", "4s", "5s", "6s", "7s", "8s", "9s", "Ts", "Js", "Qs", "Ks", "As"];
    newDeckSource=["./card_deck/2C.jpg","./card_deck/3C.jpg","./card_deck/4C.jpg","./card_deck/5C.jpg","./card_deck/6C.jpg","./card_deck/7C.jpg","./card_deck/8C.jpg","./card_deck/9C.jpg","./card_deck/10C.jpg","./card_deck/JC.jpg","./card_deck/QC.jpg","./card_deck/KC.jpg","./card_deck/AC.jpg",
        "./card_deck/2H.jpg","./card_deck/3H.jpg","./card_deck/4H.jpg","./card_deck/5H.jpg","./card_deck/6H.jpg","./card_deck/7H.jpg","./card_deck/8H.jpg","./card_deck/9H.jpg","./card_deck/10H.jpg","./card_deck/JH.jpg","./card_deck/QH.jpg","./card_deck/KH.jpg","./card_deck/AH.jpg",
        "./card_deck/2D.jpg","./card_deck/3D.jpg","./card_deck/4D.jpg","./card_deck/5D.jpg","./card_deck/6D.jpg","./card_deck/7D.jpg","./card_deck/8D.jpg","./card_deck/9D.jpg","./card_deck/10D.jpg","./card_deck/JD.jpg","./card_deck/QD.jpg","./card_deck/KD.jpg","./card_deck/AD.jpg",
        "./card_deck/2S.jpg","./card_deck/3S.jpg","./card_deck/4S.jpg","./card_deck/5S.jpg","./card_deck/6S.jpg","./card_deck/7S.jpg","./card_deck/8S.jpg","./card_deck/9S.jpg","./card_deck/10S.jpg","./card_deck/JS.jpg","./card_deck/QS.jpg","./card_deck/KS.jpg","./card_deck/AS.jpg",];
    PLAYER_CARD.innerHTML="";
    HOUSE_CARD.innerHTML="";
    PLAYER_POINT.innerHTML="";
    HOUSE_POINT.innerHTML="";
    WINNING_SHOW.innerHTML="";

};
START_DEALING.onclick = function(){
    disableButton(START_DEALING);
    startDealing();
};
DEAL_BUTTON.onclick = function () {
    dealer.dealCardTo(player);
    dealer.calculateTotalPointFor(player);
    dealer.calculateFinalPointFor(player);
    PLAYER_CARD.innerHTML = player.cards_html;
    PLAYER_POINT.innerHTML = 'point= '+player.final_point;
    if(dealer.isTheHouseWin(house,player)){
        doAfterTheHouseWin();
        disableButton(DEAL_BUTTON);
        disableButton(HOLD_BUTTON);
        enableButton(NEW_GAME)
    }

};
HOLD_BUTTON.onclick = function () {
    disableButton(HOLD_BUTTON);
    enableButton(NEW_GAME);
    disableButton(START_DEALING);
    disableButton(DEAL_BUTTON);
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
    HOUSE_POINT.innerHTML = 'point= '+house.final_point;
    if(dealer.isTheHouseWin(house,player)) doAfterTheHouseWin();
    if(!dealer.isTheHouseWin(house,player)) doAfterThePlayerWin();

};



function Card(value) {
    this.value = value;
    this.getHtml=function(){
        index=newDeck.indexOf(this.value);
        if(index!==-1)
        return '<div class="card"><img alt="'+this.value+'" src="'+newDeckSource[newDeck.indexOf(this.value)]+'"></div>';
        else
            return '<div class="card">'+this.value+'</div>'
    }



}

function Player() {
    this.cards = [];
    this.point = 0;
    this.final_point=0;
    this.cards_html = "";
    this.receiveCard = function (card) {
        this.cards.push(card.value);
    };
    this.setCardHtml = function (html) {
        this.cards_html += html;
    }


}

function Dealer() {
    this.dealCardTo = function (player) {
        this.new_card_dealt_index = getRandomNumberFrom0To(newDeck.length - 1);
        this.new_card_dealt = newDeck[this.new_card_dealt_index];

        let new_card = new Card(this.new_card_dealt);
        player.receiveCard(new_card);
        player.setCardHtml(new_card.getHtml());
        newDeck.splice(this.new_card_dealt_index, 1);
        newDeckSource.splice(this.new_card_dealt_index,1);


    };
    this.calculateTotalPointFor = function (player) {

        player.point = 0;
        for (let i = 0; i < player.cards.length; i++) {
            player.point += convertCardValuetoNumber(player.cards[i]);
        }
        if (this.isThereAceCard(player)) {
            if (player.point <= 11) player.point += 10;
        }


    };
    this.isThereAceCard = function (player) {
        for (let i = 0; i < player.cards.length; i++) {
            if (player.cards[i][0] === "A") return 1;
        }
        return 0;
    };
    this.calculateFinalPointFor=function(player){
        if(player.point>21) player.final_point=0;
        else player.final_point=player.point;
    };
    this.isTheHouseWin=function(house, player){
        return (player.final_point===0||house.final_point>=player.final_point);

    }
}


function startDealing() {

    dealer.dealCardTo(player);
    dealer.dealCardTo(player);
    dealer.calculateTotalPointFor(player);
    dealer.calculateFinalPointFor(player);
    dealer.dealCardTo(house);
    dealer.calculateTotalPointFor(house);
    dealer.calculateFinalPointFor(house);
    PLAYER_CARD.innerHTML = player.cards_html;
    PLAYER_POINT.innerHTML = 'point= '+player.final_point;
    HOUSE_CARD.innerHTML = house.cards_html;
    HOUSE_POINT.innerHTML = 'point= '+house.final_point;


}
function disableButton(button){
    button.classList.add("button_block");

}
function enableButton(button){
    button.classList.remove("button_block");

}

function getRandomNumberFrom0To(number) {
    return Math.floor(Math.random()*number);

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
function doAfterTheHouseWin(){
    WINNING_SHOW.innerHTML="THE HOUSE WIN";
}

function doAfterThePlayerWin(){
    WINNING_SHOW.innerHTML="THE PLAYER WIN";

}


