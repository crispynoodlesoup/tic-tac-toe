// saves player information
const Player = (playerName, playerColor) => {
  const name = playerName;
  const color = playerColor;
  let moves = [];

  const makeMove = function (index) {
    return moves.push(index);
  };

  const getMoves = function () {
    return moves;
  };

  return {
    name,
    color,
    makeMove,
    getMoves,
  };
};

// deals with game logic
const Game = (() => {
  let ongoing = false;
  let playerTurn = "playerOne";
  const winningPositions = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 4, 6],
    [2, 5, 8],
    [3, 4, 5],
    [6, 7, 8],
  ];
  let playerOne;
  let playerTwo;

  const start = function (nameOne, colorOne, nameTwo, colorTwo) {
    playerOne = Player(nameOne, colorOne);
    playerTwo = Player(nameTwo, colorTwo);
    ongoing = true;
  };

  const makeMove = function (index) {
    if (playerTurn === "playerTwo") {
      playerTwo.makeMove(index);
      playerTurn = "playerOne";
    } else {
      playerOne.makeMove(index);
      playerTurn = "playerTwo";
    }

    checkWin();
  };

  const checkWin = function () {
    winningPositions.forEach((pos) => {
      if (pos.every((index) => playerOne.getMoves().includes(index))) {
        console.log(`${playerOne.name} wins!`);
        ongoing = false;
      } else if (pos.every((index) => playerTwo.getMoves().includes(index))) {
        console.log(`${playerTwo.name} wins!`);
        ongoing = false;
      }
    });
  };

  const getTurn = function () {
    return playerTurn;
  };

  const isOngoing = function () {
    return ongoing;
  };

  const getPlayerOne = function () {
    return playerOne;
  };

  const getPlayerTwo = function () {
    return playerTwo;
  };

  return {
    start,
    makeMove,
    getTurn,
    isOngoing,
    getPlayerOne,
    getPlayerTwo,
  };
})();

// deals with board display
const Board = (() => {
  let boardArray;
  [...boardArray] = Array.from(document.querySelectorAll(".square div"));
  const turnTeller = document.querySelector("h2 span");

  const setupBoard = function () {
    turnTeller.textContent = Game.getPlayerOne().name;
    boardArray.forEach((div, index) => {
      div.addEventListener("click", () => displayMove(div, index));
    });
  };

  const displayMove = function (square, index) {
    if (Game.isOngoing() && square.className === "empty") {
      // display color
      if (Game.getTurn() === "playerOne") {
        square.style.backgroundColor = Game.getPlayerOne().color;
      } else {
        square.style.backgroundColor = Game.getPlayerTwo().color;
      }

      // remove hover effect
      square.classList.remove("empty");

      // use logic to tell gameOver
      Game.makeMove(index);
      if (!Game.isOngoing()) {
        displayWin();
        return;
      }

      // flip turn teller
      if (Game.getTurn() === "playerOne") {
        turnTeller.textContent = Game.getPlayerOne().name;
        turnTeller.style.color = Game.getPlayerOne().color;
      } else {
        turnTeller.textContent = Game.getPlayerTwo().name;
        turnTeller.style.color = Game.getPlayerTwo().color;
      }
    }
  };

  const displayWin = function () {
    boardArray.forEach((div) => {
      div.classList.remove("empty");
    });
  };

  return {
    setupBoard,
  };
})();

Game.start("david", "#69c1e4", "harfinkle", "#ffa5b4");
Board.setupBoard();
