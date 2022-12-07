import { Piece } from "./Piece";
import { pieceStateUpdate } from "./pieceLogic";
import {
  PawnScore,
  RookScore,
  BishopScore,
  KingScore,
  KnightScore,
} from "./AnalysePosition";


export class fromTo {
  constructor(
    i: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | number,
    j: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | number,
    x: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | number,
    y: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | number
  ) {
    this.i = i;
    this.j = j;
    this.x = x;
    this.y = y;
  }
  i: number;
  j: number;
  x: number;
  y: number;
}

const MinMax = (
  board: (Piece | any)[][],
  turn: "W" | "B",
  iterationsLeft: number,
  alpha: number,
  beta: number
): { score: number; moveToMake: fromTo } => {
  if (iterationsLeft === 0)
    return {
      score: analyseBoard(board),
      moveToMake: new fromTo(1, 1, 1, 1),
    };

  let scoresAndMoves: any = {};
  let bestScoreYet = turn === "W" ? -100000 : 100000;
  let bestMoveYet: fromTo;
  const returnValue = () => {
    return { score: bestScoreYet, moveToMake: bestMoveYet };
  };

  let newBoard = JSON.parse(JSON.stringify(board));
  localStorage.setItem("state", JSON.stringify(newBoard));
  // let newBoard= eval(localStorage.getItem("state")!)

  pieceStateUpdate(newBoard, turn);
  console.log(newBoard)

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      let count = 0;
      if (!newBoard[i][j] || newBoard[i][j].color !== turn) continue;
      for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
          let piece = newBoard[i][j];
          if (piece.canMoveTo[x][y]) {
            count++;
            // console.log(i, j, x, y, board[i][j].canMoveTo);
            let copyOfNewBoard = newBoard.map((inner: any) => inner.slice());
            copyOfNewBoard[x][y] = copyOfNewBoard[i][j];
            copyOfNewBoard[i][j] = null;

            let { score: scoreToSend, moveToMake } = MinMax(
              copyOfNewBoard,
              turn === "W" ? "B" : "W",
              iterationsLeft - 1,
              alpha,
              beta
            );
            let thisMove = new fromTo(i, j, x, y);

            scoresAndMoves[scoreToSend] = thisMove;
            // console.log(scoresAndMoves)

            if (
              turn === "W"
                ? scoreToSend > bestScoreYet
                : scoreToSend < bestScoreYet
            ) {
              bestScoreYet = scoreToSend;
              bestMoveYet = thisMove;
            }

            if (turn === "W" && scoreToSend !== 100000) {
              alpha = Math.max(alpha, scoreToSend, -100000);
            } else if (scoreToSend !== -100000) {
              beta = Math.min(beta, scoreToSend, 100000);
            }

            if (beta <= alpha) {
              return returnValue();
            }
          }
        }
      }
    }
  }

  return returnValue();
};

export default MinMax;

const analyseBoard = (board: (Piece | any)[][]) => {
  let valueOfBoard: number = 0;
  // board = JSON.parse(JSON.stringify(board));
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (board[i][j]) {
        switch (board[i][j].type) {
          case "Pawn":
            PawnScore(i, j, board);
            break;
          case "Bishop":
            BishopScore(i, j, board);
            break;
          case "King":
            KingScore(i, j, board);
            break;
          case "Queen":
            BishopScore(i, j, board);
            RookScore(i, j, board);
            break;
          case "Rook":
            RookScore(i, j, board);
            break;
          case "Knight":
            KnightScore(i, j, board);
            break;
        }
        valueOfBoard += board[i][j].importance;
      }
    }
  }
  return valueOfBoard;
};
