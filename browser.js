/* eslint-disable new-cap */
'use strict';

const Gameboard = (() => {
  let board = [];
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

  const setGameBoard = (newBoard) => {
    board = newBoard;
  };
  return {getGameBoard, setGameBoard};
})();

const Player = (mark) => {
  const setMark = (row, col) => {
    const board = Gameboard.getGameBoard();
    board[row][col] = mark;
    Gameboard.setGameBoard(board);
    console.log(Gameboard.getGameBoard());
  };
  return {mark, setMark};
};

const GameController = (() => {
  const players = [Player('O'), Player('X')];

  let activePlayer = players[0];

  // function to change the active Player after each round
  const changeActivePlayer = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  return {};
})();

