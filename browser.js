/* eslint-disable new-cap */
'use strict';

const Gameboard = (() => {
  const board = [];
  const rows = 3;
  const columns = 3;

  // create the board
  const createGameBoard = () => {
    for (let i = 0; i < rows; i++) {
      board[i] = [];
      for (let j = 0; j < columns; j++) {
        board[i].push('');
      }
    }
  };

  const printGameBoard = () => {
    console.log(board);
  };
  // function to get the board
  const getGameBoard = () => {
    return board;
  };

  // function to add the mark to the board
  const addMarkToGameBoard = (row, column, mark) => {
    board[row][column] = mark;
  };

  // function to check the board if the move is valid
  const checkGameBoard = (row, col, mark) => {
    if (board[row][col] == '') {
      addMarkToGameBoard(row, col, mark);
      return true;
    } else {
      if (mark === 'O') {
        console.log(`The tile [${row},${col}] is already taken.`);
      }
      return false;
    }
  };
  return {createGameBoard, getGameBoard, checkGameBoard, printGameBoard};
})();

/* ------------------------------------------------- */
/* ------------------------------------------------- */
/* ------------------------------------------------- */

// factory function to make a playerß
const Player = (mark) => {
  const setMark = (row, col) => {
    return Gameboard.checkGameBoard(row, col, mark);
  };
  return {mark, setMark};
};

/* ------------------------------------------------- */
/* ------------------------------------------------- */
/* ------------------------------------------------- */
/* ------------------------------------------------- */

const GameController = (() => {
  // initialize both players
  let players = [];
  let computerFirst = false;
  let winner = '';
  // this function calculates a random number for the easy Computer bot
  const rndmNumber = (max) => {
    return Math.floor(Math.random() * max);
  };

  const getComputerFirst = () => {
    return computerFirst;
  };

  const setComputerFirst = (value) => {
    players = [Player('O'), Player('X')];
    computerFirst = value;
    console.log({computerFirst});
    if (computerFirst) {
      console.log(computerFirst);
      const zs = players[0];
      players[0] = players[1];
      players[1] = zs;
      makePCmove(players[1]);
    }
  };

  // this function checks if there are 3 same marks in the columns
  const checkVertical = (board, mark, col) => {
    if (board[0][col] === mark) {
      if (board[1][col] === mark) {
        if (board[2][col] === mark) {
          return true;
        }
      }
    }
    return false;
  };

  // this function checks if there are 3 same marks in the row
  const checkHorizontal = (board, mark, row) => {
    if (board[row][1] === mark) {
      if (board[row][2] === mark) {
        return true;
      }
    }
    return false;
  };

  const getWinner = () => {
    return winner;
  };

  const resetWinner = () => {
    winner = '';
  };

  // this function checks if there are 3 same marks in the diagonal
  const checkDiagonal = (board, mark) => {
    if (board[0][0] === mark) {
      if (board[1][1] === mark) {
        if (board[2][2] === mark) {
          return true;
        }
      }
    }
    if (board[0][2] === mark) {
      if (board[1][1] === mark) {
        if (board[2][0] === mark) {
          return true;
        }
      }
    }
    return false;
  };

  const checkDraw = () => {
    const board = Gameboard.getGameBoard();
    let emptyCount = 0;
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j] === '') {
          emptyCount++;
        }
      }
    }
    if (emptyCount === 0) {
      return true;
    }
    return false;
  };

  /* this function checks every winCondition and
  returns true if one of the win conditions is true */
  const checkWinner = (mark) => {
    let isWinner = false;
    const board = Gameboard.getGameBoard();
    for (let i = 0; i < board.length; i++) {
      if (i === 0) {
        for (let j = 0; j < board[i].length; j++) {
          if (checkVertical(board, mark, j)) {
            isWinner = true;
          }
        }
      }
      if (board[i][0] === mark) {
        if (checkHorizontal(board, mark, i)) {
          isWinner = true;
        }
      }
    }
    if (checkDiagonal(board, mark)) {
      isWinner = true;
    }
    if (isWinner) {
      if (computerFirst) {
        if (mark === 'O') {
          winner = 'computer';
        } else {
          winner = 'player';
        }
      } else {
        if (mark === 'O') {
          winner = 'player';
        } else {
          winner = 'computer';
        }
      }
    } else if (checkDraw()) {
      isWinner = true;
      winner = 'draw';
    }
    return isWinner;
  };

  // function to make one move for the PC
  const makePCmove = (player) => {
    let pcMark = false;
    do {
      pcMark = player.setMark(rndmNumber(3), rndmNumber(3));
    } while (!pcMark);
    Gameboard.printGameBoard();
    if (checkWinner(player.mark)) {
      ScreenController.deleteBoardEventListeners();
      return;
    }
  };


  // eslint-disable-next-line max-len
  // function to play one Round -> place one mark for the player and the computer
  const playRound = (row, col) => {
    if (players[0].setMark(row, col) === true) {
      if (checkWinner(players[0].mark) === true) {
        ScreenController.deleteBoardEventListeners();
        return;
      }
      makePCmove(players[1]);
    }
  };

  return {
    playRound, players,
    setComputerFirst, getComputerFirst,
    getWinner, resetWinner};
});

/* ------------------------------------------------- */
/* ------------------------------------------------- */
/* ------------------------------------------------- */
/* ------------------------------------------------- */

const ScreenController = (() => {
  const game = GameController();
  const domBoard = document.getElementById('gameBoard');
  const buttonMarkO = document.getElementById('markO');
  const buttonMarkX = document.getElementById('markX');
  const endGame = document.getElementById('endGame');
  const endGameText = document.getElementById('endGameText');
  const newGameBut = document.getElementById('newGame');

  newGameBut.addEventListener('click', () => {
    addDivClicks();
    Gameboard.createGameBoard();
    updateScreen();
    endGame.classList = ['invis'];
    game.resetWinner();
    showButtons();
    enableButtons();
    disableBoard();
  });

  const disableButtons = () => {
    buttonMarkO.disabled = true;
    buttonMarkX.disabled = true;
  };

  const hideButtons = () => {
    buttonMarkO.style.visibility = 'hidden';
    buttonMarkX.style.visibility = 'hidden';
  };

  const showButtons = () => {
    buttonMarkO.style.visibility = 'visible';
    buttonMarkX.style.visibility = 'visible';
  };

  const enableButtons = () => {
    buttonMarkO.disabled = false;
    buttonMarkX.disabled = false;
  };

  const disableBoard = (evt) => {
    domBoard.classList = ['boardInvis'];
  };

  const enableBoard = (evt) => {
    domBoard.classList = ['boardVisi'];
    if (evt.currentTarget.innerText === 'O') {
      game.setComputerFirst(false);
    } else {
      game.setComputerFirst(true);
      updateScreen();
    }
    disableButtons();
    hideButtons();
  };

  buttonMarkO.addEventListener('click', enableBoard);
  buttonMarkX.addEventListener('click', enableBoard);


  const boardDivs = document.getElementsByClassName('boardDiv');

  const updateScreen = () => {
    let boardDivCounter = 0;
    const board = Gameboard.getGameBoard();
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        boardDivs[boardDivCounter].innerText = board[i][j];
        boardDivCounter++;
      }
    }
  };

  const deleteBoardEventListeners = () => {
    const first = game.getComputerFirst();
    for (let i = 0; i < boardDivs.length; i++) {
      if (boardDivs[i].innerText === '') {
        boardDivs[i].removeEventListener('click', addMarkToDiv);
      }
      if (first) {
        if (boardDivs[i].innerText === 'O') {
          boardDivs[i].removeEventListener('click', addMarkToDiv);
        }
      } else {
        if (boardDivs[i].innerText === 'X') {
          boardDivs[i].removeEventListener('click', addMarkToDiv);
        }
      }
    }
  };

  const addMarkToDiv = (evt) => {
    const classes = evt.currentTarget.classList;
    const row = classes[1].substring(classes[1].length - 1);
    const col = classes[2].substring(classes[2].length - 1);
    game.playRound(row, col);
    updateScreen();
    evt.currentTarget.removeEventListener('click', addMarkToDiv);
    showResult();
  };

  const showResult = () => {
    const winner = game.getWinner();
    if (winner != '') {
      if (winner === 'player') {
        // eslint-disable-next-line max-len
        endGameText.innerText = 'Congratulations! You beat the ugly thief and saved the DuckWorld!';
        endGame.classList = ['visible'];
      } else if (winner === 'computer') {
        // eslint-disable-next-line max-len
        endGameText.innerText = 'Oh No! You lost! Now the ugly thief will take over the DuckWorld!';
        endGame.classList = ['visible'];
      } else {
        // eslint-disable-next-line max-len
        endGameText.innerText = `It's a draw! Try to beat the ugly thief in the next round! Good luck!`;
        endGame.classList = ['visible'];
      }
    }
  };
  const addDivClicks = () => {
    for (let i = 0; i < boardDivs.length; i++) {
      boardDivs[i].addEventListener('click', addMarkToDiv);
    }
  };

  addDivClicks();

  return {deleteBoardEventListeners};
})();

Gameboard.createGameBoard();
