'use strict';

const Gameboard = (() => {
  const gameBoard = ['', '', '', '', '', '', '', '', ''];
  const getgameBoard = () => {
    return gameBoard;
  };
  const setMarkOnGameBoard = (mark, number) => {
    gameBoard[number] = mark;
  };
  return {getgameBoard, setMarkOnGameBoard};
})();

const Player = (name, mark) => {
  const sayHello = () => {
    return `Hello, my name is ${name} and my mark is ${mark}.`;
  };
  return {sayHello};
};

const player1 = Player('Jan', 'X');
const player2 = Player('Computer', 'O');

console.log(Gameboard.getgameBoard());
Gameboard.setMarkOnGameBoard('X', 2);
console.log(Gameboard.getgameBoard());
console.log(player1.sayHello());
console.log(player2.sayHello());
