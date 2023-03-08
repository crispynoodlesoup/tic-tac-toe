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
  let winStatus;
  let playerTurn;

  const start = function (nameOne, colorOne, nameTwo, colorTwo) {
    playerOne = Player(nameOne, colorOne);
    playerTwo = Player(nameTwo, colorTwo);
    winStatus = "";
    playerTurn = "playerOne";
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
  let options;
  [...options] = Array.from(document.querySelectorAll(".player-options"));

  const addListeners = function () {
    boardArray.forEach((div, index) => {
      div.addEventListener("click", () => displayMove(div, index));
    });
    options.forEach((side) => {
      side.addEventListener("transitionend");
    });
  };

  const setupBoard = function () {
    [...sidebars].forEach((side) => {
      side.innerHTML = "";
      side.style.display = "none";
    });
    options.forEach((div) => {
      div.style.display = "grid";
      div.classList.add("invisible");
    });

    boardText.style.visibility = "visible";
    turnTeller.textContent = Game.getPlayerOne().name;
    boardArray.forEach((div, index) => {
      div.className = "empty";
      div.style.backgroundColor = "";
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
    // hide turn-teller
    boardText.style.visibility = "hidden";
    boardArray.forEach((div) => {
      div.classList.remove("empty");
    });

    // hide player options
    options.forEach((div) => {
      div.style.display = "none";
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

    // update sidebar with winner
    winText.classList.add("grow");
    [...sidebars].forEach((side) => {
      side.style.display = "grid";
      side.classList.add("translate");
      side.appendChild(winText.cloneNode(true));
    });
  };

  return {
    addListeners,
    setupBoard,
  };
})();

// for UI elements outside the Board
const Display = (() => {
  const play = document.querySelector(".play");

  const start = function () {
    play.addEventListener("click", () => {
      Game.start("Blue", "#69c1e4", "Pink", "#ffa5b4");
      Board.setupBoard();
    });
  };

  const fillColorBoard = function () {
    let borderColors = [
      "hsl(197, 94%, 70%)",
      "hsl(350, 100%, 78%)",
      "hsl(300, 47%, 65%)",
      "hsl(33, 100%, 74%)",
      "hsl(0, 0%, 15%)",
      "hsl(29, 46%, 55%)",
      "hsl(98, 74%, 67%)",
      "hsl(0, 100%, 61%)",
      "hsl(240, 100%, 59%)",
    ];
  };

  return {
    start,
  };
})();

Display.start();
