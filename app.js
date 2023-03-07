const Game = (() => {
  playerTurn = "blue";
  let boardArray;
  [...boardArray] = Array.from(document.querySelectorAll(".square div"));

  // for troubleshooting
  const print = function () {
    console.log(...boardArray);
  };

  return {
    print,
  };
})();

Game.print();
