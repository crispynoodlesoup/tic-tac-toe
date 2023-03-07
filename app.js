const Game = (() => {
  playerTurn = "blue";
  let boardArray;
  [...boardArray] = Array.from(document.querySelectorAll(".square div"));
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

  // for troubleshooting the board
  const print = function () {
    console.log(...boardArray);
    console.log(checkWin());
  };

  const makeMove = function (index) {};

  const checkWin = function () {};

  const displayWin = function () {};

  return {
    print,
    makeMove,
  };
})();

Game.print();
