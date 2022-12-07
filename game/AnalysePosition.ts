import { Piece } from "./Piece";
import { valueOfPiece, isUnderCheck } from "./pieceLogic";

const CAPTURE_MULTIPLIER = 5;

export const PawnScore = (i: number, j: number, Board: (Piece | any)[][]) => {
  const turn = Board[i][j].color;
  let importance: number = 50;
  if (turn === "W" && i !== 0) {
    if (j !== 0) {
      const upLeft = Board[i - 1][j - 1];
      if (upLeft && upLeft.color === "B") {
        let newBoard = Board.map((inner) => inner.slice());
        newBoard[i - 1][j - 1] = Board[i][j];
        newBoard[i][j] = null;
        if (!isUnderCheck(newBoard, turn === "W" ? "B" : "W"))
          importance += valueOfPiece(upLeft.type) * CAPTURE_MULTIPLIER;
      }
    }
    if (j !== 7) {
      const upRight = Board[i - 1][j + 1];
      const right = Board[i][j + 1];
      if (upRight && upRight.color === "B") {
        let newBoard = Board.map((inner) => inner.slice());
        newBoard[i - 1][j + 1] = Board[i][j];
        newBoard[i][j] = null;
        if (!isUnderCheck(newBoard, turn === "W" ? "B" : "W"))
          importance += valueOfPiece(upRight.type) * CAPTURE_MULTIPLIER;
      }
    }
  }

  if (turn === "B" && i !== 7) {
    if (j !== 0) {
      const upLeft = Board[i + 1][j - 1];
      const left = Board[i][j - 1];
      if (upLeft && upLeft.color === "W") {
        let newBoard = Board.map((inner) => inner.slice());
        newBoard[i + 1][j - 1] = Board[i][j];
        newBoard[i][j] = null;
        if (!isUnderCheck(newBoard, turn === "W" ? "B" : "W"))
          importance += valueOfPiece(upLeft.type) * CAPTURE_MULTIPLIER;
      }
    }
    if (j !== 7) {
      const upRight = Board[i + 1][j + 1];
      const right = Board[i][j + 1];
      if (upRight && upRight.color === "W") {
        let newBoard = Board.map((inner) => inner.slice());
        newBoard[i + 1][j + 1] = Board[i][j];
        newBoard[i][j] = null;
        if (!isUnderCheck(newBoard, turn === "W" ? "B" : "W"))
          importance += valueOfPiece(upRight.type) * CAPTURE_MULTIPLIER;
      }
    }
  }
  importance *= turn === "W" ? 1 : -1;
  Board[i][j].importance = importance;
};

export const RookScore = (i: number, j: number, Board: (Piece | any)[][]) => {
  let importance = 150;
  const turn = Board[i][j].color;
  const doesThisHorizontalMoveResultInCheck = (i: number, r: number) => {
    let newBoard = Board.map((inner) => inner.slice());
    newBoard[i][r] = newBoard[i][j];
    newBoard[i][j] = null;
    return isUnderCheck(newBoard, turn === "W" ? "B" : "W");
  };
  const doesThisVerticalMoveResultInCheck = (r: number, j: number) => {
    let newBoard = Board.map((inner) => inner.slice());
    newBoard[r][j] = newBoard[i][j];
    newBoard[i][j] = null;
    return isUnderCheck(newBoard, turn === "W" ? "B" : "W");
  };

  if (i !== 0) {
    for (let r = i - 1; r >= 0; r--) {
      const piece = Board[r][j];

      if (piece) {
        if (piece.color === turn) break;
        else if (!doesThisVerticalMoveResultInCheck(r, j))
          importance += valueOfPiece(piece.type) * CAPTURE_MULTIPLIER;
        break;
      }
    }
  }
  if (i !== 7) {
    for (let r = i + 1; r <= 7; r++) {
      const piece = Board[r][j];

      if (piece) {
        if (piece.color === turn) break;
        else if (!doesThisVerticalMoveResultInCheck(r, j))
          importance += valueOfPiece(piece.type) * CAPTURE_MULTIPLIER;
        break;
      }
    }
  }
  if (j !== 0) {
    for (let r = j - 1; r >= 0; r--) {
      const piece = Board[i][r];
      if (piece) {
        if (piece.color === turn) break;
        else if (!doesThisHorizontalMoveResultInCheck(i, r))
          importance += valueOfPiece(piece.type) * CAPTURE_MULTIPLIER;
        break;
      }
    }
  }
  if (j !== 7) {
    for (let r = j + 1; r <= 7; r++) {
      const piece = Board[i][r];

      if (piece) {
        if (piece.color === turn) break;
        else if (!doesThisHorizontalMoveResultInCheck(i, r))
          importance += valueOfPiece(piece.type) * CAPTURE_MULTIPLIER;
        break;
      }
    }
  }
  importance *= turn === "W" ? 1 : -1;
  Board[i][j].importance = importance;
};

export const BishopScore = (i: number, j: number, Board: (Piece | any)[][]) => {
  let importance: number = 150;
  const turn = Board[i][j].color;
  for (let r = 1; r < 8; r++) {
    const isUnderCheckIfThisMoveHappens = (r: number) => {
      let newBoard = Board.map((inner) => inner.slice());
      newBoard[i - r][j + r] = newBoard[i][j];
      newBoard[i][j] = null;
      return isUnderCheck(newBoard, turn === "W" ? "B" : "W");
    };

    if (i - r >= 0 && j + r <= 7) {
      const piece = Board[i - r][j + r];

      if (piece) {
        if (piece.color === Board[i][j].color) break;
        else if (!isUnderCheckIfThisMoveHappens(r))
          importance += valueOfPiece(piece.type) * CAPTURE_MULTIPLIER;
        break;
      }
    } else break;
  }

  for (let r = 1; r < 8; r++) {
    const isUnderCheckIfThisMoveHappens = (r: number) => {
      let newBoard = Board.map((inner) => inner.slice());
      newBoard[i + r][j + r] = newBoard[i][j];
      newBoard[i][j] = null;
      return isUnderCheck(newBoard, turn === "W" ? "B" : "W");
    };

    if (i + r <= 7 && j + r <= 7) {
      let piece = Board[i + r][j + r];

      if (piece) {
        if (piece.color === Board[i][j].color) break;
        else if (!isUnderCheckIfThisMoveHappens(r))
          importance += valueOfPiece(piece.type) * CAPTURE_MULTIPLIER;
        break;
      }
    } else break;
  }

  for (let r = 1; r < 8; r++) {
    const isUnderCheckIfThisMoveHappens = (r: number) => {
      let newBoard = Board.map((inner) => inner.slice());
      newBoard[i + r][j - r] = newBoard[i][j];
      newBoard[i][j] = null;
      return isUnderCheck(newBoard, turn === "W" ? "B" : "W");
    };

    if (i + r <= 7 && j - r >= 0) {
      let piece = Board[i + r][j - r];

      if (piece) {
        if (piece.color === Board[i][j].color) break;
        else if (!isUnderCheckIfThisMoveHappens(r))
          importance += valueOfPiece(piece.type) * CAPTURE_MULTIPLIER;
        break;
      }
    }
  }

  for (let r = 1; r < 8; r++) {
    if (i - r >= 0 && j - r >= 0) {
      let piece = Board[i - r][j - r];

      const isUnderCheckIfThisMoveHappens = (r: number) => {
        let newBoard = Board.map((inner) => inner.slice());
        newBoard[i - r][j - r] = newBoard[i][j];
        newBoard[i][j] = null;
        return isUnderCheck(newBoard, turn === "W" ? "B" : "W");
      };

      if (piece) {
        if (piece.color === Board[i][j].color) break;
        else if (!isUnderCheckIfThisMoveHappens(r))
          importance += valueOfPiece(piece.type) * CAPTURE_MULTIPLIER;
        break;
      }
    } else break;
  }
  importance *= turn === "W" ? 1 : -1;
  Board[i][j].importance = importance;
};

export const KingScore = (i: number, j: number, Board: (Piece | any)[][]) => {
  let importance: number = 10000;
  const turn = Board[i][j].color;

  if (i >= 1) {
    const piece = Board[i - 1][j];

    if (!piece || piece.color !== turn) {
      let newBoard = Board.map((inner) => inner.slice());
      newBoard[i - 1][j] = Board[i][j];
      newBoard[i][j] = null;
      if (!isUnderCheck(newBoard, turn === "W" ? "B" : "W"))
        if (piece) importance += valueOfPiece(piece.type) * CAPTURE_MULTIPLIER;
    }
    if (j >= 1) {
      const piece = Board[i - 1][j - 1];

      if (!piece || piece.color !== turn) {
        let newBoard = Board.map((inner) => inner.slice());
        newBoard[i - 1][j - 1] = Board[i][j];
        newBoard[i][j] = null;
        if (!isUnderCheck(newBoard, turn === "W" ? "B" : "W"))
          if (piece)
            importance += valueOfPiece(piece.type) * CAPTURE_MULTIPLIER;
      }
    }
    if (j <= 6) {
      const piece = Board[i - 1][j + 1];

      if (!piece || piece.color !== turn) {
        let newBoard = Board.map((inner) => inner.slice());
        newBoard[i - 1][j + 1] = Board[i][j];
        newBoard[i][j] = null;
        if (!isUnderCheck(newBoard, turn === "W" ? "B" : "W"))
          if (piece)
            importance += valueOfPiece(piece.type) * CAPTURE_MULTIPLIER;
      }
    }
  }

  if (i <= 6) {
    const piece = Board[i + 1][j];

    if (!piece || piece.color !== turn) {
      let newBoard = Board.map((inner) => inner.slice());
      newBoard[i + 1][j] = Board[i][j];
      newBoard[i][j] = null;
      if (!isUnderCheck(newBoard, turn === "W" ? "B" : "W"))
        if (piece) importance += valueOfPiece(piece.type) * CAPTURE_MULTIPLIER;
    }

    if (j >= 1) {
      const piece = Board[i + 1][j - 1];

      if (!piece || piece.color !== turn) {
        let newBoard = Board.map((inner) => inner.slice());
        newBoard[i + 1][j - 1] = Board[i][j];
        newBoard[i][j] = null;
        if (!isUnderCheck(newBoard, turn === "W" ? "B" : "W"))
          if (piece)
            importance += valueOfPiece(piece.type) * CAPTURE_MULTIPLIER;
      }
    }

    if (j <= 6) {
      const piece = Board[i + 1][j + 1];

      if (!piece || piece.color !== turn) {
        let newBoard = Board.map((inner) => inner.slice());
        newBoard[i + 1][j + 1] = Board[i][j];
        newBoard[i][j] = null;
        if (!isUnderCheck(newBoard, turn === "W" ? "B" : "W"))
          if (piece)
            importance += valueOfPiece(piece.type) * CAPTURE_MULTIPLIER;
      }
    }
  }

  if (j >= 1) {
    const piece = Board[i][j - 1];

    if (!piece || piece.color !== turn) {
      let newBoard = Board.map((inner) => inner.slice());
      newBoard[i][j - 1] = Board[i][j];
      newBoard[i][j] = null;
      if (!isUnderCheck(newBoard, turn === "W" ? "B" : "W"))
        if (piece) importance += valueOfPiece(piece.type) * CAPTURE_MULTIPLIER;
    }
  }

  if (j <= 6) {
    const piece = Board[i][j + 1];

    if (!piece || piece.color !== turn) {
      let newBoard = Board.map((inner) => inner.slice());
      newBoard[i][j + 1] = Board[i][j];
      newBoard[i][j] = null;
      if (!isUnderCheck(newBoard, turn === "W" ? "B" : "W"))
        if (piece) importance += valueOfPiece(piece.type) * CAPTURE_MULTIPLIER;
    }
  }
  importance *= turn === "W" ? 1 : -1;
  Board[i][j].importance = importance;
};

export const KnightScore = (i: number, j: number, Board: (Piece | any)[][]) => {
  let importance = 200;
  const turn = Board[i][j].color;
  if (i >= 2) {
    if (j >= 1) {
      let left = Board[i - 2][j - 1];

      if (left && left.color !== Board[i][j].color) {
        let newBoard = Board.map((inner) => inner.slice());
        newBoard[i - 2][j - 1] = newBoard[i][j];
        newBoard[i][j] = null;
        if (!isUnderCheck(newBoard, turn === "W" ? "B" : "W"))
          importance += valueOfPiece(left.type) * CAPTURE_MULTIPLIER;
      }
    }
    if (j <= 6) {
      let right = Board[i - 2][j + 1];

      if (right && right.color !== Board[i][j].color) {
        let newBoard = Board.map((inner) => inner.slice());
        newBoard[i - 2][j + 1] = newBoard[i][j];
        newBoard[i][j] = null;
        if (!isUnderCheck(newBoard, turn === "W" ? "B" : "W"))
          importance += valueOfPiece(right.type) * CAPTURE_MULTIPLIER;
      }
    }
  }
  if (i <= 5) {
    if (j >= 1) {
      let left = Board[i + 2][j - 1];

      if (left && left.color !== Board[i][j].color) {
        let newBoard = Board.map((inner) => inner.slice());
        newBoard[i + 2][j - 1] = newBoard[i][j];
        newBoard[i][j] = null;
        if (!isUnderCheck(newBoard, turn === "W" ? "B" : "W"))
          importance += valueOfPiece(left.type) * CAPTURE_MULTIPLIER;
      }
    }
    if (j <= 6) {
      let right = Board[i + 2][j + 1];

      if (right && right.color !== Board[i][j].color) {
        let newBoard = Board.map((inner) => inner.slice());
        newBoard[i + 2][j + 1] = newBoard[i][j];
        newBoard[i][j] = null;
        if (!isUnderCheck(newBoard, turn === "W" ? "B" : "W"))
          importance += valueOfPiece(right.type) * CAPTURE_MULTIPLIER;
      }
    }
  }

  if (j >= 2) {
    if (i >= 1) {
      let left = Board[i - 1][j - 2];

      if (left && left.color !== Board[i][j].color) {
        let newBoard = Board.map((inner) => inner.slice());
        newBoard[i - 1][j - 2] = newBoard[i][j];
        newBoard[i][j] = null;
        if (!isUnderCheck(newBoard, turn === "W" ? "B" : "W"))
          importance += valueOfPiece(left.type) * CAPTURE_MULTIPLIER;
      }
    }
    if (i <= 6) {
      let right = Board[i + 1][j - 2];

      if (right && right.color !== Board[i][j].color) {
        let newBoard = Board.map((inner) => inner.slice());
        newBoard[i + 1][j - 2] = newBoard[i][j];
        newBoard[i][j] = null;
        if (!isUnderCheck(newBoard, turn === "W" ? "B" : "W"))
          importance += valueOfPiece(right.type) * CAPTURE_MULTIPLIER;
      }
    }
  }

  if (j <= 5) {
    if (i >= 1) {
      let left = Board[i - 1][j + 2];

      if (left && left.color !== Board[i][j].color) {
        let newBoard = Board.map((inner) => inner.slice());
        newBoard[i - 1][j + 2] = newBoard[i][j];
        newBoard[i][j] = null;
        if (!isUnderCheck(newBoard, turn === "W" ? "B" : "W"))
          importance += valueOfPiece(left.type) * CAPTURE_MULTIPLIER;
      }
    }
    if (i <= 6) {
      let right = Board[i + 1][j + 2];

      if (right && right.color !== Board[i][j].color) {
        let newBoard = Board.map((inner) => inner.slice());
        newBoard[i + 1][j + 2] = newBoard[i][j];
        newBoard[i][j] = null;
        if (!isUnderCheck(newBoard, turn === "W" ? "B" : "W"))
          importance += valueOfPiece(right.type) * CAPTURE_MULTIPLIER;
      }
    }
  }
  importance *= turn === "W" ? 1 : -1;
  Board[i][j].importance = importance;
};
