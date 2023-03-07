// saves player information
const Player = (playerName) => {
  const name = playerName;
  let moves = [];

  const addMove = function (index) {
    return moves.push(index);
  };

  const getMoves = function () {
    return moves;
  };

  return {
    name,
    addMove,
    getMoves,
  };
};

// deals with board display
const Board = (() => {
  let boardArray;
  [...boardArray] = Array.from(document.querySelectorAll(".square div"));

  // for troubleshooting the board
  const print = function () {
    console.log(...boardArray);
  };

  const setupBoard = function (eventHandler) {
    boardArray.forEach((div) => {
      div.addEventListener("click", (e) => eventHandler());
    });
  };

  const displayMove = function (color, index) {};

  const displayWin = function (color) {};

  return {
    print,
    setupBoard,
    displayWin,
  };
})();

// deals with game logic
const Game = (() => {
  playerTurn = "blue";
  const pink = Player("pink");
  const blue = Player("blue");
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

  const startGame = function () {};

  const makeMove = function (index) {
    checkWin();
  };

  const checkWin = function () {};

  return {
    makeMove,
  };
})();
