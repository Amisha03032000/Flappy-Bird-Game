let board;
let boardHeight = 840;
let boardWidth = 560;

let context;

//bird setuo
let birdHeight = 40;
let birdWidth = 40;
let birdY = boardHeight /2;
let birdX = boardWidth / 7;

let birdImg;

//Pipe setup
let pipeArray = [];
let pipeWidth = 80;
let pipeHeight = 600;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

//pipe velocity
let velocityX = -2;

//bird velovity in upward direction
let velocityY = 0;

//create a gravity
let gravity = 0.4;

let gameOver= false;
let score =0;;

//lets create a bird object here
let bird = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight
}

window.onload = function() {
    board = document.getElementById("canvas");
    board.height = boardHeight;
    board.width = boardWidth;

    context = board.getContext("2d");

    //how to draw on canvas ie how we draw a bird on canvas
    // context.fillStyle = "black";
    // context.fillRect(bird.x, bird.y, bird.width, bird.height);

    //to draw a image
    birdImg= new Image();
    birdImg.src = "./b.png";

    birdImg.onload = function(){
    //but just doing this wont pop up the image
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }

    topPipeImg= new Image()
    topPipeImg.src = "./toppipe.png";

    bottomPipeImg= new Image()
    bottomPipeImg.src = "./bottom.png";

   
    requestAnimationFrame(update);
    setInterval(placePipes, 1500);

    document.addEventListener("keydown", moveBird);
}

//updating the frame over n over again
function update(){
    requestAnimationFrame(update);
    if(gameOver){
        return ;
    }
    //everytime we update the framem we also want to clear the previous frame
    context.clearRect(0, 0, board.width, board.height);

    if(bird.y > boardHeight){
        gameOver = true;
    }
    //also draw the bird image 
    velocityY += gravity;
    // bird.y += velocityY;
    bird.y = Math.max(bird.y + velocityY, 0);        
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    //also update pipes
    for(let i=0; i<pipeArray.length; i++){
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);
        
        if(!pipe.passed && bird.x > pipe.x + pipe.width ){
            score += 0.5;
            pipe.passed=true;
        }

        if(detectCollision(bird, pipe)){
            gameOver=true;
        }
    
    }

    //clear pipes
    while(pipeArray.length > 0 && pipeArray[0].x < 0-pipeWidth){
        pipeArray.shift();
    }

    context.fillStyle ="white";
    context.font ="45px sans-serif";
    context.fillText(score, 5, 45);

    if(gameOver){
        context.fillText("GAME OVER", 5, 90);
    }
}

function placePipes(){
    if(gameOver){
        return;
    }

    let randomPipeY = pipeY - pipeHeight/4 - Math.random() * (pipeHeight/2);
    let openingSpace = pipeHeight/4;

    let topPipe ={
        img : topPipeImg,
        x : pipeX,
        y: randomPipeY,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArray.push(topPipe);

    let bottomPipe = {
        img : bottomPipeImg,
        x : pipeX,
        y : randomPipeY + pipeHeight + openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false

    }
    pipeArray.push(bottomPipe);
}


function moveBird(e){
    if(e.code =="Space" || e.code == "ArrowUp")
    {
        velocityY = -6;

        if(gameOver){
            bird.y = birdY;
            pipeArray =[]
            score =0;
            gameOver=false;
        }
    }
    
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
    
}


