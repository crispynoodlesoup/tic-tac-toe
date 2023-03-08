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
  let winStatus = "";
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
    // check for tie
    const moves = [...playerOne.getMoves(), ...playerTwo.getMoves()];
    if (moves.length === 9) {
      console.log("its a tie!");
      winStatus = "tie";
    }

    // check for win for each player
    winningPositions.forEach((pos) => {
      if (pos.every((index) => playerOne.getMoves().includes(index))) {
        console.log(`${playerOne.name} wins!`);
        winStatus = "playerOne";
      } else if (pos.every((index) => playerTwo.getMoves().includes(index))) {
        console.log(`${playerTwo.name} wins!`);
        winStatus = "playerTwo";
      }
    });
  };

  const getTurn = function () {
    return playerTurn;
  };

  const getWinStatus = function () {
    return winStatus;
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
    getWinStatus,
    getPlayerOne,
    getPlayerTwo,
  };
})();

// deals with board in the DOM
const Board = (() => {
  let boardArray;
  [...boardArray] = Array.from(document.querySelectorAll(".square div"));
  const turnTeller = document.querySelector("h2 span");
  const boardText = document.querySelector(".turn-teller");
  const sidebars = document.querySelectorAll("aside");

  const setupBoard = function () {
    boardText.style.visibility = "visible";
    turnTeller.textContent = Game.getPlayerOne().name;
    boardArray.forEach((div, index) => {
      div.classList.add("empty");
      div.addEventListener("click", () => displayMove(div, index));
    });
  };

  const displayMove = function (square, index) {
    if (!Game.getWinStatus() && square.className === "empty") {
      // animate square and display player color
      square.classList.add("animate");
      if (Game.getTurn() === "playerOne") {
        square.style.backgroundColor = Game.getPlayerOne().color;
      } else {
        square.style.backgroundColor = Game.getPlayerTwo().color;
      }

      // remove hover effect from selected square
      square.classList.remove("empty");

      // use logic to tell gameOver
      Game.makeMove(index);
      if (!!Game.getWinStatus()) {
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
    boardText.style.visibility = "hidden";
    boardArray.forEach((div) => {
      div.classList.remove("empty");
    });

    //create text element with winStatus
    let winText = document.createElement("h1");
    if (Game.getWinStatus() === "tie") {
      winText.textContent = "It's a Tie!";
    } else if (Game.getWinStatus() === "playerOne") {
      winText.textContent = `A Spectacular Victory for ${
        Game.getPlayerOne().name
      }!`;
    } else {
      winText.textContent = `A Spectacular Victory for ${
        Game.getPlayerTwo().name
      }!`;
    }

    // update sidebar
    winText.classList.add("grow");
    [...sidebars].forEach((side) => {
      side.classList.add("translate");
      side.appendChild(winText.cloneNode(true));
    });
  };

  return {
    setupBoard,
  };
})();

// for UI elements outside the Board
const Display = (() => {})();

Game.start("Blue", "#69c1e4", "Pink", "#ffa5b4");
Board.setupBoard();
