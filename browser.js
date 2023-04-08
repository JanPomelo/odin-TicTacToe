/* eslint-disable new-cap */
'use strict';

const Gameboard = (() => {
  const board = [];
  const rows = 3;
  const columns = 3;

  // create the board
  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push('');
    }
  }

  // function to get the board
  const getGameBoard = () => {
    return board;
  };
  // function to print the board
  const printGameBoard = () => {
    /* this prints the Board immidiatly, keep here for debugging
    for (let i = 0; i < rows; i++) {
      const oneLine = [];
      for (let j = 0; j < columns; j++) {
        oneLine.push(board[i][j]);
      }
      console.log(oneLine);
    }
    */
    console.log(board);
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
  return {getGameBoard, checkGameBoard, printGameBoard};
})();

// factory function to make a playerß
const Player = (mark) => {
  const setMark = (row, col) => {
    return Gameboard.checkGameBoard(row, col, mark);
  };
  return {mark, setMark};
};

const GameController = (() => {
  // initialize both players
  const players = [Player('O'), Player('X')];

  // this function calculates a random number for the easy Computer bot
  const rndmNumber = (max) => {
    return Math.floor(Math.random() * max);
  };

  // this function checks if there are 3 same marks in the columns
  const checkVertical = (board, mark, col) => {
    if (board[1][col] === mark) {
      if (board[2][col] === mark) {
        return true;
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

  /* this function checks every winCondition and
  returns true if one of the win conditions is true */
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
  // function to make one move for the PC
  const makePCmove = (player) => {
    let pcMark = false;
    do {
      pcMark = player.setMark(rndmNumber(3), rndmNumber(3));
    } while (!pcMark);
    if (checkWinner(player.mark)) {
      console.log('The ugly thief won the game!');
    }
  };

  // function to play one Round -> place one mark for the player and the computer
  const playRound = (row, col) => {
    if (players[0].setMark(row, col) === true) {
      Gameboard.printGameBoard();
      if (checkWinner(players[0].mark) === true) {
        // endGame(players[0]);
        console.log('Congrats, you won the game!');
      }
      makePCmove(players[1]);
    }
  };

  return {playRound};
})();

Gameboard.printGameBoard();
