/* eslint-disable require-jsdoc */
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
  /*
  const printGameBoard = () => {
    console.log(board);
  };
  */
  // function to get the board
  function getGameBoard() {
    return board;
  };

  // function to add the mark to the board
  function addMarkToGameBoard(row, column, mark) {
    board[row][column] = mark;
  };

  // function to check the board if the move is valid
  function checkGameBoard(row, col, mark) {
    if (board[row][col] == '') {
      addMarkToGameBoard(row, col, mark);
      return true;
    }
    return false;
  };
  return {createGameBoard, getGameBoard, checkGameBoard};
})();

/* ------------------------------------------------- */
/* ------------------------------------------------- */
/* ------------------------------------------------- */

// factory function to make a playerß
const Player = (mark) => {
  function setMark(row, col) {
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
  let winTiles = [];

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
    if (computerFirst) {
      const zs = players[0];
      players[0] = players[1];
      players[1] = zs;
      // if (ScreenController.diffiBut.value === 'Unbeatable') {
      makeBestMove(Gameboard.getGameBoard());
      // } else {
      //  makeRndmMove(players[1]);
      // }
    }
  };

  // this function checks if there are 3 same marks in the columns
  const checkVertical = (currentBoard, mark, col) => {
    if (currentBoard[0][col] === mark) {
      if (currentBoard[1][col] === mark) {
        if (currentBoard[2][col] === mark) {
          winTiles = [[0, col], [1, col], [2, col]];
          return true;
        }
      }
    }
    return false;
  };

  // this function checks if there are 3 same marks in the row
  const checkHorizontal = (currentBoard, mark, row) => {
    if (currentBoard[row][1] === mark) {
      if (currentBoard[row][2] === mark) {
        winTiles = [[row, 0], [row, 1], [row, 2]];
        return true;
      }
    }
    return false;
  };

  function getWinner() {
    return winner;
  };

  function resetWinner() {
    winner = '';
  };

  // this function checks if there are 3 same marks in the diagonal
  const checkDiagonal = (currentBoard, mark) => {
    if (currentBoard[0][0] === mark) {
      if (currentBoard[1][1] === mark) {
        if (currentBoard[2][2] === mark) {
          winTiles = [[0, 0], [1, 1], [2, 2]];
          return true;
        }
      }
    }
    if (currentBoard[0][2] === mark) {
      if (currentBoard[1][1] === mark) {
        if (currentBoard[2][0] === mark) {
          winTiles = [[0, 2], [1, 1], [2, 0]];
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

  const getWinTiles = () => {
    return winTiles;
  };

  const resetWinTiles = () => {
    winTiles = [];
  };
  /* this function checks every winCondition and
  returns true if one of the win conditions is true */
  const checkWinner = (mark, currentBoard) => {
    let isWinner = false;
    for (let i = 0; i < currentBoard.length; i++) {
      if (i === 0) {
        for (let j = 0; j < currentBoard[i].length; j++) {
          if (checkVertical(currentBoard, mark, j)) {
            isWinner = true;
          }
        }
      }
      if (currentBoard[i][0] === mark) {
        if (checkHorizontal(currentBoard, mark, i)) {
          isWinner = true;
        }
      }
    }
    if (checkDiagonal(currentBoard, mark)) {
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

  // function to return points when a game is won or lost
  /* const getAllAvailableMoves = (board) => {
    const freeTiles = [];
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j] === '') {
          freeTiles.push([i, j]);
        }
      }
    }
    return freeTiles;
  }; */

  /* const getAllBoards = (player, board) => {
    const freeTiles = getAllAvailableMoves(board);
    const allBoards = [board];
    for (let i = 0; i < freeTiles.length; i++) {
      const row = freeTiles[i][0];
      const col = freeTiles[i][1];
      const tempBoard = [['', '', ''], ['', '', ''], ['', '', '']];
      for (let j = 0; j < tempBoard.length; j++) {
        for (let k = 0; k < tempBoard[j].length; k++) {
          tempBoard[j][k] = board[j][k];
        }
      }
      tempBoard[row][col] = player.mark;
      allBoards.push(tempBoard);
    }
    return allBoards;
  };
  */

  const minimax = (board, depth, isMaximizing) => {
    const computerWon = checkWinner(players[1].mark, board);
    resetWinner();
    const playerWon = checkWinner(players[0].mark, board);
    resetWinner();
    const winner = getWinner();
    resetWinner();
    let score;
    if (computerWon) {
      score = 10 - depth;
      return score;
    }
    if (playerWon) {
      score = depth - 10;
      return score;
    }
    if (winner === 'draw') {
      score = 0;
      return score;
    }
    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (board[i][j] === '') {
            board[i][j] = players[1].mark;
            const score = minimax(board, depth + 1, false);
            bestScore = Math.max(score, bestScore);
            board[i][j] = '';
          }
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (board[i][j] === '') {
            board[i][j] = players[0].mark;
            const score = minimax(board, depth + 1, true);
            bestScore = Math.min(score, bestScore);
            board[i][j] = '';
          }
        }
      }
      return bestScore;
    }
  };

  const makeBestMove = () => {
    const board = Gameboard.getGameBoard();
    const tempBoard = [['', '', ''], ['', '', ''], ['', '', '']];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        tempBoard[i][j] = board[i][j];
      }
    }
    let move;
    let bestScore = -Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (tempBoard[i][j] == '') {
          tempBoard[i][j] = players[1].mark;
          const score = minimax(tempBoard, 0, false);
          tempBoard[i][j] = '';
          if (score > bestScore) {
            bestScore = score;
            move = [i, j];
          }
        }
      }
    }
    makePCmove(players[1], move[0], move[1]);
  };


  /* const getAllBoardsWithAllMoves = () => {
    const allBoards = getAllBoards(players[1], Gameboard.getGameBoard());
    for (let i = 0; i < allBoards.length; i++) {
      getAllBoards(players[1], allBoards[i]);
    }
  };
  */


  const makeRndmMove = (player) => {
    const board = Gameboard.getGameBoard();
    let pcMark = false;
    do {
      pcMark = player.setMark(rndmNumber(3), rndmNumber(3));
    } while (!pcMark);
    if (checkWinner(player.mark, board)) {
      ScreenController.deleteBoardEventListeners();
      return;
    }
  };

  // function to make one move for the PC
  const makePCmove = (player, row, col) => {
    const board = Gameboard.getGameBoard();
    player.setMark(row, col);
    if (checkWinner(player.mark, board)) {
      ScreenController.deleteBoardEventListeners();
      return;
    }
  };


  // eslint-disable-next-line max-len
  // function to play one Round -> place one mark for the player and the computer
  const playRound = (row, col) => {
    const board = Gameboard.getGameBoard();
    if (players[0].setMark(row, col) === true) {
      if (checkWinner(players[0].mark, board) === true) {
        ScreenController.deleteBoardEventListeners();
        return;
      }
      setTimeout(() => {
        // if (ScreenController.diffiBut.value === 'Unbeatable') {
        makeBestMove(board);
        // } else {
        //  makeRndmMove(players[1]);
        // }
      }, 500);
    }
  };

  return {
    playRound, players,
    setComputerFirst, getComputerFirst,
    getWinner, resetWinner, getWinTiles, resetWinTiles};
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
  const diffiBut = document.getElementById('diffi');
  let clickAgain = true;

  newGameBut.addEventListener('click', () => {
    addDivClicks();
    Gameboard.createGameBoard();
    updateScreen();
    endGame.classList = ['invis'];
    game.resetWinner();
    showButtons();
    enableButtons();
    disableBoard();
    game.resetWinTiles();
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

  const disableBoard = () => {
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
    resetTileColors();
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
    if (clickAgain) {
      clickAgain = false;
      const classes = evt.currentTarget.classList;
      const row = classes[1].substring(classes[1].length - 1);
      const col = classes[2].substring(classes[2].length - 1);
      game.playRound(row, col);
      updateScreen();
      showResult();
      evt.currentTarget.removeEventListener('click', addMarkToDiv);
      setTimeout(() => {
        updateScreen();
        showResult();
        clickAgain = true;
      }, 1000);
    }
  };

  const makeWinTilesVisible = () => {
    const winTiles = game.getWinTiles();
    for (let i = 0; i < boardDivs.length; i++) {
      const classes = boardDivs[i].classList;
      const row = parseInt(classes[1].substring(classes[1].length - 1));
      const col = parseInt(classes[2].substring(classes[2].length - 1));
      for (let j = 0; j < winTiles.length; j++) {
        if (row === winTiles[j][0]) {
          if (col === winTiles[j][1]) {
            boardDivs[i].style.backgroundColor = '#f9dc5c';
          }
        }
      }
    }
  };

  const resetTileColors = () => {
    for (let i = 0; i < boardDivs.length; i++) {
      boardDivs[i].style.backgroundColor = 'white';
    }
  };

  const showResult = () => {
    const winner = game.getWinner();
    if (winner != '') {
      if (winner === 'player') {
        // eslint-disable-next-line max-len
        endGameText.innerText = 'Congratulations! You beat the ugly thief and saved the DuckWorld!';
        makeWinTilesVisible();
        endGame.classList = ['visible'];
      } else if (winner === 'computer') {
        // eslint-disable-next-line max-len
        endGameText.innerText = 'Oh No! You lost! Now the ugly thief will take over the DuckWorld!';
        makeWinTilesVisible();
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

  return {deleteBoardEventListeners, diffiBut};
})();

Gameboard.createGameBoard();
