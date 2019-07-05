/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const Tetris = __webpack_require__(/*! ./tetris */ \"./tetris.js\")\nconst tetris = new Tetris()\n\nconsole.log(tetris.renderAscii())\nconsole.log(\"New 'I'\", tetris.newPiece('I'))\nconsole.log(tetris.renderAscii())\nfor (let t = 0; t < 25; t++) {\n  console.log(`Update: ${t}`, tetris.update())\n}\nconsole.log(tetris.renderAscii())\n\nconsole.log(\"Second New 'I'\", tetris.newPiece('I'))\nconsole.log(tetris.renderAscii())\nconst r = tetris.rotate()\nif (!r) {\n  console.log('rotate failed')\n} else {\n  console.log(tetris.renderAscii())\n  for (let t = 0; t < 25; t++) {\n    console.log(`Update: ${t}`, tetris.update())\n  }\n  console.log(tetris.renderAscii())\n}\n\n\n//# sourceURL=webpack:///./index.js?");

/***/ }),

/***/ "./tetris.js":
/*!*******************!*\
  !*** ./tetris.js ***!
  \*******************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("function Tetris() {\n  /*\n    tetris is a portrait oriented rectangular grid, 20x10\n  */\n  this.height = 20\n  this.width = 10\n  this.board = new Array(this.height)\n  for (let i = 0; i < this.height; i++) {\n    this.board[i] = new Array(this.width)\n    this.board[i].fill(0)\n  }\n  /*\n    there are seven tetronimos:\n    I: 4x1 rectangle,\n    T: 3x1 rectangle with 4th square attached to center\n    O: 2x2 square\n    L,l: left- and right-handed L shapes (3x1 with the fourth square on an end)\n    S,s: left- and right-handed S shapes (2 2x2 layers offset)\n  */\n  this.pieces = ['I', 'T', 'O', 'L', 'l', 'S', 's']\n  this.pieces_bb = {\n    /* piece: [width, height] */\n    I: [4, 1],\n    T: [3, 2],\n    O: [2, 2],\n    L: [3, 2],\n    l: [3, 2],\n    S: [3, 2],\n    s: [3, 2],\n  }\n  /* there may be a current piece, if there is it is { piece:, x:, y:, a: } */\n  this.currentPiece = undefined\n}\n\n/* Render the board in ascii, returning a string */\n\n/*\n+---+---+---+---+---+---+---+---+---+---+\n| T | T | T |   |   |   |   |   |   |   |\n|   | T |   |   |   |   |   |   |   |   |\n+---+---+---+---+---+---+---+---+---+---+\n*/\n\nTetris.prototype.renderAscii = function() {\n  let s = '+'\n  for (let x = 0; x < this.width; x++) {\n    s += '---+'\n  }\n  s += '\\n'\n  for (let y = 0; y < this.height; y++) {\n    s += '|'\n    for (let x = 0; x < this.width; x++) {\n      s += this.board[y][x] === 0 ? '   |' : ` ${this.board[y][x]} |`\n    }\n    s += '\\n'\n  }\n  s += '+'\n  for (let x = 0; x < this.width; x++) {\n    s += '---+'\n  }\n  return s\n}\n\n/*\n  there is a newPiece function which drops a new random shape at the top of the grid\n  in the first two rows, within the four central columns, returning true on success\n  or false if no room (game loss)\n  newPiece can also take a piece explicitly, for testing\n*/\n\nTetris.prototype.newPiece = function(p) {\n  /* p is one of this.pieces for testing; if undefined, choose randomly */\n  if (p === undefined || !this.pieces.includes(p)) {\n    p = this.pieces[Math.random(this.pieces.length)]\n  }\n  const piece = p\n  const y = 0\n  const x = piece === 'I' ? 3 : 4\n  const a = 0\n  const n = { x, y, a, piece }\n  if (this._canPlacePiece(n)) {\n    this.currentPiece = n\n    this._placePiece(n)\n    return true\n  } else {\n    this.currentPiece = undefined\n    return false\n  }\n}\n\n/*\n  users can move current piece left or right, or rotate by 90 clockwise\n  return true if change was possibe else false if impossible or no current piece\n*/\n\nTetris.prototype.moveLeft = function() {\n  if (!this.currentPiece) {\n    return false\n  }\n  if (!this._canPlacePiece({ ...this.currentPiece, x: this.currentPiece.x - 1 })) {\n    return false\n  }\n  this._erasePiece(this.currentPiece)\n  this.currentPiece.x--\n  this._placePiece(this.currentPiece)\n  return true\n}\n\nTetris.prototype.moveRight = function() {\n  if (!this.currentPiece) {\n    return false\n  }\n  if (!this._canPlacePiece({ ...this.currentPiece, x: this.currentPiece.x + 1 })) {\n    return false\n  }\n  this._erasePiece(this.currentPiece)\n  this.currentPiece.x++\n  this._placePiece(this.currentPiece)\n  return true\n}\n\nTetris.prototype.rotate = function() {\n  if (!this.currentPiece) {\n    return false\n  }\n  if (!this._canPlacePiece({ ...this.currentPiece, a: (this.currentPiece.a + 1) % 4 })) {\n    return false\n  }\n  this._erasePiece(this.currentPiece)\n  this.currentPiece.a = (this.currentPiece.a + 1) % 4\n  this._placePiece(this.currentPiece)\n  return true\n}\n\n/*\n  there is an update function which moves the current piece, if any,\n  down by one row, deleting full rows, moving all remaining rows down,\n  returning true if that was possible and false if not\n*/\nTetris.prototype.update = function() {\n  if (!this.currentPiece) {\n    return false\n  }\n  if (!this._canPlacePiece({ ...this.currentPiece, y: this.currentPiece.y + 1 })) {\n    return false\n  }\n  this._erasePiece(this.currentPiece)\n  this.currentPiece.y++\n  this._placePiece(this.currentPiece)\n\n  for (let y = this.height - 1; y > 0; y--) {\n    if (this.board[y].every(c => c !== 0)) {\n      for (let j = y; j > 0; j--) {\n        for (let i = 0; i < this.width; i++) {\n          this.board[j][i] = this.board[j - 1][i]\n        }\n      }\n      for (let i = 0; i < this.width; i++) {\n        this.board[0][i] = 0\n      }\n    }\n  }\n\n  return true\n}\n\n/*\n  when a piece hits another piece it stops falling\n*/\n/*\nwhen a row is full, it is cleared and everything else moves down\nif a piece is stuck and touches the top, the game is over\n*/\n\n/* Return true if can place piece at x,y (y = 0 top of board) \n   and false if not or if any params are out of range\n   a 'angle' is 0, 1, 2, 3 for 0, 90, 180, 270 in normal clockwise order\n   the 0 degree orientations are:\n   I: ---- T: -^- L: '-- l: --' S: _;-  s: -;_\n*/\nTetris.prototype._canPlacePiece = function(p) {\n  console.log('_canPlacePiece: ', p, this.currentPiece)\n  if (this.currentPiece) {\n    this._erasePiece(this.currentPiece)\n  }\n  const r = this._canPlacePiece2(p)\n  if (this.currentPiece) {\n    this._placePiece(this.currentPiece)\n  }\n  return r\n}\n\nTetris.prototype._canPlacePiece2 = function({ x, y, a, piece }) {\n  if (!this.pieces.includes(piece) || x < 0 || y < 0 || a < 0 || a > 3) {\n    return false\n  }\n  switch (piece) {\n    case 'I':\n      if (a === 0 || a === 2) {\n        return (\n          x <= this.width - 4 &&\n          y <= this.height - 1 &&\n          this.board[y][x] === 0 &&\n          this.board[y][x + 1] === 0 &&\n          this.board[y][x + 2] === 0 &&\n          this.board[y][x + 3] === 0\n        )\n      } else {\n        /*\n        console.log('y ', y <= this.height - 4)\n        console.log('x ', x <= this.width - 1)\n        console.log(`${[y][x]}`, this.board[y][x])\n        console.log(`${[y + 1][x]}`, this.board[y + 1][x])\n        console.log(`${[y + 2][x]}`, this.board[y + 2][x])\n        console.log(`${[y + 3][x]}`, this.board[y + 3][x])\n*/\n        return (\n          y <= this.height - 4 &&\n          x <= this.width - 1 &&\n          this.board[y][x] === 0 &&\n          this.board[y + 1][x] === 0 &&\n          this.board[y + 2][x] === 0 &&\n          this.board[y + 3][x] === 0\n        )\n      }\n    case 'T':\n      switch (a) {\n        case 0:\n          return (\n            x <= this.width - 3 &&\n            y <= this.height - 2 &&\n            this.board[y][x + 1] === 0 &&\n            this.board[y + 1][x] === 0 &&\n            this.board[y + 1][x + 1] === 0 &&\n            this.board[y + 1][x + 2] === 0\n          )\n        case 1:\n          return (\n            x <= this.width - 2 &&\n            y <= this.height - 3 &&\n            this.board[y][x] === 0 &&\n            this.board[y + 1][x] === 0 &&\n            this.board[y + 1][x + 1] === 0 &&\n            this.board[y + 2][x] === 0\n          )\n        case 2:\n          return (\n            x <= this.width - 3 &&\n            y <= this.height - 2 &&\n            this.board[y][x] === 0 &&\n            this.board[y][x + 1] === 0 &&\n            this.board[y][x + 2] === 0 &&\n            this.board[y + 1][x + 1] === 0\n          )\n        case 3:\n          return (\n            x <= this.width - 2 &&\n            y <= this.height - 3 &&\n            this.board[y][x + 1] === 0 &&\n            this.board[y + 1][x + 1] === 0 &&\n            this.board[y + 1][x] === 0 &&\n            this.board[y + 2][x + 1] === 0\n          )\n      }\n      return false\n    case 'O':\n      return (\n        x <= this.width - 2 &&\n        y <= this.height - 2 &&\n        this.board[y][x] === 0 &&\n        this.board[y][x + 1] === 0 &&\n        this.board[y + 1][x] === 0 &&\n        this.board[y + 1][x + 1] === 0\n      )\n    case 'L':\n      switch (a) {\n        case 0:\n          return (\n            x <= this.width - 3 &&\n            y <= this.height - 2 &&\n            this.board[y][x] === 0 &&\n            this.board[y + 1][x] === 0 &&\n            this.board[y + 1][x + 1] === 0 &&\n            this.board[y + 1][x + 2] === 0\n          )\n        case 1:\n          return (\n            x <= this.width - 2 &&\n            y <= this.height - 3 &&\n            this.board[y][x] === 0 &&\n            this.board[y][x + 1] === 0 &&\n            this.board[y + 1][x] === 0 &&\n            this.board[y + 2][x] === 0\n          )\n        case 2:\n          return (\n            x <= this.width - 3 &&\n            y <= this.height - 2 &&\n            this.board[y][x] === 0 &&\n            this.board[y][x + 1] === 0 &&\n            this.board[y][x + 2] === 0 &&\n            this.board[y + 1][x + 2] === 0\n          )\n        case 3:\n          return (\n            x <= this.width - 2 &&\n            y <= this.height - 3 &&\n            this.board[y][x + 1] === 0 &&\n            this.board[y + 1][x + 1] === 0 &&\n            this.board[y + 2][x + 1] === 0 &&\n            this.board[y + 2][x] === 0\n          )\n      }\n      return false\n    case 'l':\n      switch (a) {\n        case 0:\n          return (\n            x <= this.width - 3 &&\n            y <= this.height - 2 &&\n            this.board[y][x + 2] === 0 &&\n            this.board[y + 1][x] === 0 &&\n            this.board[y + 1][x + 1] === 0 &&\n            this.board[y + 1][x + 2] === 0\n          )\n        case 1:\n          return (\n            x <= this.width - 2 &&\n            y <= this.height - 3 &&\n            this.board[y][x] === 0 &&\n            this.board[y + 1][x] === 0 &&\n            this.board[y + 2][x] === 0 &&\n            this.board[y + 2][x + 1] === 0\n          )\n        case 2:\n          return (\n            x <= this.width - 3 &&\n            y <= this.height - 2 &&\n            this.board[y][x] === 0 &&\n            this.board[y][x + 1] === 0 &&\n            this.board[y][x + 2] === 0 &&\n            this.board[y + 1][x] === 0\n          )\n        case 3:\n          return (\n            x <= this.width - 2 &&\n            y <= this.height - 3 &&\n            this.board[y][x] === 0 &&\n            this.board[y][x + 1] === 0 &&\n            this.board[y + 1][x + 1] === 0 &&\n            this.board[y + 2][x + 1] === 0\n          )\n      }\n      return false\n    case 'S':\n      if (a === 0 || a === 2) {\n        return (\n          x <= this.width - 3 &&\n          y <= this.height - 2 &&\n          this.board[y + 1][x] === 0 &&\n          this.board[y + 1][x + 1] === 0 &&\n          this.board[y][x + 1] === 0 &&\n          this.board[y][x + 2] === 0\n        )\n      } else {\n        return (\n          x <= this.width - 2 &&\n          y <= this.height - 3 &&\n          this.board[y][x] === 0 &&\n          this.board[y + 1][x] === 0 &&\n          this.board[y + 1][x + 1] === 0 &&\n          this.board[y + 2][x + 1] === 0\n        )\n      }\n    case 's':\n      if (a === 0 || a === 2) {\n        return (\n          x <= this.width - 3 &&\n          y <= this.height - 2 &&\n          this.board[y][x] === 0 &&\n          this.board[y][x + 1] === 0 &&\n          this.board[y + 1][x + 1] === 0 &&\n          this.board[y + 1][x + 2] === 0\n        )\n      } else {\n        return (\n          x <= this.width - 2 &&\n          y <= this.height - 3 &&\n          this.board[y][x + 1] === 0 &&\n          this.board[y + 1][x] === 0 &&\n          this.board[y + 1][x + 1] === 0 &&\n          this.board[y + 2][x] === 0\n        )\n      }\n  }\n  return false\n}\n\n/* place piece at x,y (y = 0 top of board) orientation a\n   assume checking has been done */\nTetris.prototype._placePiece = function({ x, y, a, piece }) {\n  switch (piece) {\n    case 'I':\n      if (a === 0 || a === 2) {\n        this.board[y][x] = 'I'\n        this.board[y][x + 1] = 'I'\n        this.board[y][x + 2] = 'I'\n        this.board[y][x + 3] = 'I'\n      } else {\n        this.board[y][x] = 'I'\n        this.board[y + 1][x] = 'I'\n        this.board[y + 2][x] = 'I'\n        this.board[y + 3][x] = 'I'\n      }\n      break\n    case 'T':\n      switch (a) {\n        case 0:\n          this.board[y][x + 1] = 'T'\n          this.board[y + 1][x] = 'T'\n          this.board[y + 1][x + 1] = 'T'\n          this.board[y + 1][x + 2] = 'T'\n          break\n        case 1:\n          this.board[y][x] = 'T'\n          this.board[y + 1][x] = 'T'\n          this.board[y + 1][x + 1] = 'T'\n          this.board[y + 2][x] = 'T'\n          break\n        case 2:\n          this.board[y][x] = 'T'\n          this.board[y][x + 1] = 'T'\n          this.board[y][x + 2] = 'T'\n          this.board[y + 1][x + 1] = 'T'\n          break\n        case 3:\n          this.board[y][x + 1] = 'T'\n          this.board[y + 1][x + 1] = 'T'\n          this.board[y + 1][x] = 'T'\n          this.board[y + 2][x + 1] = 'T'\n          break\n      }\n      break\n    case 'O':\n      this.board[y][x] = 'O'\n      this.board[y][x + 1] = 'O'\n      this.board[y + 1][x] = 'O'\n      this.board[y + 1][x + 1] = 'O'\n      break\n    case 'L':\n      switch (a) {\n        case 0:\n          this.board[y][x] = 'L'\n          this.board[y + 1][x] = 'L'\n          this.board[y + 1][x + 1] = 'L'\n          this.board[y + 1][x + 2] = 'L'\n          break\n        case 1:\n          this.board[y][x] = 'L'\n          this.board[y][x + 1] = 'L'\n          this.board[y + 1][x] = 'L'\n          this.board[y + 2][x] = 'L'\n          break\n        case 2:\n          this.board[y][x] = 'L'\n          this.board[y][x + 1] = 'L'\n          this.board[y][x + 2] = 'L'\n          this.board[y + 1][x + 2] = 'L'\n          break\n        case 3:\n          this.board[y][x + 1] = 'L'\n          this.board[y + 1][x + 1] = 'L'\n          this.board[y + 2][x + 1] = 'L'\n          this.board[y + 2][x] = 'L'\n          break\n      }\n      break\n    case 'l':\n      switch (a) {\n        case 0:\n          this.board[y][x + 2] = 'l'\n          this.board[y + 1][x] = 'l'\n          this.board[y + 1][x + 1] = 'l'\n          this.board[y + 1][x + 2] = 'l'\n          break\n        case 1:\n          this.board[y][x] = 'l'\n          this.board[y + 1][x] = 'l'\n          this.board[y + 2][x] = 'l'\n          this.board[y + 2][x + 1] = 'l'\n          break\n        case 2:\n          this.board[y][x] = 'l'\n          this.board[y][x + 1] = 'l'\n          this.board[y][x + 2] = 'l'\n          this.board[y + 1][x] = 'l'\n          break\n        case 3:\n          this.board[y][x] = 'l'\n          this.board[y][x + 1] = 'l'\n          this.board[y + 1][x + 1] = 'l'\n          this.board[y + 2][x + 1] = 'l'\n          break\n      }\n      break\n    case 'S':\n      if (a === 0 || a === 2) {\n        this.board[y + 1][x] = 'S'\n        this.board[y + 1][x + 1] = 'S'\n        this.board[y][x + 1] = 'S'\n        this.board[y][x + 2] = 'S'\n      } else {\n        this.board[y][x] = 'S'\n        this.board[y + 1][x] = 'S'\n        this.board[y + 1][x + 1] = 'S'\n        this.board[y + 2][x + 1] = 'S'\n      }\n      break\n    case 's':\n      if (a === 0 || a === 2) {\n        this.board[y][x] = 's'\n        this.board[y][x + 1] = 's'\n        this.board[y + 1][x + 1] = 's'\n        this.board[y + 1][x + 2] = 's'\n      } else {\n        this.board[y][x + 1] = 's'\n        this.board[y + 1][x] = 's'\n        this.board[y + 1][x + 1] = 's'\n        this.board[y + 2][x] = 's'\n      }\n      break\n  }\n}\n\n/* erase piece at x,y (y = 0 top of board) orientation a\n   assume checking has been done */\nTetris.prototype._erasePiece = function({ x, y, a, piece }) {\n  switch (piece) {\n    case 'I':\n      if (a === 0 || a === 2) {\n        this.board[y][x] = 0\n        this.board[y][x + 1] = 0\n        this.board[y][x + 2] = 0\n        this.board[y][x + 3] = 0\n      } else {\n        this.board[y][x] = 0\n        this.board[y + 1][x] = 0\n        this.board[y + 2][x] = 0\n        this.board[y + 3][x] = 0\n      }\n      break\n    case 'T':\n      switch (a) {\n        case 0:\n          this.board[y][x + 1] = 0\n          this.board[y + 1][x] = 0\n          this.board[y + 1][x + 1] = 0\n          this.board[y + 1][x + 2] = 0\n          break\n        case 1:\n          this.board[y][x] = 0\n          this.board[y + 1][x] = 0\n          this.board[y + 1][x + 1] = 0\n          this.board[y + 2][x] = 0\n          break\n        case 2:\n          this.board[y][x] = 0\n          this.board[y][x + 1] = 0\n          this.board[y][x + 2] = 0\n          this.board[y + 1][x + 1] = 0\n          break\n        case 3:\n          this.board[y][x + 1] = 0\n          this.board[y + 1][x + 1] = 0\n          this.board[y + 1][x] = 0\n          this.board[y + 2][x + 1] = 0\n          break\n      }\n      break\n    case 'O':\n      this.board[y][x] = 0\n      this.board[y][x + 1] = 0\n      this.board[y + 1][x] = 0\n      this.board[y + 1][x + 1] = 0\n      break\n    case 'L':\n      switch (a) {\n        case 0:\n          this.board[y][x] = 0\n          this.board[y + 1][x] = 0\n          this.board[y + 1][x + 1] = 0\n          this.board[y + 1][x + 2] = 0\n          break\n        case 1:\n          this.board[y][x] = 0\n          this.board[y][x + 1] = 0\n          this.board[y + 1][x] = 0\n          this.board[y + 2][x] = 0\n          break\n        case 2:\n          this.board[y][x] = 0\n          this.board[y][x + 1] = 0\n          this.board[y][x + 2] = 0\n          this.board[y + 1][x + 2] = 0\n          break\n        case 3:\n          this.board[y][x + 1] = 0\n          this.board[y + 1][x + 1] = 0\n          this.board[y + 2][x + 1] = 0\n          this.board[y + 2][x] = 0\n          break\n      }\n      break\n    case 'l':\n      switch (a) {\n        case 0:\n          this.board[y][x + 2] = 0\n          this.board[y + 1][x] = 0\n          this.board[y + 1][x + 1] = 0\n          this.board[y + 1][x + 2] = 0\n          break\n        case 1:\n          this.board[y][x] = 0\n          this.board[y + 1][x] = 0\n          this.board[y + 2][x] = 0\n          this.board[y + 2][x + 1] = 0\n          break\n        case 2:\n          this.board[y][x] = 0\n          this.board[y][x + 1] = 0\n          this.board[y][x + 2] = 0\n          this.board[y + 1][x] = 0\n          break\n        case 3:\n          this.board[y][x] = 0\n          this.board[y][x + 1] = 0\n          this.board[y + 1][x + 1] = 0\n          this.board[y + 2][x + 1] = 0\n          break\n      }\n      break\n    case 'S':\n      if (a === 0 || a === 2) {\n        this.board[y + 1][x] = 0\n        this.board[y + 1][x + 1] = 0\n        this.board[y][x + 1] = 0\n        this.board[y][x + 2] = 0\n      } else {\n        this.board[y][x] = 0\n        this.board[y + 1][x] = 0\n        this.board[y + 1][x + 1] = 0\n        this.board[y + 2][x + 1] = 0\n      }\n      break\n    case 's':\n      if (a === 0 || a === 2) {\n        this.board[y][x] = 0\n        this.board[y][x + 1] = 0\n        this.board[y + 1][x + 1] = 0\n        this.board[y + 1][x + 2] = 0\n      } else {\n        this.board[y][x + 1] = 0\n        this.board[y + 1][x] = 0\n        this.board[y + 1][x + 1] = 0\n        this.board[y + 2][x] = 0\n      }\n      break\n  }\n}\n\nmodule.exports = Tetris\n\n\n//# sourceURL=webpack:///./tetris.js?");

/***/ }),

/***/ 0:
/*!************************************!*\
  !*** multi ./index.js ./tetris.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("__webpack_require__(/*! /Users/dhf/Dropbox/Home/Fullstack/Fellowship/tetris/index.js */\"./index.js\");\nmodule.exports = __webpack_require__(/*! /Users/dhf/Dropbox/Home/Fullstack/Fellowship/tetris/tetris.js */\"./tetris.js\");\n\n\n//# sourceURL=webpack:///multi_./index.js_./tetris.js?");

/***/ })

/******/ });