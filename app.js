// saves player information
const Player = (playerName) => {
  const name = playerName;
  let moves = [];

  const makeMove = function (index) {
    return moves.push(index);
  };

  const getMoves = function () {
    return moves;
  };

  return {
    name,
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
  let playerOne = Player("blue");
  let playerTwo = Player("pink");

  const start = function () {
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

    checkWin.call(this);
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

  return {
    start,
    makeMove,
    getTurn,
    isOngoing,
  };
})();

// deals with board display
const Board = (() => {
  let boardArray;
  [...boardArray] = Array.from(document.querySelectorAll(".square div"));
  const turnTeller = document.querySelector("h2 span");

  const setupBoard = function () {
    Game.start();
    boardArray.forEach((div, index) => {
      div.addEventListener("click", () => displayMove(div, index));
    });
  };

  const displayMove = function (square, index) {
    if (Game.isOngoing() && square.className === "empty") {
      // display color
      square.classList.add(Game.getTurn());
      square.classList.remove("empty");

      // use logic to tell gameOver
      Game.makeMove(index);
      if (!Game.isOngoing()) displayWin();

      // flip turn teller
      if (Game.getTurn() === "playerOne") {
        turnTeller.textContent = "blue";
        turnTeller.style.color = "#69c1e4";
      } else {
        turnTeller.textContent = "pink";
        turnTeller.style.color = "#ffa5b4";
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
    displayWin,
  };
})();

Board.setupBoard();
