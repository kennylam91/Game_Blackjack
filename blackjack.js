const START_BUTTON = document.getElementById("start_button");
const GAME_SCREEN = document.getElementById("game_screen");
const PLAYER_CARD = document.getElementById("player_card");
const HOUSE_CARD = document.getElementById("house_card");
const DEAL_BUTTON = document.getElementById("deal_button");
const HOLD_BUTTON = document.getElementById("hold_button");
const PLAYER_POINT = document.getElementById("player_point");
const HOUSE_POINT = document.getElementById("house_point");
let player;
let house;
let dealer;
START_BUTTON.onclick = startGame;
DEAL_BUTTON.onclick = function () {
    dealer.dealCardTo(player);
    dealer.calculatePointFor(player);
    PLAYER_CARD.innerHTML = player.cards_html;
    PLAYER_POINT.innerHTML = player.point;
};
HOLD_BUTTON.onclick = function () {
    console.log("Start");
    dealer.dealCardTo(house);
    dealer.dealCardTo(house);
    dealer.calculatePointFor(house);
    while (house.point < 17) {
        dealer.dealCardTo(house);
        dealer.calculatePointFor(house);

        if (house.point > 21) break;
    }
    while (house.point < player.point) {
        dealer.dealCardTo(house);
        dealer.calculatePointFor(house);
        if (house.point > 21) break;

    }
    HOUSE_CARD.innerHTML = house.cards_html;
    HOUSE_POINT.innerHTML = house.point;

};

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

function Player(player) {
    this.name = player;
    this.cards = [];
    this.point = 0;
    this.cards_html = "";
    this.receiveCard = function (card) {
        this.cards.push(card.value);
    };
    this.setCardHtml = function (html) {
        this.cards_html += html;
    }


}

function Dealer() {

    this.card_deck = FULL_CARD_DECK;
    this.card_number_in_deck = card_number_of_full_deck;
    this.dealCardTo = function (player) {
        this.new_card_dealt_index = getRandomNumberFrom0To(this.card_number_in_deck - 1);
        this.new_card_dealt = this.card_deck[this.new_card_dealt_index];
        this.card_deck.splice(this.new_card_dealt_index, 1);
        this.card_number_in_deck = this.card_deck.length;
        let new_card = new Card(this.new_card_dealt);
        player.receiveCard(new_card);
        player.setCardHtml(new_card.html);


    };
    this.calculatePointFor = function (player) {
        player.point = 0;
        for (i = 0; i < player.cards.length; i++) {
            player.point += convertCardValuetoNumber(player.cards[i]);
        }
        if (this.isThereAceCard(player)) {
            if (player.point <= 11) player.point += 10;
        }


    };
    this.isThereAceCard = function (player) {
        for (i = 0; i < player.cards.length; i++) {
            if (player.cards[i][0] === "A") return 1;
        }
        return 0;
    }
}


function startGame() {
    GAME_SCREEN.classList.add("start");
    dealer = new Dealer();
    player = new Player(player);
    house = new Player(house);
    dealer.dealCardTo(player);
    dealer.dealCardTo(player);
    dealer.calculatePointFor(player);
    PLAYER_CARD.innerHTML = player.cards_html;
    PLAYER_POINT.innerHTML = player.point;


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



