// saves player information
const Player = (playerName, playerColor) => {
  const name = playerName;
  const color = playerColor;
  let moves = [];

  const makeMove = function (index) {
    moves.push(index);
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

const Robot = (playerName, playerColor) => {
  const prototype = Player(playerName, playerColor);
  let opponentMoves = [];

  const generateMove = function (index) {
    // record opponent response
    opponentMoves.push(index);

    const legalMoves = getLegalMoves();
    const myMoves = prototype.getMoves();
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

    // best move starts initializes with a random move
    let bestMove = Math.floor(Math.random() * legalMoves.length);
    winningPositions.forEach((arr) => {
      // check if opponent has a winning move
      if (getSharedElements(arr, opponentMoves).length === 2) {
        //iterate through arr until we find a legal move
        arr.forEach((index) => {
          if (legalMoves.includes(index)) {
            bestMove = legalMoves.indexOf(index);
          }
        });
      }
      // check for immediately winning moves
      if (getSharedElements(arr, myMoves).length === 2) {
        //iterate through arr until we find a legal move
        arr.forEach((index) => {
          if (legalMoves.includes(index)) {
            bestMove = legalMoves.indexOf(index);
          }
        });
      }
    });

    return legalMoves[bestMove];
  };

  // returns the intersection of two arrays
  const getSharedElements = function (arrayOne, arrayTwo) {
    return [...arrayOne].filter((item) => arrayTwo.includes(item));
  };

  const getLegalMoves = function () {
    const allSquares = [...Array(9).keys()];
    return allSquares.filter((index) => {
      return (
        !opponentMoves.includes(index) && !prototype.getMoves().includes(index)
      );
    });
  };

  return Object.assign({}, prototype, { generateMove });
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

  const start = function (nameOne, colorOne, nameTwo, colorTwo, human) {
    playerOne = Player(nameOne, colorOne);

    if (human) {
      playerTwo = Player(nameTwo, colorTwo);
    } else {
      playerTwo = Robot(nameTwo, colorTwo);
    }

    winStatus = "";
    playerTurn = "playerOne";
  };

  const makeMove = function (index) {
    if (playerTurn === "playerOne") {
      playerOne.makeMove(index);
      playerTurn = "playerTwo";
    } else {
      playerTwo.makeMove(index);
      playerTurn = "playerOne";
    }

    checkWin();
  };

  const checkWin = function () {
    // check for win for each player
    winningPositions.forEach((pos) => {
      if (pos.every((index) => playerOne.getMoves().includes(index))) {
        winStatus = "playerOne";
      } else if (pos.every((index) => playerTwo.getMoves().includes(index))) {
        winStatus = "playerTwo";
      }
    });

    // check for tie
    const moves = [...playerOne.getMoves(), ...playerTwo.getMoves()];
    if (moves.length === 9 && !winStatus) {
      winStatus = "tie";
    }
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
  const boardArray = [...Array.from(document.querySelectorAll(".square div"))];
  const sidebars = [...Array.from(document.querySelectorAll("aside"))];
  const options = [...Array.from(document.querySelectorAll(".player-options"))];
  const boardText = document.querySelector(".turn-teller");
  const turnTeller = document.querySelector("h2 span");
  const board = document.querySelector(".board");
  let humanMode;

  const addBoardListeners = function () {
    boardArray.forEach((div, index) => {
      div.addEventListener("click", () => {
        if (div.className !== "empty") return;
        displayMove(div, index);
        if (!humanMode) {
          const robotMove = Game.getPlayerTwo().generateMove(index);
          const robotDiv = boardArray[robotMove];
          displayMove(robotDiv, robotMove);
        }
      });
    });
  };

  const addInputListeners = function () {
    options.forEach((side) => {
      side.addEventListener("transitionend", makeInvisible(side));
    });
  };

  const setupBoard = function (human) {
    humanMode = human;

    board.className = "board";
    sidebars.forEach((side) => {
      side.innerHTML = "";
      side.style.display = "none";
    });
    options.forEach((div) => {
      div.style.display = "grid";
      div.classList.add("invisible");
    });

    boardText.style.visibility = "visible";
    turnTeller.style.color = Game.getPlayerOne().color;
    turnTeller.textContent = Game.getPlayerOne().name;
    boardArray.forEach((div) => {
      div.className = "empty";
      div.style.backgroundColor = "";
    });
  };

  const displayMove = function (square, index) {
    if (!Game.getWinStatus()) {
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
    hideTurnTeller();

    // remove board hover effect
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
    sidebars.forEach((side) => {
      side.style.display = "grid";
      side.classList.add("translate");
      side.appendChild(winText.cloneNode(true));
    });
  };

  const makeInvisible = function (side) {
    side.style.visibility = "hidden";
  };

  const hideTurnTeller = function () {
    boardText.style.visibility = "hidden";
  };

  return {
    addBoardListeners,
    addInputListeners,
    setupBoard,
    makeInvisible,
    hideTurnTeller,
    board,
  };
})();

// for UI elements outside the Board
const Display = (() => {
  const colorPickers = [
    ...Array.from(document.querySelectorAll(".color-picker")),
  ];
  const textInputs = [...Array.from(document.querySelectorAll(".name-input"))];
  const sidebars = [...Array.from(document.querySelectorAll("aside"))];
  const options = [...Array.from(document.querySelectorAll(".player-options"))];
  const playerSelect = document.querySelector(".player-select");
  const pauseMessage = document.querySelector(".pause-message");
  const settings = document.querySelector("#settings");
  const modal = document.querySelector(".modal");
  const play = document.querySelector(".play");
  const colors = [
    "hsl(197, 94%, 80%)",
    "hsl(350, 100%, 88%)",
    "hsl(33, 100%, 84%)",
    "hsl(98, 74%, 77%)",
    "hsl(300, 47%, 75%)",
    "hsl(29, 46%, 65%)",
    "hsl(240, 100%, 69%)",
    "hsl(0, 100%, 71%)",
    "hsl(0, 0%, 25%)",
  ];
  const borderColors = [
    "hsl(197, 94%, 65%)",
    "hsl(350, 100%, 78%)",
    "hsl(33, 100%, 72%)",
    "hsl(98, 74%, 64%)",
    "hsl(300, 47%, 63%)",
    "hsl(29, 46%, 50%)",
    "hsl(240, 100%, 58%)",
    "hsl(0, 100%, 61%)",
    "hsl(0, 0%, 0%)",
  ];
  let colorOne = colors[0];
  let colorTwo = colors[1];

  const start = function () {
    colorPickers[0].children[0].style.border = "6px solid hsl(197, 94%, 65%)";
    colorPickers[1].children[1].style.border = "6px solid hsl(350, 100%, 78%)";
    handleColors();
    handlePlayerSelect();
    play.addEventListener("click", handlePlayButton);
    settings.addEventListener("click", handleSettings);
    Board.addBoardListeners();
  };

  // adds a listener to each child of colorPicker
  const handleColors = function () {
    colorPickers.forEach((side, sideIndex) => {
      Array.from(side.children).forEach((child, index) => {
        child.addEventListener("click", () => {
          // if the other player already has that color, return
          pauseMessage.textContent = "";
          if (sideIndex === 0 && colorTwo === colors[index]) {
            pauseMessage.textContent = "Please choose different colors!";
            return;
          }
          if (sideIndex === 1 && colorOne === colors[index]) {
            pauseMessage.textContent = "Please choose different colors!";
            return;
          }

          // set all other colors to not have borders
          Array.from(child.parentNode.children).forEach((brother) => {
            brother.style.border = "none";
          });

          // set border and colors
          child.style.border = `6px solid ${borderColors[index]}`;
          if (sideIndex === 0) {
            colorOne = colors[index];
          } else {
            colorTwo = colors[index];
          }
        });
      });
    });
  };

  const handlePlayButton = function () {
    // make naming optional using preset variables
    let nameOne = "Player 1";
    let nameTwo = "Player 2";
    if (textInputs[0].value) nameOne = textInputs[0].value;
    if (textInputs[1].value) nameTwo = textInputs[1].value;

    // check if player 2 is human or robot
    const isHuman = playerSelect.children[0].classList.contains("selected");

    Game.start(nameOne, colorOne, nameTwo, colorTwo, isHuman);

    pauseMessage.textContent = "";
    modal.style.display = "none";
    play.textContent = "New Game!";

    Board.setupBoard(isHuman);
    Board.addInputListeners();
  };

  const handleSettings = function () {
    Board.hideTurnTeller();
    sidebars.forEach((side) => (side.style.display = "none"));
    options.forEach((side) => {
      pauseMessage.textContent = "";
      if (side.style.visibility !== "hidden") {
        pauseMessage.textContent =
          "You're already in settings, start a new game!";
      }

      side.removeEventListener("transitionend", Board.makeInvisible);
      side.style.display = "grid";
      side.style.visibility = "visible";
      side.className = "player-options";

      modal.style.display = "grid";
      Board.board.className = "board board-blur";
    });
  };

  const handlePlayerSelect = function () {
    playerSelect.children[0].addEventListener("click", () => {
      playerSelect.children[0].className = "human selected";
      playerSelect.children[1].className = "robot";
      pauseMessage.textContent = "";
    });
    playerSelect.children[1].addEventListener("click", () => {
      playerSelect.children[0].className = "human";
      playerSelect.children[1].className = "robot selected";
      pauseMessage.textContent = "If you're tough enough, you can beat him!";
    });
  };

  return {
    start,
  };
})();

Display.start();

const robot = Robot("blue", "#ffffff");
