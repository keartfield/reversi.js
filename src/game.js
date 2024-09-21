class Game {
  constructor(board, player1, player2) {
    this.board = board
    this.player1 = player1
    this.player2 = player2
    this.currentPlayer = player1
    this.state = 'start'
    this.displayTurn()
    this.displayScore()
  }

  /**
   * プレイヤー交代
   */
  switchPlayer() {
    this.currentPlayer = this.currentPlayer === this.player1 ? this.player2 : this.player1
    const currentPlayerPlacebleSquare = this.board.placeableSquare(this.currentPlayer.color).length
    const player1PlaceableSquare = this.board.placeableSquare(this.player1.color)
    const player2PlaceableSquare = this.board.placeableSquare(this.player2.color)
  
    // 両プレイヤーが配置不可ならゲーム終了
    if (player1PlaceableSquare.length === 0 && player2PlaceableSquare.length === 0) {
      this.displsyResult()
      return
    }

    this.displayTurn()
    this.displayScore()

    // 現在のプレイヤーが配置不可ならターン交代
    if (currentPlayerPlacebleSquare === 0) {
      this.switchPlayer()
    }
  }

  /**
   * ターン表示
   */
  displayTurn() {
    const turnElement = document.getElementById('turn')
    turnElement.textContent = this.currentPlayer.color
  }

  /**
   * スコア表示
   */
  displayScore() {
    // black
    const blackScoreElement = document.getElementById('blackScore')
    blackScoreElement.textContent = this.board.countDisks('black')
    // white
    const whiteScoreElement = document.getElementById('whiteScore')
    whiteScoreElement.textContent = this.board.countDisks('white')
  }

  /**
   * 結果表示
   */
  displsyResult() {
    const player1PlaceableSquare = this.board.placeableSquare(this.player1.color)
    const player2PlaceableSquare = this.board.placeableSquare(this.player2.color)

    if (player1PlaceableSquare.length === 0 && player2PlaceableSquare.length === 0) {
      const blackScore = this.board.countDisks('black')
      const whiteScore = this.board.countDisks('white')

      const text = () => {
        if (blackScore > whiteScore) return 'Winner: Black'
        if (blackScore < whiteScore) return 'Winner: White'
         return 'Draw...'
      } 

      const stateElement = document.getElementById('state')
      stateElement.textContent = text()
    }
  }
}

