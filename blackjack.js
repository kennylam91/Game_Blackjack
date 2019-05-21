const START_BUTTON = document.getElementById("start_button");
const GAME_SCREEN = document.getElementById("game_screen");
const PLAYER_CARD = document.getElementById("player_card");
const HOUSE_CARD = document.getElementById("house_card");
const DEAL_BUTTON = document.getElementById("deal_button");
const HOLD_BUTTON = document.getElementById("hold_button");
const PLAYER_POINT = document.getElementById("player_point");
const HOUSE_POINT = document.getElementById("house_point");
let player_card_inner_html = "";
let house_card_inner_html = "";
let inner_html = "";
let player_point = 0;
let house_point = 0;
let game = {};
const FULL_CARD_DECK =
    ["2h", "3h", "4h", "5h", "6h", "7h", "8h", "9h", "Th", "Jh", "Qh", "Kh", "Ah",
        "2d", "3d", "4d", "5d", "6d", "7d", "8d", "9d", "Td", "Jd", "Qd", "Kd", "Ad",
        "2c", "3c", "4c", "5c", "6c", "7c", "8c", "9c", "Tc", "Jc", "Qc", "Kc", "Ac",
        "2s", "3s", "4s", "5s", "6s", "7s", "8s", "9s", "Ts", "Js", "Qs", "Ks", "As"];
let card_number_of_full_deck = FULL_CARD_DECK.length;

function Card(value) {
    this.value = value;
    this.html = '<div class="card">' + this.value + '</div>';


}

function Player() {
    this.cards = [];
    this.point = 0;
    this.receiveCard = function (card) {
        this.cards.push(card.value);
    }

    this.createHtml = function (card) {
        return card.html;
    };
    this.isThereAceCard = function () {
        for (i = 0; i < this.cards.length; i++) {
            if (this.cards[i][0] === "A") return 1;
        }
        return 0;
    }
    this.calculatePoint = function () {
        this.point = 0;
        for (i = 0; i < this.cards.length; i++) {
            this.point += convertCardValuetoNumber(this.cards[i]);
        }
        if (this.isThereAceCard()) {
            if (this.point <= 11) this.point += 10;
        }


    };

}

function Game() {
    this.new_card_dealt;
    this.card_deck = FULL_CARD_DECK;
    this.card_dealt_index;
    this.card_number_in_deck = card_number_of_full_deck;
    this.dealRandomCard = function () {
        this.card_dealt_index = getRandomNumberFrom0To(this.card_number_in_deck - 1);
        this.new_card_dealt = this.card_deck[this.card_dealt_index];
        this.card_deck.splice(this.card_dealt_index, 1);
        this.card_number_in_deck = this.card_deck.length;

    };
}


START_BUTTON.onclick = startGame;
DEAL_BUTTON.onclick = dealCardForPlayer;
HOLD_BUTTON.onclick = dealCardsForHouse;


function startGame() {
    GAME_SCREEN.classList.add("start");
    game = new Game();
    player = new Player();
    house = new Player();
    game.dealRandomCard();
    let player_card1 = new Card(game.new_card_dealt);
    player.receiveCard(player_card1);
    player.calculatePoint();
    player_card_inner_html += player.createHtml(player_card1);
    console.log(player_card_inner_html)
    game.dealRandomCard();
    let player_card2 = new Card(game.new_card_dealt);
    player.receiveCard(player_card2);
    player.calculatePoint();
    player_card_inner_html += player.createHtml(player_card2);
    PLAYER_CARD.innerHTML = player_card_inner_html;
    PLAYER_POINT.innerHTML = player.point;


};

function dealCardForPlayer() {
    game.dealRandomCard();
    let player_card = new Card(game.new_card_dealt);
    player.receiveCard(player_card);
    player.calculatePoint();
    player.createHtml(player_card);
    player_card_inner_html += player.createHtml(player_card);
    PLAYER_CARD.innerHTML = player_card_inner_html;
    PLAYER_POINT.innerHTML = player.point;


}

function dealCardsForHouse() {
    dealSingleCardForHouse();
    dealSingleCardForHouse();
    while (house.point < 17) {
        dealSingleCardForHouse();
        if (house.point > 21) break;

    }
    while (house.point < player.point) {
        dealSingleCardForHouse();
        if (house.point > 21) break;

    }
}

function dealSingleCardForHouse() {
    game.dealRandomCard();
    let house_card1 = new Card(game.new_card_dealt);
    house.receiveCard(house_card1);
    house.calculatePoint(house_card1);
    house_card_inner_html += house.createHtml(house_card1);
    HOUSE_CARD.innerHTML = house_card_inner_html;
    HOUSE_POINT.innerHTML = house.point;


}

function getRandomNumberFrom0To(number) {
    return Math.round(Math.random() * number);

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



