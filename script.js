"use strict";

// Selecting elements
const player0El = document.querySelector(".player--0");
const player1El = document.querySelector(".player--1");
const score0El = document.querySelector("#score--0");
const score1El = document.getElementById("score--1");
const current0El = document.getElementById("current--0");
const current1El = document.getElementById("current--1");
const startBox = document.querySelector(".startBox");
const startButton = document.querySelector(".startButton");
const main = document.querySelector(".main");
const gambleScreen = document.querySelector(".gambleScreen");

// Selecting buttons
const diceEl = document.querySelector(".dice");
const btnNew = document.querySelector(".btn--new");
const btnRoll = document.querySelector(".btn--roll");
const btnHold = document.querySelector(".btn--hold");
const btnGamblePlayer0 = document.querySelector(".player--0 .gamble");
const btnGamblePlayer1 = document.querySelector(".player--1 .gamble");
const btnGambleRedPlayer0 = document.querySelector(".player--0 .gambleRed");
const btnGambleBlackPlayer0 = document.querySelector(".player--0 .gambleBlack");
const btnGambleRedPlayer1 = document.querySelector(".player--1 .gambleRed");
const btnGambleBlackPlayer1 = document.querySelector(".player--1 .gambleBlack");

let scores, currentScore, activePlayer, playing;

// Starting conditions
const init = function () {
  scores = [0, 0];
  currentScore = 0;
  activePlayer = 0;
  playing = true;

  score0El.textContent = 0;
  score1El.textContent = 0;
  current0El.textContent = 0;
  current1El.textContent = 0;

  diceEl.classList.add("hidden");
  player0El.classList.remove("player--winner");
  player1El.classList.remove("player--winner");
  player0El.classList.add("player--active");
  player1El.classList.remove("player--active");
  resetGambleButtons();
};
init();

// switching function for players
const switchPlayer = function () {
  document.getElementById(`current--${activePlayer}`).textContent = 0;
  currentScore = 0;
  activePlayer = activePlayer === 0 ? 1 : 0;
  player0El.classList.toggle("player--active");
  player1El.classList.toggle("player--active");
  resetGambleButtons();
};

// rolling dice function
function rollDice() {
  if (playing) {
    // 1. Generating a random dice roll
    const dice = Math.trunc(Math.random() * 6) + 1;

    // 2. Display dice
    diceEl.classList.remove("hidden");
    diceEl.src = `dice-${dice}.png`;

    // 3. Check for rolled 1
    if (dice === 1) return switchPlayer();
    // Add dice to current score
    currentScore += dice;
    const potentialScore = currentScore + scores[activePlayer];

    //if score is 101 player starts again from 1 point
    if (potentialScore === 101) {
      scores[activePlayer] = 1;
      document.getElementById(`score--${activePlayer}`).textContent =
        scores[activePlayer];
      switchPlayer();

      // Cheking if score is above 100
    } else if (potentialScore >= 100) {
      holdScore();
    }
    document.getElementById(`current--${activePlayer}`).textContent =
      currentScore;
    resetGambleButtons();
  }
}

// holding scores function
function holdScore() {
  if (playing) {
    // 1. Add current score to active player's score
    scores[activePlayer] += currentScore;
    document.getElementById(`score--${activePlayer}`).textContent =
      scores[activePlayer];

    // 2. Check if player's score is >= 100
    if (scores[activePlayer] >= 100) {
      // Finish the game
      playing = false;
      diceEl.classList.add("hidden");
      btnRoll.classList.add("hidden");
      btnHold.classList.add("hidden");
      btnGamblePlayer0.classList.add("hidden");
      btnGamblePlayer1.classList.add("hidden");

      document
        .querySelector(`.player--${activePlayer}`)
        .classList.add("player--winner");
      document
        .querySelector(`.player--${activePlayer}`)
        .classList.remove("player--active");
    } else {
      switchPlayer();
    }
  }
}

// adding buttons to the keyboard
function handleKeyPress(event) {
  // Check if the game is playing and the pressed key is either space (keycode 32) or enter (keycode 13)
  if (playing) {
    if (event.keyCode === 32) {
      // Spacebar was pressed, roll the dice
      rollDice();
    } else if (event.keyCode === 13) {
      // Enter key was pressed, hold the score
      holdScore();
    }
  }
}

// Gamble function
function handleGambleClick(player) {
  if (player === 0) {
    btnGambleRedPlayer0.classList.remove("hidden");
    btnGambleBlackPlayer0.classList.remove("hidden");
  } else {
    btnGambleRedPlayer1.classList.remove("hidden");
    btnGambleBlackPlayer1.classList.remove("hidden");
  }
}

// reset buttons function
function resetGambleButtons() {
  btnGambleRedPlayer0.classList.add("hidden");
  btnGambleBlackPlayer0.classList.add("hidden");
  btnGambleRedPlayer1.classList.add("hidden");
  btnGambleBlackPlayer1.classList.add("hidden");

  // button disable
  const isDisabled =
    scores[activePlayer] === 0 || scores[activePlayer] > 49 || currentScore > 0;
  if (activePlayer === 0) {
    btnGamblePlayer0.disabled = isDisabled;
    btnGamblePlayer1.disabled = true;
  } else {
    btnGamblePlayer0.disabled = true;
    btnGamblePlayer1.disabled = isDisabled;
  }
}

// getting result from gamble
function gambleResult(choice) {
  if (Math.random() > 0.5) {
    scores[activePlayer] *= 2;
    document.getElementById(`score--${activePlayer}`).textContent =
      scores[activePlayer];
  } else {
    scores[activePlayer] = 0;
    document.getElementById(`score--${activePlayer}`).textContent =
      scores[activePlayer];
  }
  switchPlayer();
}

// Rolling dice functionality
btnRoll.addEventListener("click", rollDice);
btnHold.addEventListener("click", holdScore);
btnNew.addEventListener("click", () => {
  init();
  btnRoll.classList.remove("hidden");
  btnHold.classList.remove("hidden");
});

document.addEventListener("keydown", handleKeyPress);

document.querySelectorAll(".btn").forEach((button) => {
  button.addEventListener("click", () => {
    button.blur();
  });
});
startButton.addEventListener("click", function () {
  main.classList.remove("hidden");
  startBox.classList.add("hidden");
});
btnGamblePlayer0.addEventListener("click", () => handleGambleClick(0));
btnGamblePlayer1.addEventListener("click", () => handleGambleClick(1));

btnGambleBlackPlayer0.addEventListener("click", () => gambleResult("black"));
btnGambleRedPlayer0.addEventListener("click", () => gambleResult("red"));
btnGambleBlackPlayer1.addEventListener("click", () => gambleResult("black"));
btnGambleRedPlayer1.addEventListener("click", () => gambleResult("red"));
