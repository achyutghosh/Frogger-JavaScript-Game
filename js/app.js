// Variables to be used in the game
var TILE_WIDTH = 101;
var TILE_HEIGHT = 83;
var ENEMY_SPEED = 3;
var ENEMY_X_START = -50;
var START_X_PLAYER = TILE_WIDTH * 4;
var START_Y_PLAYER = TILE_HEIGHT * 5 - 10;
var TIME_INTERVAL = 500;
var POINT = 0;
var LIFE = 3;
var WIN_POINT = 25;

// Generate Random Y Axis (between 1st stone tile to 4th grass tile from top)
function randomYPosition() {
  return Math.floor(Math.random() * (4 - 1 + 1))+1;
}

// Generate Random X Axis (between 1st stone tile to 10th from left)
function randomXPosition() {
  return Math.floor(Math.random() * (9 - 0 + 1));
}

// Overwrite inner HTML text of target id element
function insertTextOfElement(idName, insertText) {
  return document.getElementById(idName).innerHTML = insertText;
}

// To track life
function insertLife(idLife, insertLifet) {
  return (document.getElementById(idLife).innerHTML = insertLifet);
}

// Set player's position to starting point
function setPlayerStartPosition(player) {
  player.x = START_X_PLAYER;
  player.y = START_Y_PLAYER;
}

// Generate an enemy on random starting position
class Enemy {
  constructor() {
    this.sprite = "images/enemy-bug.png";
    this.x = ENEMY_X_START;
    this.y = TILE_HEIGHT * randomYPosition() - 20;
  }

  update(dt) {
    this.x += (dt * 100 * (ENEMY_SPEED + 1));

    // Delete enemy once it crosses the canvas
    if (this.x > TILE_WIDTH * 10) { // As canves width is 1010
      var index = allEnemies.indexOf(this);
      allEnemies.splice(index, 0);
    }

    // When enemy hits player (note: consider the size of graphics)
    if (player) {
      if ((player.x - this.x < 30) && (this.x - player.x < 30) && (this.y - player.y < 30) && (player.y - this.y < 30)) {
        setPlayerStartPosition(player);
        if (LIFE >= 1) {
          LIFE--;
        }
        //insertTextOfElement('points', POINT);
        insertLife('lifes', LIFE)

        if (LIFE === 0) {
          popUpMessage();
        }
      }
    }
  }

  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }
}


// Generate player on starting position
class Player {
  constructor() {
    this.sprite = "images/char-boy.png";
    setPlayerStartPosition(this);
  }

  // Set player position
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }

  // Handle player key moves
  handleInput(keyPress, pause) {
    if (!pause || keyPress === "space") {
      switch (keyPress) {
        case "up":
          if (this.y > -10) {
            this.y -= TILE_HEIGHT;
          }
          break;
        case "down":
          if (this.y < START_Y_PLAYER) {
            this.y += TILE_HEIGHT;
          }
          break;
        case "right":
          if (this.x < 101 * 9) {
            this.x += TILE_WIDTH;
          }
          break;
        case "left":
          if (this.x > 0) {
            this.x -= TILE_WIDTH;
          }
          break;
      }
    }
  }
}


// Star item
class Star {
  constructor() {
    this.sprite = 'images/Star.png';
    this.x = TILE_WIDTH * randomXPosition();
    this.y = TILE_HEIGHT * randomYPosition();
  }

  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }

  update() {
    if ((player.x - this.x < 30) && (this.x - player.x < 30) && (this.y - player.y < 30) && (player.y - this.y < 30)) {
      POINT = POINT + 2;
      //setPlayerStartPosition(player);
      insertTextOfElement('points', POINT);
      this.x = TILE_WIDTH * randomXPosition();

      // Pop up message on reaching WIN_POINT points
      if (POINT >= WIN_POINT) {
        popUpMessage();
      }
    }
  }
}

// Blue Gem item
class BlueGem {
  constructor() {
    this.sprite = "images/Gem Blue.png";
    this.x = TILE_WIDTH * randomXPosition();
    this.y = TILE_HEIGHT * randomYPosition();
  }

  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }

  update() {
    if ((player.x - this.x < 30) && (this.x - player.x < 30) && (this.y - player.y < 30) && (player.y - this.y < 30)) {
      POINT++;
      //setPlayerStartPosition(player);
      insertTextOfElement("points", POINT);
      this.x = TILE_WIDTH * randomXPosition();

      // Pop up message on reaching WIN_POINT points
      if (POINT >= WIN_POINT) {
        popUpMessage();
      }
    }
  }
}

class GreenGem {
  constructor() {
    this.sprite = "images/Gem Green.png";
    this.x = TILE_WIDTH * randomXPosition();
    this.y = TILE_HEIGHT * randomYPosition();
  }

  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }
  // Randomly place a new star after user collects once also update points
  update() {
    if (
      player.x - this.x < 30 &&
      this.x - player.x < 30 &&
      this.y - player.y < 30 &&
      player.y - this.y < 30
    ) {
        POINT++;
        //setPlayerStartPosition(player);
        insertTextOfElement("points", POINT);
        this.x = TILE_WIDTH * randomXPosition();

        // Pop up message on reaching WIN_POINT points
      if (POINT >= WIN_POINT) {
          popUpMessage();
        }
      }
  }
}


// Create a player and enemies to start a new game
var player, allEnemies, enemyCreation, heart, star, blueGem, greenGem;

// Generate a new enemy and push it to the enemy array
function enemyGenerationCycle() {
  enemyCreation = setInterval(function() {
    allEnemies.push(new Enemy());
  }, TIME_INTERVAL);
}

// Initialize a new game
function startGame() {
  clearInterval(enemyCreation);
  player = new Player();
  star = new Star();
  blueGem = new BlueGem();
  greenGem = new GreenGem();
  allEnemies = [];
  enemyGenerationCycle();
  insertLife('lifes', LIFE);
  insertTextOfElement('points', POINT);
}

// Pop up message on reaching WIN_POINT points or losing the game
// and reset the life to 3
function popUpMessage() {
  if(LIFE === 0) {
    window.location.href = window.location.pathname + '#gameover';
    LIFE = 3;
    POINT = 0;
    insertTextOfElement('points', POINT);
    insertLife('lifes', LIFE);
  } else if(POINT >= WIN_POINT) {
    window.location.href = window.location.pathname + '#accomplished';
    POINT = 0;
    LIFE = 3;
    insertLife('lifes', LIFE);
    insertTextOfElement('points', POINT);
  }
}

// Eventlistener setup for keyboard
var keyBindings = function(e) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
    32: 'space',
  };
  player.handleInput(allowedKeys[e.keyCode]);
};
document.addEventListener('keydown', keyBindings);

// GAME TIME!!!
startGame();
