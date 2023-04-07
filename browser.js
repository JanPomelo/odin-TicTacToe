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
    } else {
      console.log(`The tile [${row},${col}] is already taken.`);
    }
  };
  return {getGameBoard, checkGameBoard};
})();

const Player = (mark) => {
  const setMark = (row, col) => {
    Gameboard.checkGameBoard(row, col, mark);
  };
  return {mark, setMark};
};

const GameController = (() => {
  // initialize both players
  const players = [Player('O'), Player('X')];
  let activePlayer = players[0];


  // function to change the active Player after each round
  const changeActivePlayer = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  return {};
})();

