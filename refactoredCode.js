"use strict";

// Selecting elements
const select = (selector) => document.querySelector(selector);
const selectAll = (selector) => document.querySelectorAll(selector);

const elements = {
  player0El: select(".player--0"),
  player1El: select(".player--1"),
  score0El: select("#score--0"),
  score1El: select("#score--1"),
  current0El: select("#current--0"),
  current1El: select("#current--1"),
  startBox: select(".startBox"),
  startButton: select(".startButton"),
  main: select(".main"),
  gambleScreen: select(".gambleScreen"),
  diceEl: select(".dice"),
};

// Selecting buttons
const buttons = {
  btnNew: select(".btn--new"),
  btnRoll: select(".btn--roll"),
  btnHold: select(".btn--hold"),
  btnGamblePlayer0: select(".player--0 .gamble"),
  btnGamblePlayer1: select(".player--1 .gamble"),
  btnGambleRedPlayer0: select(".player--0 .gambleRed"),
  btnGambleBlackPlayer0: select(".player--0 .gambleBlack"),
  btnGambleRedPlayer1: select(".player--1 .gambleRed"),
  btnGambleBlackPlayer1: select(".player--1 .gambleBlack"),
};

let scores, currentScore, activePlayer, playing;

// Starting conditions
const initializeGame = () => {
  scores = [0, 0];
  currentScore = 0;
  activePlayer = 0;
  playing = true;

  elements.score0El.textContent = 0;
  elements.score1El.textContent = 0;
  elements.current0El.textContent = 0;
  elements.current1El.textContent = 0;

  elements.diceEl.classList.add("hidden");
  elements.player0El.classList.remove("player--winner", "player--active");
  elements.player1El.classList.remove("player--winner", "player--active");
  elements.player0El.classList.add("player--active");
  resetGambleButtons();
};

initializeGame();

// Switching function for players
const switchPlayer = () => {
  elements.current0El.textContent = elements.current1El.textContent = 0;
  currentScore = 0;
  activePlayer = activePlayer === 0 ? 1 : 0;
  elements.player0El.classList.toggle("player--active");
  elements.player1El.classList.toggle("player--active");
  resetGambleButtons();
};

// Rolling dice function
const rollDice = () => {
  if (playing) {
    const dice = Math.trunc(Math.random() * 6) + 1;
    elements.diceEl.classList.remove("hidden");
    elements.diceEl.src = `dice-${dice}.png`;

    if (dice === 1) return switchPlayer();

    currentScore += dice;
    const potentialScore = currentScore + scores[activePlayer];

    if (potentialScore === 101) {
      scores[activePlayer] = 1;
      elements[`score${activePlayer}El`].textContent = scores[activePlayer];
      switchPlayer();
    } else if (potentialScore >= 100) {
      holdScore();
    }

    elements[`current${activePlayer}El`].textContent = currentScore;
    resetGambleButtons();
  }
};

// Holding scores function
const holdScore = () => {
  if (playing) {
    scores[activePlayer] += currentScore;
    elements[`score${activePlayer}El`].textContent = scores[activePlayer];

    if (scores[activePlayer] >= 100) {
      playing = false;
      elements.diceEl.classList.add("hidden");
      buttons.btnRoll.classList.add("hidden");
      buttons.btnHold.classList.add("hidden");
      buttons.btnGamblePlayer0.classList.add("hidden");
      buttons.btnGamblePlayer1.classList.add("hidden");
      elements[`player${activePlayer}El`].classList.add("player--winner");
      elements[`player${activePlayer}El`].classList.remove("player--active");
    } else {
      switchPlayer();
    }
  }
};

// Rest of your functions...

// Event listeners
buttons.btnRoll.addEventListener("click", rollDice);
buttons.btnHold.addEventListener("click", holdScore);
buttons.btnNew.addEventListener("click", () => {
  initializeGame();
  buttons.btnRoll.classList.remove("hidden");
  buttons.btnHold.classList.remove("hidden");
});

document.addEventListener("keydown", (event) => {
  if (playing && (event.keyCode === 32 || event.keyCode === 13)) {
    event.keyCode === 32 ? rollDice() : holdScore();
  }
});

selectAll(".btn").forEach((button) => {
  button.addEventListener("click", () => {
    button.blur();
  });
});

buttons.startButton.addEventListener("click", () => {
  elements.main.classList.remove("hidden");
  elements.startBox.classList.add("hidden");
});

buttons.btnGamblePlayer0.addEventListener("click", () => handleGambleClick(0));
buttons.btnGamblePlayer1.addEventListener("click", () => handleGambleClick(1));
// More button event listeners...
