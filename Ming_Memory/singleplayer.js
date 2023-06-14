const gridContainer = document.querySelector(".grid-container");
let cards = [];
let cardsCounter = 0;
let firstCard, secondCard;
let lockBoard = false;
let score1 = 0;
let playerName1 = "";

const score1El = document.querySelector(".score1");
const scoreBackgrounds = document.querySelectorAll(".score");

var level = (+localStorage.getItem("level") || 1);
score1El.textContent = score1;
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
        gridContainer.appendChild(cardElement);

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
    score1=score1+5;
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
        score1=score1-1;
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
function GameEnd() {
    const highscores = JSON.parse(localStorage.getItem("highscores-singleplayer") || "{}");
    highscores[playerName1] = score1;
    localStorage.setItem("highscores-singleplayer", JSON.stringify(highscores));
    localStorage.setItem("level", level + 1);
}
