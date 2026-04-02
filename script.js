const board = document.querySelector(".board");

const startButton = document.querySelector('.start-button')
const modal = document.querySelector('.modal')

const startGameModal = document.querySelector('.start-game');
const gameOverModal = document.querySelector('.game-over');
const restartButton = document.querySelector('.btn-restart');

// Score & Timer Elements
const highScoreElement = document.querySelector('#high-score');
const scoreElement = document.querySelector('#score');
const timeElement = document.querySelector('#time');


const blockHeight = 30;
const blockWidth = 30;


let hightScore = localStorage.getItem('highScore') || 0;
let score = 0;
let time = `00:00:00`;

 highScoreElement.innerText = hightScore;

// Grid setup
const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);

let intervalId = null;


let timerIntervalId = null;



let food = {
  x: Math.floor(Math.random() * rows),
  y: Math.floor(Math.random() * cols),
};

const blocks = [];
let snake = [
  {
    x: 1,
    y: 3,
  },
];

let direction = "down";

// for (let i = 0; i < rows * cols; i++) {
//     const block = document.createElement('div')
//     block.classList.add('block')
//     board.appendChild(block)
// }

// Create board
for (let row = 0; row < rows; row++) {
  for (let col = 0; col < cols; col++) {
    const block = document.createElement("div");
    block.classList.add("block");
    board.appendChild(block);
    // block.innerHTML = `${row}-${col}`;
    blocks[`${row}-${col}`] = block;
  }
}


// Render game
function render() {
  let head = null;
  blocks[`${food.x}-${food.y}`].classList.add("food");

  if (direction === "left") {
    head = { x: snake[0].x, y: snake[0].y - 1 };
  } else if (direction === "right") {
    head = { x: snake[0].x, y: snake[0].y + 1 };
  } else if (direction === "down") {
    head = { x: snake[0].x + 1, y: snake[0].y };
  } else if (direction === "up") {
    head = { x: snake[0].x - 1, y: snake[0].y };
  }

//   Self collision
if (snake.slice(0, -1).some(segment => segment.x === head.x && segment.y === head.y)) {
    clearInterval(intervalId);

    modal.style.display = 'flex';
    startGameModal.style.display = 'none';
    gameOverModal.style.display = 'block'; 

    return;
}

  // Wall collision
  if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
    // alert("Game Over");
    clearInterval(intervalId);

    // show game over modal
    modal.style.display = 'flex';
    startGameModal.style.display = 'none';
    gameOverModal.style.display = 'block'; 

    return;
  }
  // food consume logic
  if (head.x === food.x && head.y === food.y) {
    blocks[`${food.x}-${food.y}`].classList.remove("food");
    food = {
      x: Math.floor(Math.random() * rows),
      y: Math.floor(Math.random() * cols),
    };
    // foodconsume with the help of snake unshipt head and add food to snake
    blocks[`${food.x}-${food.y}`].classList.add("food");
    snake.unshift(head)

    score += 10;
    scoreElement.innerText = score;

    if(score > hightScore) {
        hightScore = score;
        localStorage.setItem('highScore', hightScore.toString());
        
       
    }
  }

  snake.forEach((segment) => {
    const block = blocks[`${segment.x}-${segment.y}`];
    if (block) {
      block.classList.remove("fill");
    }
  });
  snake.unshift(head);
  snake.pop();

  snake.forEach((segment) => {
    const block = blocks[`${segment.x}-${segment.y}`];

    if (block) {
      block.classList.add("fill");
    }
  });
}

// intervalId = setInterval(() => {
//   render();
// }, 400);



// satrt game on click of start button and stop the modal
startButton.addEventListener('click', () => {
  modal.style.display = 'none';
  intervalId = setInterval(() => {render()}, 400);

  // timerIntervalId
  timerIntervalId = setInterval(() => {
    let [hours, minutes, seconds] = time.split(':').map(Number);
   if(seconds == 59) {
    minutes += 1;
    seconds = 0;
   } else if(minutes == 59) {
    hours += 1;
    minutes = 0;
   } else {
    seconds += 1;
   }
    time = `${hours}:${minutes}:${seconds}`;
    timeElement.innerText = time;
  }, 1000);

});


restartButton.addEventListener('click', restartGame);



//restart game on click of restart button and stop the modal function and reset the game

function restartGame() {
  // reset the game state

  blocks[`${food.x}-${food.y}`].classList.remove("food");
  snake.forEach((segment) => {
    const block = blocks[`${segment.x}-${segment.y}`];
    if (block) {
      block.classList.remove("fill");
    }
  });


  // score reset
  score = 0;
  time = `00:00:00`;
  
  scoreElement.innerText = score;
  // timeElement.innerText = time;
  highScoreElement.innerText = hightScore;


  modal.style.display = 'none';
  direction = "down";
  snake = [
    {
      x: 1, y: 3,
    },
  ];
   food = {
    x: Math.floor(Math.random() * rows),
    y: Math.floor(Math.random() * cols),
  };
  intervalId = setInterval(() => {render()}, 400);
  
}


// Controls
addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp" && direction !== "down") {
    direction = "up";
  } else if (e.key === "ArrowDown" && direction !== "up") {
    direction = "down";
  } else if (e.key === "ArrowLeft" && direction !== "right") {
    direction = "left";
  } else if (e.key === "ArrowRight" && direction !== "left") {
    direction = "right";
  }
});
