import React, {useState} from "react";
import Square from "../components/Square";
import {initialBoard, initiallyCanMoveTo} from "../game/InitialPosition";
import {Piece} from "../game/Piece";
import {pieceStateUpdate} from "../game/pieceLogic";
import MinMax from "../game/MinMax";

pieceStateUpdate(initialBoard, "W");

const Board: React.FC = () => {
  const [board, setBoard] = useState(() => initialBoard);
  const [previousClick, setPreviousClick] = useState([4, 4]);
  const [turn, setTurn] = useState("W");
  const [canMoveToHighlighted, setCanMoveToHighlighted] = useState(() => [
    ...initiallyCanMoveTo,
  ]);

  let[isInverted, setIsinverted] = useState(false)
  let[iteraction, setIteraction] = useState(3)

  const clickNothing = () => {
    setCanMoveToHighlighted(initiallyCanMoveTo.map((inner) => inner.slice()));
    setPreviousClick([9, 9]);
  };

  const movePiece = (
    previousBoard: (Piece | any)[][],
    i: number,
    k: number
  ) => {
    // Create a copy of the previous board
    let newBoard = previousBoard.map((inner) => inner.slice());
    if (newBoard[i][k] && newBoard[i][k].type === "King") {
      alert("Fim!!!");
    }

    // Check for Castling:
    if (
      k === 6 &&
      (i === 0 || i === 7) &&
      previousClick[1] === 4 &&
      (previousClick[0] === 0 || previousClick[0] === 7) &&
      previousBoard[previousClick[0]][previousClick[1]].type === "King"
    ) {
      newBoard[i][k - 1] = previousBoard[previousClick[0]][7];
      newBoard[i][7] = null;
      newBoard[i][k - 1].numOfMoves++;
    }

    // Check for En Passant:
    if (
      (i === 2 &&
        previousBoard[i + 1][k] &&
        previousBoard[i + 1][k].type === "Pawn" &&
        previousBoard[previousClick[0]][previousClick[1]].type === "Pawn") ||
      (i === 5 &&
        previousBoard[i - 1][k] &&
        previousBoard[i - 1][k].type === "Pawn" &&
        previousBoard[previousClick[0]][previousClick[1]].type === "Pawn")
    )
      newBoard[i === 2 ? 3 : 4][k] = null;

    // Pawn Promotion
    if (
      (i === 0 &&
        previousBoard[1][k] &&
        previousBoard[1][k].color === "W" &&
        previousBoard[1][k].type === "Pawn") ||
      (i === 7 &&
        previousBoard[6][k] &&
        previousBoard[6][k].color === "B" &&
        previousBoard[6][k].type === "Pawn")
    )
      previousBoard[i === 0 ? 1 : 6][k].type = "Queen";

    newBoard[i][k] = previousBoard[previousClick[0]][previousClick[1]];
    newBoard[previousClick[0]][previousClick[1]] = null;
    newBoard[i][k].numOfMoves++;
    newBoard[i][k].turnsSinceLastMove = 0;
    pieceStateUpdate(newBoard, turn);
    return newBoard;
  };

  const handleClick = (i: number, k: number) => {
    if (
      board[i][k] &&
      turn !== board[i][k].color &&
      !canMoveToHighlighted[i][k]
    )
      return;

    if (i === previousClick[0] && k === previousClick[1]) return;

    if (canMoveToHighlighted[i][k] == true) {
      const newBoard = movePiece(board, i, k);
      setBoard(newBoard);
      setCanMoveToHighlighted(initiallyCanMoveTo.map((inner) => inner.slice()));

      let { score: scoreToSend, moveToMake } = MinMax(
        newBoard,
        "B",
          iteraction,
        -100000,
        100000
      );
      if (scoreToSend === 100000) {
        alert("CheckMate!");
        return;
      }
      setBoard((previousBoard) => {
        let newBoard = previousBoard.map((inner) => inner.slice());
        newBoard[moveToMake.x][moveToMake.y] =
          newBoard[moveToMake.i][moveToMake.j];
        newBoard[moveToMake.i][moveToMake.j] = null;
        newBoard[moveToMake.x][moveToMake.y].numOfMoves++;
        pieceStateUpdate(newBoard, "W");
        setCanMoveToHighlighted((previousCanMoveTo) => {
          let toReturn = initiallyCanMoveTo.map((inner) => inner.slice());
          toReturn[moveToMake.x][moveToMake.y] = true;
          toReturn[moveToMake.i][moveToMake.j] = true;
          setPreviousClick([moveToMake.x, moveToMake.y]);
          return toReturn;
        });
        return newBoard;
      });
      setTurn("W");
    } else {
      setCanMoveToHighlighted((canMoveTo) => {
        let newCanMoveTo = board[i][k].canMoveTo.map((inner: any): boolean[] =>
          inner.slice()
        );
        newCanMoveTo[i][k] = true;
        return newCanMoveTo;
      });

      setPreviousClick([i, k]);
    }
  };

  let rowBoard = 8
  return (
      <div>
        <button onClick={() => {
          setIsinverted(!isInverted)
        }}>
          Inverter
        </button>
        <span>
        ||
      </span>
        <input onChange={(e) => setIteraction(parseInt(e.target.value))} type="range" min="3" max="6" defaultValue="3"
               className="slider"/>
        <div className="table_l">
          <div className="table_letter">
            A
          </div>
          <div className="table_letter">
            B
          </div>
          <div className="table_letter">
            C
          </div>
          <div className="table_letter">
            D
          </div>
          <div className="table_letter">
            E
          </div>
          <div className="table_letter">
            F
          </div>
          <div className="table_letter">
            G
          </div>
          <div className="table_letter">
            H
          </div>
        </div>

        <section className={!isInverted ? "app_board" : "app_board_inverted"} style={{margin: "auto"}}>
          {board.map((rows: Piece[][] | any, i: number) => (
              <span className="row" key={i}>
                <span className="table_number">
                  {rowBoard-i}
                </span>
                {rows.map((col: Piece[], k: number) => (
                    <Square
                        clickNothing={clickNothing}
                        k={k}
                        i={i}
                        key={`${i}_${k}`}
                        piece={board[i][k]}
                        handleClick={handleClick}
                        active={canMoveToHighlighted[i][k]}
                        isInverted={isInverted}
                    />
                ))}
          </span>
          ))}
        </section>
        <div className="table_l">
          <div className="table_letter">
            A
          </div>
          <div className="table_letter">
            B
          </div>
          <div className="table_letter">
            C
          </div>
          <div className="table_letter">
            D
          </div>
          <div className="table_letter">
            E
          </div>
          <div className="table_letter">
            F
          </div>
          <div className="table_letter">
            G
          </div>
          <div className="table_letter">
            H
          </div>
        </div>
      </div>
  );
};

export default Board;
