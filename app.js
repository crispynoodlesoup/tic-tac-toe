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
  let playerTurn = "blue";
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

  const makeMove = function (index) {
    if (playerTurn === "blue") {
      blue.makeMove(index);
      playerTurn = "pink";
    } else {
      pink.makeMove(index);
      playerTurn = "blue";
    }

    checkWin();
  };

  const checkWin = function () {
    winningPositions.forEach((pos) => {
      if (pos.every((index) => pink.getMoves().includes(index))) {
        console.log("pink wins!");
        Game.ongoing = false;
      } else if (pos.every((index) => blue.getMoves().includes(index))) {
        console.log("blue wins!");
        Game.ongoing = false;
      }
    });
  };

  const getTurn = function () {
    return playerTurn;
  };

  return {
    ongoing,
    makeMove,
    getTurn,
  };
})();

// deals with board display
const Board = (() => {
  let boardArray;
  [...boardArray] = Array.from(document.querySelectorAll(".square div"));

  const setupBoard = function () {
    Game.ongoing = true;
    boardArray.forEach((div, index) => {
      div.addEventListener("click", () => displayMove(div, index));
    });
  };

  const displayMove = function (square, index) {
    if (Game.ongoing && square.className === "empty") {
      square.classList.add(Game.getTurn());
      square.classList.remove("empty");
      Game.makeMove(index);
      if (!Game.ongoing) displayWin();
    }
  };

  const displayWin = function () {
    boardArray.forEach((div) => {
      div.classList.remove("empty");
      console.log("hi");
    });
  };

  return {
    setupBoard,
    displayWin,
  };
})();

Board.setupBoard();
