function Dealer() {
    this.dealCardTo = function (player) {
        this.new_card_dealt_index = getRandomNumberFrom0To(newDeck.length - 1);
        this.new_card_dealt = newDeck[this.new_card_dealt_index];

        let new_card = new Card(this.new_card_dealt);
        player.receiveCard(new_card);
        player.setCardHtml(new_card.getHtml());
        newDeck.splice(this.new_card_dealt_index, 1);
        newDeckSource.splice(this.new_card_dealt_index, 1);
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
    this.calculateFinalPointFor = function (player) {
        if (player.point > 21) player.final_point = 0;
        else player.final_point = player.point;
    };
    this.isThePlayerBurnt = function (player) {
        if (player.final_point === 0) return 1;
    };
    this.isTheHouseWin = function (house, player) {

        return (house.final_point >= player.final_point);
    }
}
function Card(value) {
    this.value = value;
    this.getHtml = function () {
        let index = newDeck.indexOf(this.value);
        if (index !== -1)
            return '<div class="card"><img alt="' + this.value + '" src="' + newDeckSource[newDeck.indexOf(this.value)] + '"></div>';
        else
            return '<div class="card">' + this.value + '</div>'
    }
}
function Player(name) {
    this.name = name;
    this.cards = [];
    this.point = 0;
    this.final_point = 0;
    this.cards_html = "";
    this.receiveCard = function (card) {
        this.cards.push(card.value);
    };
    this.setCardHtml = function (html) {
        this.cards_html += html;
    }
}