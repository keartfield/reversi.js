class Board {
  constructor(size = 8) {
    this.size = size
    this.grid = Array(size).fill(null).map(() => Array(size).fill(null))
    this.directions = [
      // 上下左右
      { dx: -1, dy: 0 }, { dx: 1, dy: 0 }, { dx: 0, dy: -1 }, { dx: 0, dy: 1 },
      // 斜め方向
      { dx: -1, dy: -1 }, { dx: -1, dy: 1 }, { dx: 1, dy: -1 }, { dx: 1, dy: 1 },
    ]
    this.initializeDick()
    this.renderBoard()
  }

  /**
   * 石の初期配置
   */
  initializeDick() {
    const mid = Math.floor(this.size / 2)
    this.grid[mid - 1][mid - 1] = 'white'
    this.grid[mid][mid] = 'white'
    this.grid[mid - 1][mid] = 'black'
    this.grid[mid][mid - 1] = 'black'
  }

  /**
   * 盤面を描画
   */
  renderBoard() {
    const boardElement = document.getElementById('board')
    boardElement.innerHTML = ''

    // 正方形になるように調整
    boardElement.style.gridTemplateColumns = `repeat(${this.size}, 1fr)`
    boardElement.style.gridTemplateRows = `repeat(${this.size}, 1fr)`

    for (let x = 0; x < this.size; x++) {
      for (let y = 0; y < this.size; y++) {
        const cell = document.createElement('div')
        cell.classList.add('square')
        if (this.grid[x][y]) {
          const disk = document.createElement('div')
          disk.classList.add('disk', this.grid[x][y])
          cell.appendChild(disk)
        }
        cell.addEventListener('click', () => this.handleClick(x, y))
        boardElement.appendChild(cell)
      }
    }
  }

  /**
   * マスをクリック
   */
  handleClick(x, y) {
    if (this.isValidMove(x, y, game.currentPlayer.color)) {
      this.placeDisk(x, y, game.currentPlayer.color)
      this.flipDisks(x, y, game.currentPlayer.color)
      this.renderBoard()
      game.switchPlayer()
    }
  }

  /**
   * 石を配置
   */
  placeDisk(x, y, color) {
    this.grid[x][y] = color
  }

  /**
   * 石を置けるか判定
   */
  isValidMove(x, y, color) {
     // すでに石が置かれている場合は無効
    if (this.grid[x][y] !== null) return false

    // 裏返せる石がある場合は有効
    for (const { dx, dy } of this.directions) {
      if (this.canFlipInDirection(x, y, dx, dy, color)) {
        return true;
      }
    }
    // それ以外は無効
    return false;
  }

  /**
   * 裏返せる石があるか判定
   */
  canFlipInDirection(x, y, dx, dy, color) {
    let nx = x + dx;
    let ny = y + dy;
    let hasOpponentDisk = false;

    while (this.isOnBoard(nx, ny) && this.grid[nx][ny] !== null) {
      if (this.grid[nx][ny] === color) {
        return hasOpponentDisk;
      }
      hasOpponentDisk = true;
      nx += dx;
      ny += dy;
    }
    return false;
  }

  /**
   * 石を裏返す
   */
  flipDisks(x, y, color) {
    for (const { dx, dy } of this.directions) {
      let nx = x + dx
      let ny = y + dy
      let disksToFlip = []
  
      while (this.isOnBoard(nx, ny) && this.grid[nx][ny] !== null) {
        if (this.grid[nx][ny] === color) {
          for (const [flipX, flipY] of disksToFlip) {
            this.grid[flipX][flipY] = color
          }
          break;
        }
        disksToFlip.push([nx, ny])
        nx += dx
        ny += dy
      }
    }
  }

  /**
   * 指定座標が盤面の範囲内にあるか判定
   */
  isOnBoard(x, y) {
    return x >= 0 && x < this.size && y >= 0 && y < this.size
  }

  /**
   * 配置可能なマスを取得
   */
  placeableSquare(color) {
    const squares = []
    for (let x = 0; x < this.size; x++) {
      for (let y = 0; y < this.size; y++) {
        if (this.isValidMove(x, y, color)) {
          squares.push({ x, y })
        }
      }
    }
    return squares
  }

  /**
   * 盤面上の石の数を取得
   */
  countDisks(color) {
    let count = 0
    for (let x = 0; x < this.size; x++) {
      for (let y = 0; y < this.size; y++) {
        if (this.grid[x][y] === color) {
          count++
        }
      }
    }
    return count
  }
}
