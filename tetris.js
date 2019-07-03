function Tetris() {}
/*
tetris is a portrait oriented rectangular grid, 20x10
there are seven tetronimos,
2x2 square, 4x1 rectangle, left- and right-handed L shapes (3x1 with the fourth square on an end), a T shape (3x1 rectangle with fourth square in center), left- and right-handed S shapes (2 2x2 layers offset)
there is a spawn command which drops a new random shape at the top of the grid within the
four central columns
users can move block left or right, or rotate by 90 as they fall
when a piece hits another piece it stops falling
when a row is full, it is cleared and everything else moves down
if a piece is stuck and touches the top, the game is over
*/

module.exports = Tetris