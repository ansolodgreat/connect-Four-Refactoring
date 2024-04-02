class Game {
  constructor(p1, p2, height = 6, width = 7) {
      this.players = [p1, p2];
      this.height = height;
      this.width = width;
      this.currPlayer = p1;
      this.makeBoard();
      this._makeHtmlBoard();
      this.gameOver = false;
  }

  makeBoard() {
      this.board = [];
      for (let y = 0; y < this.height; y++) {
          this.board.push(Array.from({ length: this.width }));
      }
  }

  _makeHtmlBoard() {
      const board = document.getElementById('board');
      board.innerHTML = '';

      const top = document.createElement('tr');
      top.setAttribute('id', 'column-top');
      top.addEventListener('click', this._handleClick.bind(this));

      for (let x = 0; x < this.width; x++) {
          const headCell = document.createElement('td');
          headCell.setAttribute('id', x);
          top.append(headCell);
      }

      board.append(top);

      for (let y = 0; y < this.height; y++) {
          const row = document.createElement('tr');
          for (let x = 0; x < this.width; x++) {
              const cell = document.createElement('td');
              cell.setAttribute('id', `${y}-${x}`);
              row.append(cell);
          }
          board.append(row);
      }
  }

  _findSpotForCol(x) {
      for (let y = this.height - 1; y >= 0; y--) {
          if (!this.board[y][x]) {
              return y;
          }
      }
      return null;
  }

  _placeInTable(y, x) {
      const piece = document.createElement('div');
      piece.classList.add('piece');
      piece.style.backgroundColor = this.currPlayer.color;
      piece.style.top = -50 * (y + 2);

      const spot = document.getElementById(`${y}-${x}`);
      spot.append(piece);
  }

  _endGame(msg) {
      alert(msg);
      const top = document.querySelector("#column-top");
      top.removeEventListener("click", this._handleClick);
  }

  _handleClick(evt) {
      if (this.gameOver) return;

      const x = +evt.target.id;
      const y = this._findSpotForCol(x);
      if (y === null) {
          return;
      }

      this.board[y][x] = this.currPlayer;
      this._placeInTable(y, x);

      if (this.board.every(row => row.every(cell => cell))) {
          return this._endGame('Tie!');
      }

      if (this._checkForWin()) {
          this.gameOver = true;
          return this._endGame(`The ${this.currPlayer.color} player won!`);
      }

      this.currPlayer = this.currPlayer === this.players[0] ? this.players[1] : this.players[0];
  }

  _checkForWin() {
      const _win = cells =>
          cells.every(([y, x]) =>
              y >= 0 &&
              y < this.height &&
              x >= 0 &&
              x < this.width &&
              this.board[y][x] === this.currPlayer
          );

      for (let y = 0; y < this.height; y++) {
          for (let x = 0; x < this.width; x++) {
              const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
              const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
              const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
              const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

              if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
                  return true;
              }
          }
      }
  }
}

class Player {
  constructor(color) {
      this.color = color;
  }
}

document.getElementById('start-game').addEventListener('click', () => {
  const p1Color = document.getElementById('p1-color').value;
  const p2Color = document.getElementById('p2-color').value;

  if (!p1Color || !p2Color) {
      alert("Please choose colors for both players.");
      return;
  }

  if (p1Color === p2Color) {
      alert("Players must choose different colors.");
      return;
  }

  const p1 = new Player(p1Color);
  const p2 = new Player(p2Color);
  new Game(p1, p2);
});
