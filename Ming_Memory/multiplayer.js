const gridContainer = document.querySelector(".grid-container");
let cards = [];
let cardsCounter = 0;
let firstCard, secondCard;
let lockBoard = false;
let score1 = 0;
let score2 = 0;
let player1 = true;
let playerName1 = "";
let playerName2 = "";

const score1El = document.querySelector(".score1");
const score2El = document.querySelector(".score2");
const scoreBackgrounds = document.querySelectorAll(".score");

score1El.textContent = score1;
score2El.textContent = score2;
scoreBackgrounds[0].classList.add("active")

fetch("./data/cards.json")
  .then((res) => res.json())
  .then((data) => {
    cards = [...data, ...data];
    cardsCounter = data.length;
    shuffleCards();
    generateCards();
  });

function shuffleCards() {
  let currentIndex = cards.length,
    randomIndex,
    temporaryValue;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = cards[currentIndex];
    cards[currentIndex] = cards[randomIndex];
    cards[randomIndex] = temporaryValue;
  }
}

function generateCards() {
  for (let card of cards) {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.setAttribute("data-name", card.name);
    cardElement.innerHTML = `
      <div class="front">
      <img class="front-image" src=${card.image} />
      </div>
      <div class="back"></div>
    `;
    gridContainer.appendChild(cardElement);
    addListeners(cardElement);
  }
}

function addListeners(target) {
  target.addEventListener("mousedown", flipCardFromBack);
  target.addEventListener("mouseup", flipCardFromBack);
  target.addEventListener("touchstart", flipCardFromBack);
  target.addEventListener("touchend", posToTarget);
}

function removeListeners(target) {
  target.removeEventListener("mousedown", flipCardFromBack);
  target.removeEventListener("mouseup", flipCardFromBack);
  target.removeEventListener("touchstart", flipCardFromBack);
  target.removeEventListener("touchend", posToTarget);
}

function posToTarget(ev) {
  ev.preventDefault();
  const target = document.elementFromPoint(
      ev.changedTouches[0].pageX,
      ev.changedTouches[0].pageY
  )
  flipCard(target)
}

function flipCardFromBack(ev) {
  ev.preventDefault()
  flipCard(ev.target.parentElement)
}

function flipCard(target) {
  if (lockBoard) return;
  if (!target.getAttribute("data-name")) return;
  if (target === firstCard) return;

  target.classList.add("flipped");

  if (!firstCard) {
    firstCard = target;
    return;
  }

  secondCard = target;
  lockBoard = true;

  checkForMatch();

  setTimeout(() => {
    score1El.textContent = score1;
    score2El.textContent = score2;

    const index = player1 ? 0: 1;
    scoreBackgrounds[index].classList.add("active");
    scoreBackgrounds[1 - index].classList.remove("active");
  }, 500);
}

function checkForMatch() {
  const isMatch = firstCard.dataset.name === secondCard.dataset.name;
  if (isMatch) {
    disableCards();
  } else {
    unflipCards();
  }
}

function disableCards() {
  cardsCounter--;
  removeListeners(firstCard);
  removeListeners(secondCard);
  if (player1=== true){
    score1=score1+5;
  } else {
    score2=score2+5;
  }
  resetBoard();
  if (!cardsCounter) {
    GameEnd();
  }
}

function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    resetBoard();
  }, 1000);
  if (player1 === true){
    score1=score1-1;
    player1=false;}

  else {
    score2=score2-1;
    player1= true;
  }
}

function resetBoard() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

function restart() {
  resetBoard();
  shuffleCards();
  score1 = 0;
  score2 = 0;
  document.querySelector(".score2").textContent = score2;
  document.querySelector(".score1").textContent = score1;
  gridContainer.innerHTML = "";
  generateCards();
}
function setPlayerName () {
  let playerName = document.getElementById('playerName');
  playerName1 = document.getElementById('playerNameInput').value;
  playerName.innerHTML = playerName1;
  document.getElementById('divSetPlayerName').style.display = 'none';
}

function setPlayerName2() {
  let playerName = document.getElementById('playerName2');
  playerName2 = document.getElementById('playerNameInput2').value;
  playerName.innerHTML = playerName2;
  document.getElementById('divSetPlayerName2').style.display = 'none';
}

function GameEnd() {
  const highscores = JSON.parse(localStorage.getItem("highscores-multiplayer") || "{}");
  highscores[playerName1] = score1;
  highscores[playerName2] = score2;
  localStorage.setItem("highscores-multiplayer", JSON.stringify(highscores));
}

/*
Einzelspieler ohne abwechselden Spieler (so gut wie fertig)
Name festlegen Nutzer ( fertig bis uaf formatierung und setzen der Namen in eine Liste)
Ende detecten => Highscores speichern und level erhöhen
Level => Anzahl an Karten an das Level anpassen
Anzahl der Karten => Grid Layout Responsive machen
Highscores im Main Menu anzeigen

Markdown Datei für Features schreiben
 */

/*
var level = (+localStorage.getItem("level") || 1);
localStorage.setItem("level", level + 1);

const highscores = JSON.parse(localStorage.getItem("highscores") || "[]")
highscores.append({score: 1, user_agent: window.navigator.userAgent, name: "name"});
highscores.sort((a, b) => a.score - b.score);
localStorage.setItem("highscores", JSON.stringify(highscores))
*/
