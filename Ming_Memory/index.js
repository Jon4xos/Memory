const storeMultiplayerScores = JSON.parse(localStorage.getItem("highscores-multiplayer") || "{}");
const multiplayerScoreContainer = document.getElementById("multiplayerScores");

const storeSingleplayerScores = JSON.parse(localStorage.getItem("highscores-singleplayer") || "{}");
const singleplayerScoreContainer = document.getElementById("singleplayerScores");

const valuesMultiplayer = Object.entries(storeMultiplayerScores).map(entry => ({
    name: entry[0],
    score: entry[1]
}));

const valuesSingleplayer = Object.entries(storeSingleplayerScores).map(entry =>
    ({
        name: entry[0],
        level: entry[1].level,
        score: entry[1].score
    }));

valuesMultiplayer.sort((a, b) => b.score - a.score).forEach(value => {
    const element = document.createElement("div");
    element.innerText = value.name + ": " + value.score;
    multiplayerScoreContainer.appendChild(element);
});

valuesSingleplayer.sort((a,b) => {
    const score = b.level- a.level;
    return score === 0 ? b.score - b.score: score;
}).forEach(value => {
    const element = document.createElement("div");
    element.innerText = value.name + ": " + value.score +" in level " + value.level;
    singleplayerScoreContainer.appendChild(element);
});
