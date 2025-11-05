class Field {
  public constructor(
    public symbol: "🐉" | number,
    public revealed = false,
    public flagged = false,
  ) {}
}

export class FlagTheDragGame extends EventTarget {
  private board: Field[][];
  private status: "ready" | "playing" | "win" | "lose" = "ready";
  private flagCount = 0;

  public constructor(
    private readonly sizeX: number,
    private readonly sizeY: number,
    private readonly dragonCount: number,
  ) {
    super();
    this.board = new Array(sizeX)
      .fill(0)
      .map(() => new Array(sizeY).fill(0).map(() => new Field(0)));
  }

  public getState() {
    return Object.freeze({
      board: this.board.map((row) =>
        Object.freeze(
          row.map(({ symbol, revealed, flagged }) =>
            Object.freeze({
              revealed,
              flagged,
              symbol: flagged
                ? "🚩"
                : revealed ||
                    (["win", "lose"].includes(this.status) && symbol === "🐉")
                  ? String(symbol || "")
                  : "",
            }),
          ),
        ),
      ),
      status: this.status,
      remainingDragons: this.dragonCount - this.flagCount,
    });
  }

  public handleClick(type: "left" | "right", x: number, y: number) {
    const isFirstClick = this.initBoard(x, y);

    const field = this.board[x]?.[y];
    if (!field) {
      throw new Error(`No Field at ${x}:${y}`);
    }

    if (type === "left" || isFirstClick) {
      this.revealAdjacentFields(field, x, y);
      this.handleLeftClick(field, x, y);
    } else {
      this.revealAdjacentFields(field, x, y);
      this.handleRightClick(field);
    }

    this.dispatchEvent(new Event("update"));
  }

  private handleLeftClick(
    field: Field,
    x: number,
    y: number,
    visited = new Set<string>(),
  ) {
    if (
      field.revealed ||
      field.flagged ||
      this.status !== "playing" ||
      visited.has(`${x}/${y}`)
    ) {
      return;
    }
    visited.add(`${x}/${y}`);

    field.revealed = true;

    if (field.symbol === "🐉") {
      this.status = "lose";
    }

    if (field.symbol === 0) {
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          const [x2, y2] = [x + dx, y + dy];
          const nextField = this.board[x2]?.[y2];
          if (nextField && !visited.has(`${x2}/${y2}`)) {
            this.handleLeftClick(nextField, x2, y2, visited);
          }
        }
      }
    }

    if (
      !this.board.some((row) =>
        row.some((field) => !field.revealed && field.symbol !== "🐉"),
      )
    ) {
      this.status = "win";
    }
  }

  private revealAdjacentFields(field: Field, x: number, y: number) {
    if (!field.revealed || field.symbol === "🐉" || field.symbol === 0) {
      return;
    }

    let expectedFlags = field.symbol;
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (this.board[x + dx]?.[y + dy]?.flagged) {
          expectedFlags--;
        }
      }
    }

    if (expectedFlags === 0) {
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          const nextField = this.board[x + dx]?.[y + dy];
          if (nextField) {
            this.handleLeftClick(nextField, x + dx, y + dy);
          }
        }
      }
    }
  }

  private handleRightClick(field: Field) {
    if (field.revealed) {
      return;
    }

    if (field.flagged) {
      field.flagged = false;
      this.flagCount--;
    } else {
      field.flagged = true;
      this.flagCount++;
    }
  }

  private initBoard(clickX: number, clickY: number) {
    if (this.status !== "ready") {
      return false;
    }
    const defaultProbability = this.dragonCount / (this.sizeX * this.sizeY);

    const board = Array(this.sizeX)
      .fill(0)
      .map(() => Array(this.sizeY));

    const factor = Math.floor(Math.min(this.sizeX, this.sizeY) / 2);
    let dragonsLeft = this.dragonCount;
    while (dragonsLeft > 0) {
      outerFor: for (let x = 0; x < this.sizeX; x++) {
        for (let y = 0; y < this.sizeY; y++) {
          if (
            board[x][y] !== undefined ||
            (x === clickX && y === clickY) ||
            (x >= clickX - 1 &&
              x <= clickX + 1 &&
              y >= clickY - 1 &&
              y <= clickY + 1)
          ) {
            continue;
          }
          const distance = Math.abs(x - clickX) + Math.abs(y - clickY);
          const probability =
            (defaultProbability * (factor - Math.max(0, factor - distance))) /
            factor;

          if (Math.random() < probability) {
            board[x][y] = new Field("🐉");
            if (--dragonsLeft === 0) {
              break outerFor;
            }
          }
        }
      }
    }

    for (let x = 0; x < this.sizeX; x++) {
      for (let y = 0; y < this.sizeY; y++) {
        if (board[x][y] === undefined) {
          let dragonCount = 0;
          for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
              if (board[x + dx]?.[y + dy]?.symbol === "🐉") {
                dragonCount++;
              }
            }
          }
          board[x][y] = new Field(dragonCount, false);
        }
      }
    }

    this.board = board;
    this.status = "playing";
    return true;
  }
}
