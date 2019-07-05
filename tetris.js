function Tetris() {
  /*
    tetris is a portrait oriented rectangular grid, 20x10
  */
  this.height = 20
  this.width = 10
  this.board = new Array(this.height)
  for (let i = 0; i < this.height; i++) {
    this.board[i] = new Array(this.width)
    this.board[i].fill(0)
  }
  /*
    there are seven tetronimos:
    I: 4x1 rectangle,
    T: 3x1 rectangle with 4th square attached to center
    O: 2x2 square
    L,l: left- and right-handed L shapes (3x1 with the fourth square on an end)
    S,s: left- and right-handed S shapes (2 2x2 layers offset)
  */
  this.pieces = ['I', 'T', 'O', 'L', 'l', 'S', 's']
  this.pieces_bb = {
    /* piece: [width, height] */
    I: [4, 1],
    T: [3, 2],
    O: [2, 2],
    L: [3, 2],
    l: [3, 2],
    S: [3, 2],
    s: [3, 2],
  }
  /* there may be a current piece, if there is it is { piece:, x:, y:, a: } */
  this.currentPiece = undefined
}

/* Render the board in ascii, returning a string */

/*
+---+---+---+---+---+---+---+---+---+---+
| T | T | T |   |   |   |   |   |   |   |
|   | T |   |   |   |   |   |   |   |   |
+---+---+---+---+---+---+---+---+---+---+
*/

Tetris.prototype.renderAscii = function() {
  let s = '+'
  for (let x = 0; x < this.width; x++) {
    s += '---+'
  }
  s += '\n'
  for (let y = 0; y < this.height; y++) {
    s += '|'
    for (let x = 0; x < this.width; x++) {
      s += this.board[y][x] === 0 ? '   |' : ` ${this.board[y][x]} |`
    }
    s += '\n'
  }
  s += '+'
  for (let x = 0; x < this.width; x++) {
    s += '---+'
  }
  return s
}

/*
  there is a newPiece function which drops a new random shape at the top of the grid
  in the first two rows, within the four central columns, returning true on success
  or false if no room (game loss)
  newPiece can also take a piece explicitly, for testing
*/

Tetris.prototype.newPiece = function(p) {
  /* p is one of this.pieces for testing; if undefined, choose randomly */
  if (p === undefined || !this.pieces.includes(p)) {
    p = this.pieces[Math.random(this.pieces.length)]
  }
  const piece = p
  const y = 0
  const x = piece === 'I' ? 3 : 4
  const a = 0
  const n = { x, y, a, piece }
  if (this._canPlacePiece(n)) {
    this.currentPiece = n
    this._placePiece(n)
    return true
  } else {
    this.currentPiece = undefined
    return false
  }
}

/*
  users can move current piece left or right, or rotate by 90 clockwise
  return true if change was possibe else false if impossible or no current piece
*/

Tetris.prototype.moveLeft = function() {
  if (!this.currentPiece) {
    return false
  }
  if (!this._canPlacePiece({ ...this.currentPiece, x: this.currentPiece.x - 1 })) {
    return false
  }
  this._erasePiece(this.currentPiece)
  this.currentPiece.x--
  this._placePiece(this.currentPiece)
  return true
}

Tetris.prototype.moveRight = function() {
  if (!this.currentPiece) {
    return false
  }
  if (!this._canPlacePiece({ ...this.currentPiece, x: this.currentPiece.x + 1 })) {
    return false
  }
  this._erasePiece(this.currentPiece)
  this.currentPiece.x++
  this._placePiece(this.currentPiece)
  return true
}

Tetris.prototype.rotate = function() {
  if (!this.currentPiece) {
    return false
  }
  if (!this._canPlacePiece({ ...this.currentPiece, a: (this.currentPiece.a + 1) % 4 })) {
    return false
  }
  this._erasePiece(this.currentPiece)
  this.currentPiece.a = (this.currentPiece.a + 1) % 4
  this._placePiece(this.currentPiece)
  return true
}

/*
  there is an update function which moves the current piece, if any,
  down by one row, deleting full rows, moving all remaining rows down,
  returning true if that was possible and false if not
*/
Tetris.prototype.update = function() {
  if (!this.currentPiece) {
    return false
  }
  if (!this._canPlacePiece({ ...this.currentPiece, y: this.currentPiece.y + 1 })) {
    return false
  }
  this._erasePiece(this.currentPiece)
  this.currentPiece.y++
  this._placePiece(this.currentPiece)

  for (let y = this.height - 1; y > 0; y--) {
    if (this.board[y].every(c => c !== 0)) {
      for (let j = y; j > 0; j--) {
        for (let i = 0; i < this.width; i++) {
          this.board[j][i] = this.board[j - 1][i]
        }
      }
      for (let i = 0; i < this.width; i++) {
        this.board[0][i] = 0
      }
    }
  }

  return true
}

/*
  when a piece hits another piece it stops falling
*/
/*
when a row is full, it is cleared and everything else moves down
if a piece is stuck and touches the top, the game is over
*/

/* Return true if can place piece at x,y (y = 0 top of board) 
   and false if not or if any params are out of range
   a 'angle' is 0, 1, 2, 3 for 0, 90, 180, 270 in normal clockwise order
   the 0 degree orientations are:
   I: ---- T: -^- L: '-- l: --' S: _;-  s: -;_
*/
Tetris.prototype._canPlacePiece = function(p) {
  if (this.currentPiece) {
    this._erasePiece(this.currentPiece)
  }
  const r = this._canPlacePiece2(p)
  if (this.currentPiece) {
    this._placePiece(this.currentPiece)
  }
  return r
}

Tetris.prototype._canPlacePiece2 = function({ x, y, a, piece }) {
  if (!this.pieces.includes(piece) || x < 0 || y < 0 || a < 0 || a > 3) {
    return false
  }
  switch (piece) {
    case 'I':
      if (a === 0 || a === 2) {
        return (
          x <= this.width - 4 &&
          y <= this.height - 1 &&
          this.board[y][x] === 0 &&
          this.board[y][x + 1] === 0 &&
          this.board[y][x + 2] === 0 &&
          this.board[y][x + 3] === 0
        )
      } else {
        return (
          y <= this.height - 4 &&
          x <= this.width - 1 &&
          this.board[y][x] === 0 &&
          this.board[y + 1][x] === 0 &&
          this.board[y + 2][x] === 0 &&
          this.board[y + 3][x] === 0
        )
      }
    case 'T':
      switch (a) {
        case 0:
          return (
            x <= this.width - 3 &&
            y <= this.height - 2 &&
            this.board[y][x + 1] === 0 &&
            this.board[y + 1][x] === 0 &&
            this.board[y + 1][x + 1] === 0 &&
            this.board[y + 1][x + 2] === 0
          )
        case 1:
          return (
            x <= this.width - 2 &&
            y <= this.height - 3 &&
            this.board[y][x] === 0 &&
            this.board[y + 1][x] === 0 &&
            this.board[y + 1][x + 1] === 0 &&
            this.board[y + 2][x] === 0
          )
        case 2:
          return (
            x <= this.width - 3 &&
            y <= this.height - 2 &&
            this.board[y][x] === 0 &&
            this.board[y][x + 1] === 0 &&
            this.board[y][x + 2] === 0 &&
            this.board[y + 1][x + 1] === 0
          )
        case 3:
          return (
            x <= this.width - 2 &&
            y <= this.height - 3 &&
            this.board[y][x + 1] === 0 &&
            this.board[y + 1][x + 1] === 0 &&
            this.board[y + 1][x] === 0 &&
            this.board[y + 2][x + 1] === 0
          )
      }
      return false
    case 'O':
      return (
        x <= this.width - 2 &&
        y <= this.height - 2 &&
        this.board[y][x] === 0 &&
        this.board[y][x + 1] === 0 &&
        this.board[y + 1][x] === 0 &&
        this.board[y + 1][x + 1] === 0
      )
    case 'L':
      switch (a) {
        case 0:
          return (
            x <= this.width - 3 &&
            y <= this.height - 2 &&
            this.board[y][x] === 0 &&
            this.board[y + 1][x] === 0 &&
            this.board[y + 1][x + 1] === 0 &&
            this.board[y + 1][x + 2] === 0
          )
        case 1:
          return (
            x <= this.width - 2 &&
            y <= this.height - 3 &&
            this.board[y][x] === 0 &&
            this.board[y][x + 1] === 0 &&
            this.board[y + 1][x] === 0 &&
            this.board[y + 2][x] === 0
          )
        case 2:
          return (
            x <= this.width - 3 &&
            y <= this.height - 2 &&
            this.board[y][x] === 0 &&
            this.board[y][x + 1] === 0 &&
            this.board[y][x + 2] === 0 &&
            this.board[y + 1][x + 2] === 0
          )
        case 3:
          return (
            x <= this.width - 2 &&
            y <= this.height - 3 &&
            this.board[y][x + 1] === 0 &&
            this.board[y + 1][x + 1] === 0 &&
            this.board[y + 2][x + 1] === 0 &&
            this.board[y + 2][x] === 0
          )
      }
      return false
    case 'l':
      switch (a) {
        case 0:
          return (
            x <= this.width - 3 &&
            y <= this.height - 2 &&
            this.board[y][x + 2] === 0 &&
            this.board[y + 1][x] === 0 &&
            this.board[y + 1][x + 1] === 0 &&
            this.board[y + 1][x + 2] === 0
          )
        case 1:
          return (
            x <= this.width - 2 &&
            y <= this.height - 3 &&
            this.board[y][x] === 0 &&
            this.board[y + 1][x] === 0 &&
            this.board[y + 2][x] === 0 &&
            this.board[y + 2][x + 1] === 0
          )
        case 2:
          return (
            x <= this.width - 3 &&
            y <= this.height - 2 &&
            this.board[y][x] === 0 &&
            this.board[y][x + 1] === 0 &&
            this.board[y][x + 2] === 0 &&
            this.board[y + 1][x] === 0
          )
        case 3:
          return (
            x <= this.width - 2 &&
            y <= this.height - 3 &&
            this.board[y][x] === 0 &&
            this.board[y][x + 1] === 0 &&
            this.board[y + 1][x + 1] === 0 &&
            this.board[y + 2][x + 1] === 0
          )
      }
      return false
    case 'S':
      if (a === 0 || a === 2) {
        return (
          x <= this.width - 3 &&
          y <= this.height - 2 &&
          this.board[y + 1][x] === 0 &&
          this.board[y + 1][x + 1] === 0 &&
          this.board[y][x + 1] === 0 &&
          this.board[y][x + 2] === 0
        )
      } else {
        return (
          x <= this.width - 2 &&
          y <= this.height - 3 &&
          this.board[y][x] === 0 &&
          this.board[y + 1][x] === 0 &&
          this.board[y + 1][x + 1] === 0 &&
          this.board[y + 2][x + 1] === 0
        )
      }
    case 's':
      if (a === 0 || a === 2) {
        return (
          x <= this.width - 3 &&
          y <= this.height - 2 &&
          this.board[y][x] === 0 &&
          this.board[y][x + 1] === 0 &&
          this.board[y + 1][x + 1] === 0 &&
          this.board[y + 1][x + 2] === 0
        )
      } else {
        return (
          x <= this.width - 2 &&
          y <= this.height - 3 &&
          this.board[y][x + 1] === 0 &&
          this.board[y + 1][x] === 0 &&
          this.board[y + 1][x + 1] === 0 &&
          this.board[y + 2][x] === 0
        )
      }
  }
  return false
}

/* place piece at x,y (y = 0 top of board) orientation a
   assume checking has been done */
Tetris.prototype._placePiece = function({ x, y, a, piece }) {
  switch (piece) {
    case 'I':
      if (a === 0 || a === 2) {
        this.board[y][x] = 'I'
        this.board[y][x + 1] = 'I'
        this.board[y][x + 2] = 'I'
        this.board[y][x + 3] = 'I'
      } else {
        this.board[y][x] = 'I'
        this.board[y + 1][x] = 'I'
        this.board[y + 2][x] = 'I'
        this.board[y + 3][x] = 'I'
      }
      break
    case 'T':
      switch (a) {
        case 0:
          this.board[y][x + 1] = 'T'
          this.board[y + 1][x] = 'T'
          this.board[y + 1][x + 1] = 'T'
          this.board[y + 1][x + 2] = 'T'
          break
        case 1:
          this.board[y][x] = 'T'
          this.board[y + 1][x] = 'T'
          this.board[y + 1][x + 1] = 'T'
          this.board[y + 2][x] = 'T'
          break
        case 2:
          this.board[y][x] = 'T'
          this.board[y][x + 1] = 'T'
          this.board[y][x + 2] = 'T'
          this.board[y + 1][x + 1] = 'T'
          break
        case 3:
          this.board[y][x + 1] = 'T'
          this.board[y + 1][x + 1] = 'T'
          this.board[y + 1][x] = 'T'
          this.board[y + 2][x + 1] = 'T'
          break
      }
      break
    case 'O':
      this.board[y][x] = 'O'
      this.board[y][x + 1] = 'O'
      this.board[y + 1][x] = 'O'
      this.board[y + 1][x + 1] = 'O'
      break
    case 'L':
      switch (a) {
        case 0:
          this.board[y][x] = 'L'
          this.board[y + 1][x] = 'L'
          this.board[y + 1][x + 1] = 'L'
          this.board[y + 1][x + 2] = 'L'
          break
        case 1:
          this.board[y][x] = 'L'
          this.board[y][x + 1] = 'L'
          this.board[y + 1][x] = 'L'
          this.board[y + 2][x] = 'L'
          break
        case 2:
          this.board[y][x] = 'L'
          this.board[y][x + 1] = 'L'
          this.board[y][x + 2] = 'L'
          this.board[y + 1][x + 2] = 'L'
          break
        case 3:
          this.board[y][x + 1] = 'L'
          this.board[y + 1][x + 1] = 'L'
          this.board[y + 2][x + 1] = 'L'
          this.board[y + 2][x] = 'L'
          break
      }
      break
    case 'l':
      switch (a) {
        case 0:
          this.board[y][x + 2] = 'l'
          this.board[y + 1][x] = 'l'
          this.board[y + 1][x + 1] = 'l'
          this.board[y + 1][x + 2] = 'l'
          break
        case 1:
          this.board[y][x] = 'l'
          this.board[y + 1][x] = 'l'
          this.board[y + 2][x] = 'l'
          this.board[y + 2][x + 1] = 'l'
          break
        case 2:
          this.board[y][x] = 'l'
          this.board[y][x + 1] = 'l'
          this.board[y][x + 2] = 'l'
          this.board[y + 1][x] = 'l'
          break
        case 3:
          this.board[y][x] = 'l'
          this.board[y][x + 1] = 'l'
          this.board[y + 1][x + 1] = 'l'
          this.board[y + 2][x + 1] = 'l'
          break
      }
      break
    case 'S':
      if (a === 0 || a === 2) {
        this.board[y + 1][x] = 'S'
        this.board[y + 1][x + 1] = 'S'
        this.board[y][x + 1] = 'S'
        this.board[y][x + 2] = 'S'
      } else {
        this.board[y][x] = 'S'
        this.board[y + 1][x] = 'S'
        this.board[y + 1][x + 1] = 'S'
        this.board[y + 2][x + 1] = 'S'
      }
      break
    case 's':
      if (a === 0 || a === 2) {
        this.board[y][x] = 's'
        this.board[y][x + 1] = 's'
        this.board[y + 1][x + 1] = 's'
        this.board[y + 1][x + 2] = 's'
      } else {
        this.board[y][x + 1] = 's'
        this.board[y + 1][x] = 's'
        this.board[y + 1][x + 1] = 's'
        this.board[y + 2][x] = 's'
      }
      break
  }
}

/* erase piece at x,y (y = 0 top of board) orientation a
   assume checking has been done */
Tetris.prototype._erasePiece = function({ x, y, a, piece }) {
  switch (piece) {
    case 'I':
      if (a === 0 || a === 2) {
        this.board[y][x] = 0
        this.board[y][x + 1] = 0
        this.board[y][x + 2] = 0
        this.board[y][x + 3] = 0
      } else {
        this.board[y][x] = 0
        this.board[y + 1][x] = 0
        this.board[y + 2][x] = 0
        this.board[y + 3][x] = 0
      }
      break
    case 'T':
      switch (a) {
        case 0:
          this.board[y][x + 1] = 0
          this.board[y + 1][x] = 0
          this.board[y + 1][x + 1] = 0
          this.board[y + 1][x + 2] = 0
          break
        case 1:
          this.board[y][x] = 0
          this.board[y + 1][x] = 0
          this.board[y + 1][x + 1] = 0
          this.board[y + 2][x] = 0
          break
        case 2:
          this.board[y][x] = 0
          this.board[y][x + 1] = 0
          this.board[y][x + 2] = 0
          this.board[y + 1][x + 1] = 0
          break
        case 3:
          this.board[y][x + 1] = 0
          this.board[y + 1][x + 1] = 0
          this.board[y + 1][x] = 0
          this.board[y + 2][x + 1] = 0
          break
      }
      break
    case 'O':
      this.board[y][x] = 0
      this.board[y][x + 1] = 0
      this.board[y + 1][x] = 0
      this.board[y + 1][x + 1] = 0
      break
    case 'L':
      switch (a) {
        case 0:
          this.board[y][x] = 0
          this.board[y + 1][x] = 0
          this.board[y + 1][x + 1] = 0
          this.board[y + 1][x + 2] = 0
          break
        case 1:
          this.board[y][x] = 0
          this.board[y][x + 1] = 0
          this.board[y + 1][x] = 0
          this.board[y + 2][x] = 0
          break
        case 2:
          this.board[y][x] = 0
          this.board[y][x + 1] = 0
          this.board[y][x + 2] = 0
          this.board[y + 1][x + 2] = 0
          break
        case 3:
          this.board[y][x + 1] = 0
          this.board[y + 1][x + 1] = 0
          this.board[y + 2][x + 1] = 0
          this.board[y + 2][x] = 0
          break
      }
      break
    case 'l':
      switch (a) {
        case 0:
          this.board[y][x + 2] = 0
          this.board[y + 1][x] = 0
          this.board[y + 1][x + 1] = 0
          this.board[y + 1][x + 2] = 0
          break
        case 1:
          this.board[y][x] = 0
          this.board[y + 1][x] = 0
          this.board[y + 2][x] = 0
          this.board[y + 2][x + 1] = 0
          break
        case 2:
          this.board[y][x] = 0
          this.board[y][x + 1] = 0
          this.board[y][x + 2] = 0
          this.board[y + 1][x] = 0
          break
        case 3:
          this.board[y][x] = 0
          this.board[y][x + 1] = 0
          this.board[y + 1][x + 1] = 0
          this.board[y + 2][x + 1] = 0
          break
      }
      break
    case 'S':
      if (a === 0 || a === 2) {
        this.board[y + 1][x] = 0
        this.board[y + 1][x + 1] = 0
        this.board[y][x + 1] = 0
        this.board[y][x + 2] = 0
      } else {
        this.board[y][x] = 0
        this.board[y + 1][x] = 0
        this.board[y + 1][x + 1] = 0
        this.board[y + 2][x + 1] = 0
      }
      break
    case 's':
      if (a === 0 || a === 2) {
        this.board[y][x] = 0
        this.board[y][x + 1] = 0
        this.board[y + 1][x + 1] = 0
        this.board[y + 1][x + 2] = 0
      } else {
        this.board[y][x + 1] = 0
        this.board[y + 1][x] = 0
        this.board[y + 1][x + 1] = 0
        this.board[y + 2][x] = 0
      }
      break
  }
}

module.exports = Tetris
