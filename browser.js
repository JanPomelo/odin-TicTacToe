/* eslint-disable new-cap */
'use strict';

const Gameboard = (() => {
  const board = [];
  const rows = 3;
  const columns = 3;

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push('');
    }
  }
  const getGameBoard = () => {
    return board;
  };

  const printGameBoard = () => {
    console.log(board);
  };

  const addMarkToGameBoard = (row, column, mark) => {
    board[row][column] = mark;
  };

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
  return {getGameBoard, checkGameBoard, printGameBoard};
})();

const Player = (mark) => {
  const setMark = (row, col) => {
    return Gameboard.checkGameBoard(row, col, mark);
  };
  return {mark, setMark};
};

const GameController = (() => {
  // initialize both players
  const players = [Player('O'), Player('X')];

  const rndmNumber = (max) => {
    return Math.floor(Math.random() * max);
  };

  const checkVertical = (board, mark, col) => {
    if (board[1][col] === mark) {
      if (board[2][col] === mark) {
        return true;
      }
    }
    return false;
  };

  const checkHorizontal = (board, mark, row) => {
    if (board[row][1] === mark) {
      if (board[row][2] === mark) {
        return true;
      }
    }
    return false;
  };

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

  const checkWinner = (mark) => {
    const board = Gameboard.getGameBoard();
    for (let i = 0; i < board.length; i++) {
      if (board[i][0] === mark) {
        if (i === 0) {
          for (let j = 0; j < board[i].length; j++) {
            if (checkVertical(board, mark, j)) {
              return true;
            }
          }
        }
        if (checkHorizontal(board, mark, i)) {
          console.log('horizontal');
          return true;
        }
      }
    }
    if (checkDiagonal(board, mark)) {
      return true;
    }
    return false;
  };

  const playRound = (row, col) => {
    let pcMark = false;
    if (players[0].setMark(row, col) === true) {
      Gameboard.printGameBoard();
      if (checkWinner(players[0].mark) === true) {
        // endGame(players[0]);
        console.log('Congrats, you won the game!');
      }
      do {
        pcMark = players[1].setMark(rndmNumber(3), rndmNumber(3));
      } while (!pcMark);
      if (checkWinner(players[1].mark)) {
        console.log('The ugly thief won the game!');
      }
    }
  };

  return {playRound};
})();

