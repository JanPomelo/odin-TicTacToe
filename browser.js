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
  let computerFirst = false;
  // this function calculates a random number for the easy Computer bot
  const rndmNumber = (max) => {
    return Math.floor(Math.random() * max);
  };

  const getComputerFirst = () => {
    return computerFirst;
  };

  const setComputerFirst = (value) => {
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
      if (i === 0) {
        for (let j = 0; j < board[i].length; j++) {
          if (checkVertical(board, mark, j)) {
            return true;
          }
        }
      }
      if (board[i][0] === mark) {
        if (checkHorizontal(board, mark, i)) {
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
    Gameboard.printGameBoard();
    if (checkWinner(player.mark)) {
      console.log('The ugly thief won the game!');
      ScreenController.deleteBoardEventListeners();
      // Gameboard.createGameBoard();
      return;
    }
  };

  // eslint-disable-next-line max-len
  // function to play one Round -> place one mark for the player and the computer
  const playRound = (row, col) => {
    if (players[0].setMark(row, col) === true) {
      if (checkWinner(players[0].mark) === true) {
        console.log('Congrats, you won the game!');
        ScreenController.deleteBoardEventListeners();
        // Gameboard.createGameBoard();
        return;
      }
      makePCmove(players[1]);
    }
  };

  return {playRound, players, setComputerFirst, getComputerFirst};
});

const ScreenController = (() => {
  const game = GameController();
  const domBoard = document.getElementById('gameBoard');
  const buttonMarkO = document.getElementById('markO');
  const buttonMarkX = document.getElementById('markX');

  const enableBoard = (evt) => {
    domBoard.classList = ['boardVisi'];
    if (evt.currentTarget.innerText === 'O') {
      game.setComputerFirst(false);
    } else {
      game.setComputerFirst(true);
      updateScreen();
    }
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
  };

  for (let i = 0; i < boardDivs.length; i++) {
    boardDivs[i].addEventListener('click', addMarkToDiv);
  }
  return {deleteBoardEventListeners};
})();

Gameboard.createGameBoard();
