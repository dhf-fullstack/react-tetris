const Tetris = require('./tetris')
const tetris = new Tetris()

console.log(tetris.renderAscii())
console.log("New 'I'", tetris.newPiece('I'))
console.log(tetris.renderAscii())
for (let t = 0; t < 25; t++) {
  console.log(`Update: ${t}`, tetris.update())
}
console.log(tetris.renderAscii())

console.log("Second New 'I'", tetris.newPiece('I'))
console.log(tetris.renderAscii())
const r = tetris.rotate()
if (!r) {
  console.log('rotate failed')
} else {
  console.log(tetris.renderAscii())
  for (let t = 0; t < 25; t++) {
    console.log(`Update: ${t}`, tetris.update())
  }
  console.log(tetris.renderAscii())
}
