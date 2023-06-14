const storeMultiplayerScores = JSON.parse(localStorage.getItem("highscores-multiplayer") || "{}");
const multiplayerScoreContainer = document.getElementById("multiplayerScores");

const storeSingleplayerScores = JSON.parse(localStorage.getItem("highscores-singleplayer") || "{}");
const singleplayerScoreContainer = document.getElementById("singleplayerScores");

const valuesMultiplayer = Object.entries(storeMultiplayerScores).map(entry => ({
    name: entry[0],
    score: entry[1]
}));

const valuesSingleplayer = Object.entries(storeSingleplayerScores).map(entry => ({
    name2: entry[0],
    level2: entry[1],
    score2: entry[2]
}));

valuesMultiplayer.sort((a, b) => b.score - a.score).forEach(value => {
    const element = document.createElement("div");
    element.innerText = value.name + ": " + value.score;
    multiplayerScoreContainer.appendChild(element);
});

valuesSingleplayer.sort((a,b) => b.score- a.score2).forEach(value => {
    const element = document.createElement("div");
    element.innerText = value.name2 + ": " + value.level2 +":" + value.score2;
    singleplayerScoreContainer.appendChild(element);
});
