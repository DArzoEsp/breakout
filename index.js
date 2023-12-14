const grid = document.querySelector('.grid');
const scoreDisplay = document.querySelector('.score');
const blockWidth = 100;
const blockHeight = 20;
const boardWidth = 560;
const boardHeight = 300;
const ballDiameter = 20;
const topBoarder = 100;
let score = 0;
let timerId;
let xDirection = -2;
let yDirection = 2;

// user start position
const userStart = [230, 10];
let currentPosition = userStart;

// ball start position
const ballStart = [270, 40];
let currentBallPosition = ballStart;


// create Block class
class Block { 
    constructor(xAxis, yAxis) {
        this.bottomLeft = [xAxis, yAxis];
        this.bottomRight = [xAxis + blockWidth, yAxis];
        this.topLeft = [xAxis, yAxis + blockHeight];
        this.topRight = [xAxis + blockWidth, yAxis + blockHeight];
    }
}

// all my blocks
const blocks = [
    new Block(10, 270),
    new Block(120, 270),
    new Block(230, 270),
    new Block(340, 270),
    new Block(450, 270),
    new Block(10, 240),
    new Block(120, 240),
    new Block(230, 240),
    new Block(340, 240),
    new Block(450, 240),
    new Block(10, 210),
    new Block(120, 210),
    new Block(230, 210),
    new Block(340, 210),
    new Block(450, 210),
]

// draws blocks
function addBlock() {

    for(let i = 0; i < blocks.length; i++) {
        const block = document.createElement('div'); // creates div 

        block.classList.add('block'); // adds the class of block into this and we will end up creating 15 blocks

        block.style.left = blocks[i].bottomLeft[0] + 'px'; // 100px from the left
        block.style.bottom = blocks[i].bottomLeft[1] + 'px'; // 50px from the bottom

        grid.appendChild(block); // inserts it into the container of grid --- aka becomes child of the grid element
    }
}

// draws user 
function drawUser() {
    user.style.left = currentPosition[0] + 'px';
    user.style.bottom = currentPosition[1] + 'px';
}

// draws ball
function drawBall() {
    ball.style.left = currentBallPosition[0] + 'px';
    ball.style.bottom = currentBallPosition[1] + 'px';
}

addBlock();

// add user
const user = document.createElement('div');
user.classList.add('user');
drawUser();
grid.appendChild(user);

// add ball
const ball = document.createElement('div');
ball.classList.add('ball');
drawBall();
grid.appendChild(ball);

// move user
function moveUser(e) {
    switch(e.key) {
        case 'ArrowLeft':
            if (currentPosition[0] > 0) {    
                currentPosition[0] -= 10;
                drawUser();
            }
            break;
        case 'ArrowRight':
            if(currentPosition[0] < boardWidth - blockWidth) {
                currentPosition[0] += 10;
                drawUser();
            }
            break;
        case 'ArrowDown':
            if(currentPosition[1] > 0) {
                currentPosition[1] -= 10;
                drawUser();
            }
            break;
        case 'ArrowUp':
            if(currentPosition[1] < topBoarder - blockHeight) {
                currentPosition[1] += 10;
                drawUser();
            }
            break;
    }
}

// move ball
function moveBall() {
    currentBallPosition[0] += xDirection;
    currentBallPosition[1] += yDirection;
    drawBall();
    checkForCollisions()
}

document.addEventListener('keydown', moveUser);

timerId = setInterval(moveBall, 30);

function changeDirection() {
    if(xDirection === 2 && yDirection === 2) {
        yDirection = -2;
        return;
    } else if (xDirection === 2 && yDirection === -2) {
        xDirection = -2;
        return;
    } else if (xDirection === -2 && yDirection === -2) {
        yDirection = 2;
        return;
    } else if (xDirection === -2 && yDirection === 2) {
        xDirection = 2;
        return;
    }
}

// check for collisions
function checkForCollisions() {
    // check if hits block
    for (let i = 0; i < blocks.length; i++) {
        if(
            (currentBallPosition[0] > blocks[i].bottomLeft[0] && currentBallPosition[0] < blocks[i].bottomRight[0]) &&
            ((currentBallPosition[1] + ballDiameter) > blocks[i].bottomLeft[1] && currentBallPosition[1] < blocks[i].topLeft[1])
        ) {
            const allBlocks = Array.from(document.querySelectorAll('.block'));
            allBlocks[i].classList.remove('block')
            allBlocks.splice(i, 1);
            changeDirection();
            score++;
            scoreDisplay.innerHTML = score;

            // check for win
            if(blocks.length === 0) {
                scoreDisplay.innerHTML = 'you win!';
                clearInterval(timerId);
                document.removeEventListener('keydown', moveUser)
            }
        }
    }

    // check for wall collisions
    if(currentBallPosition[0] >= (boardWidth - ballDiameter) ||
       currentBallPosition[1] >= (boardHeight - ballDiameter) ||
       currentBallPosition[0] <= 0 ) {
        changeDirection();
    }

    // check for user collision
    if(
        (currentBallPosition[0] > currentPosition[0] && currentBallPosition[0] < currentPosition[0] + blockWidth) &&
        (currentBallPosition[1] > currentPosition[1] && currentBallPosition[1] < currentPosition[1] + blockHeight) 
    ) {
        changeDirection();
    }

    // check for game over
    if(currentBallPosition[1] <= 0) {
        clearInterval(timerId);
        scoreDisplay.innerHTML = 'game over';
        document.removeEventListener('keydown', moveUser);
    }

}