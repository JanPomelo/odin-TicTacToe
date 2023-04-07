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

  const playRound = (row, col) => {
    let pcMark = false;
    if (players[0].setMark(row, col) === true) {
      Gameboard.printGameBoard();
      do {
        pcMark = players[1].setMark(rndmNumber(3), rndmNumber(3));
      } while (!pcMark);
    }
  };

  return {playRound};
})();

