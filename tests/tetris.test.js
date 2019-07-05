const Tetris = require('../tetris')
let tetris

beforeEach(() => {
  tetris = new Tetris()
})

describe('tetris.board', () => {
  it('to be an array', () => {
    expect(tetris.board).not.toBeNull()
    expect(tetris.board).not.toBeUndefined()
    expect(Array.isArray(tetris.board)).toBeTruthy()
  })
  it('to be a two dimensional board 20 x 10', () => {
    expect(tetris.board.length).toBe(20)
    expect(tetris.board.every(r => Array.isArray(r) && r.length === 10)).toBeTruthy()
  })
})

describe('New piece is', () => {
  it('a new I at 0,4', () => {
    tetris.newPiece('I')
    expect(tetris.board[0]).toEqual([0, 0, 0, 0, 0, 'I', 'I', 'I', 'I', 0, 0])
  })
})
