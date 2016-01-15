"use strict";

$(document).ready(init);

function init(){
  $("#deal").click(deal);
  $("#hit").click(hit);
  $("#stay").click(stay);
  $("#nextHand").click(nextHand);
}

var cardDeck = [{value: 11, image: "ace_of_spades.jpg"},{value: 2, image: "2_of_spades.jpg"},
    {value: 3, image: "3_of_spades.jpg"}, {value: 4, image: "4_of_spades.jpg"},
    {value: 5, image: "5_of_spades.jpg"}, {value: 6, image: "6_of_spades.jpg"},
    {value: 7, image: "7_of_spades.jpg"}, {value: 8, image: "8_of_spades.jpg"},
    {value: 9, image: "9_of_spades.jpg"},{value: 10, image: "10_of_spades.jpg"},
    {value: 10, image: "jack_of_spades.jpg"},{value: 10, image: "queen_of_spades.jpg"},
    {value: 10, image: "king_of_spades.jpg"},{value: 11, image: "ace_of_clubs.jpg"},
    {value: 2, image: "2_of_clubs.jpg"},{value: 3, image: "3_of_clubs.jpg"},
    {value: 4, image: "4_of_clubs.jpg"}, {value: 5, image: "5_of_clubs.jpg"},
    {value: 6, image: "6_of_clubs.jpg"},{value: 7, image: "7_of_clubs.jpg"},
    {value: 8, image: "8_of_clubs.jpg"}, {value: 9, image: "9_of_clubs.jpg"},
    {value: 10, image: "10_of_clubs.jpg"}, {value: 10, image: "jack_of_clubs.jpg"},
    {value: 10, image: "queen_of_clubs.jpg"},{value: 10, image: "king_of_clubs.jpg"},
    {value: 11, image: "ace_of_hearts.jpg"},{value: 2, image: "2_of_hearts.jpg"},
    {value: 3, image: "3_of_hearts.jpg"}, {value: 4, image: "4_of_hearts.jpg"},
    {value: 5, image: "5_of_hearts.jpg"}, {value: 6, image: "6_of_hearts.jpg"},
    {value: 7, image: "7_of_hearts.jpg"}, {value: 8, image: "8_of_hearts.jpg"},
    {value: 9, image: "9_of_hearts.jpg"},{value: 10, image: "10_of_hearts.jpg"},
    {value: 10, image: "jack_of_hearts.jpg"},{value: 10, image: "queen_of_hearts.jpg"},
    {value: 10, image: "king_of_hearts.jpg"},{value: 11, image: "ace_of_diamonds.jpg"},
    {value: 2, image: "2_of_diamonds.jpg"}, {value: 3, image: "3_of_diamonds.jpg"},
    {value: 4, image: "4_of_diamonds.jpg"},{value: 5, image: "5_of_diamonds.jpg"},
    {value: 6, image: "6_of_diamonds.jpg"}, {value: 7, image: "7_of_diamonds.jpg"},
    {value: 8, image: "8_of_diamonds.jpg"},{value: 9, image: "9_of_diamonds.jpg"},
    {value: 10, image: "10_of_diamonds.jpg"},{value: 10, image: "jack_of_diamonds.jpg"},
    {value: 10, image: "queen_of_diamonds.jpg"},{value: 10, image: "king_of_diamonds.jpg"}];


var playingDeck = shuffleDeck(cardDeck);
var hands = {user:[], dealer:[]};
var userFinalHandValue;
var currentPlayer = "user";
var roundIsOver = false;

function shuffleDeck(cardDeck){
  return _.shuffle(cardDeck)
}

function deal(){
  var playerCard = getCard(), playerCard2 = getCard();
  hands.user.push(playerCard, playerCard2);

  var dealerFirstCard = getCard();
  hands.dealer.push(dealerFirstCard);

  $('#board').show();
  $('#deal').hide();
  setTimeout(function(){
    var $card = $('<img>').addClass("card").attr({id:"dealerSecond", src:"static/back.jpg"});
    $("#dealerHand").append($card);}, 200);
  setTimeout(function(){makeCard(dealerFirstCard, "dealer")}, 600);
  setTimeout(function(){makeCard(playerCard, "user")}, 900);
  setTimeout(function(){makeCard(playerCard2, "user")}, 1300);
  updateHandScore();

  if (checkForBlackjack("user")){
    setTimeout(function(){alert("blackjack!");
    roundIsOver = true;}, 200);
    roundOver();
  }
}

function makeCard(cardObj, person){
  var $card = $('<img>').addClass("card").attr('src', 'static/' + cardObj.image);
  $("#" + person +"Hand").append($card);
}

function getCard(){
  playingDeck = shuffleDeck(playingDeck);
  return playingDeck.pop();
}

function getHandValue(person){
  var cards = hands[person];
  return _.sumBy(cards, "value");
}

function updateHandScore(){
  setTimeout(function(){$('#userScore')
    .text("Player's running score: " + getHandValue("user"))}, 1500);
}

function checkForBlackjack(){
  if (getHandValue("user") === 21){
    return true;
  }
  return false;
}

function checkForBust(person){
  if (getHandValue(person) < 21){
    return false;
  }
  var index = _.findIndex(hands[person], function(card){
    return card.value === 11;
  });
  if (index > -1){
  hands[person][index].value = 1;
  checkForBust(person);
  } else {
    return true;
  }
}

function hit(){
  var newCard = getCard();
  hands[currentPlayer].push(newCard);
  makeCard(newCard, currentPlayer);
  updateHandScore();

  if (checkForBust(currentPlayer)){
      setTimeout(function(){alert("BUST!");
      roundIsOver = true;}, 300);
      roundOver();
  }
}

function stay(){
  userFinalHandValue = getHandValue("user");
  currentPlayer = "dealer";
  dealerSecondCard();
  while (roundIsOver === false){
  dealerMove();
  }
}

function dealerSecondCard(){
  var secondCard = getCard();
  hands.dealer.push(secondCard);
  $("#dealerSecond").attr('src', 'static/' + secondCard.image)

  if (checkForBust(currentPlayer)){
      setTimeout(function(){alert("BUST!");
      roundIsOver = true;}, 300);
      roundOver();
  }
}

function dealerMove(){
  var dealerSum = getHandValue("dealer");
  if (dealerSum > 16){
    return compareHands(dealerSum);
  } else {
    return hit();
  }
}

function compareHands(dealerSum){
  roundIsOver = true;
  if (dealerSum === userFinalHandValue){
    setTimeout(function(){alert("tie!")}, 200);
  } else if (dealerSum > userFinalHandValue){
    setTimeout(function(){alert("dealerwins!")}, 200);
  } else{
    setTimeout(function(){alert("user wins!")}, 200);
  }
  roundOver();
}

function roundOver(){
  $("#roundButtons").hide();
  $("#nextHand").show();
}

function nextHand(){
  location.reload();
}
