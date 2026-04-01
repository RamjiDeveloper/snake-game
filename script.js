const board = document.querySelector(".board");

const blockHeight = 50;
const blockWidth = 50;

const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);

let intervalId = null;

let food = {
  x: Math.floor(Math.random() * rows),
  y: Math.floor(Math.random() * cols),
};

const blocks = [];
const snake = [
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

for (let row = 0; row < rows; row++) {
  for (let col = 0; col < cols; col++) {
    const block = document.createElement("div");
    block.classList.add("block");
    board.appendChild(block);
    block.innerHTML = `${row}-${col}`;
    blocks[`${row}-${col}`] = block;
  }
}

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
    alert("Game Over");
    clearInterval(intervalId);
  }

  if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
    alert("Game Over");
    clearInterval(intervalId);
  }
  if (head.x === food.x && head.y === food.y) {
    blocks[`${food.x}-${food.y}`].classList.remove("food");
    food = {
      x: Math.floor(Math.random() * rows),
      y: Math.floor(Math.random() * cols),
    };
    // foodconsume with the help of snake unshipt head and add food to snake
    blocks[`${food.x}-${food.y}`].classList.add("food");
    snake.unshift(head)
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

intervalId = setInterval(() => {
  render();
}, 500);

// ArrowUp
// script.js:77 ArrowRight
// script.js:77 ArrowDown
// script.js:77 ArrowLeft
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
