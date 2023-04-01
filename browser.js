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

console.log(Gameboard.getgameBoard());
Gameboard.setMarkOnGameBoard('X', 2);
console.log(Gameboard.getgameBoard());
