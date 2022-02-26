import {GAME_STATES, SCREENHEIGHT, SCREENWIDH, consts} from './consts.js'
import {addBricks, setBallInits, setStickInits,  resetBallState, showInitialPage, resetStickState} from './utils.js'
import {moveStick, moveBall} from './move.js'

var screen = document.getElementById('screen')
var ball = document.getElementById('ball')
var stick = document.getElementById('stick')
var milliseconds = 0;
var seconds = 0;
var minutes = 0;
var fps = 1000/70;
var startTime;
var bricks = [];
var frame = 1000/60;
var scoreElem = document.getElementById("score");
var score = 0;
var livesElem = document.getElementById("lives")
var lives = 3;
var countDown = document.getElementById("over");



var stickPos = {
    x: 100,
    y: 550,
    moving: false,
    direction: 1, //1 - right 2 - left
}


var ballState = {
    speed: 5,
    x: 100,
    y: 250,
    dx: 5,
    dy: 5
}

var GAMESTATE = GAME_STATES.INIT



function startTimer() {
    startTime = Date.now();
    createGameLoop();
}

function createGameLoop(timeStamp) {
    if (GAMESTATE == GAME_STATES.PLAYING) {

        consts.gameLoop = window.requestAnimationFrame(createGameLoop)
        
        if (Date.now() - startTime > fps) {
            move();
            updateTimer();
            startTime = Date.now();
        }
    } 
    
}

function timerStop() {
    clearInterval(consts.gameLoop)
}

const initGame = () => {
    milliseconds = 0
    minutes = 0
    seconds = 0
    document.getElementById("timer").innerHTML = "00:00"
    score = 0
    scoreElem.innerHTML = score 
    GAMESTATE = GAME_STATES.INIT
}

function removeAllBricks() {
    for (var i = 0; i < bricks.length; i++) {
        var b = document.querySelector("#" + bricks[i].id);
        screen.removeChild(b);
    }
    bricks = [];
}

window.startGame = function startGame() {
    if(GAMESTATE != GAME_STATES.INIT) return;
    
    document.getElementById('initialPage').style.visibility = 'hidden';
    scoreElem.innerHTML = 0;
    livesElem.innerHTML = 3;
    lives = 3;
    console.log("STATR");
    GAMESTATE = GAME_STATES.PLAYING;
    addBricks(bricks, consts, screen);
    setBallInits(ball, consts, ballState);
    setStickInits(stick, consts, stickPos)
    initListeners();
    startTimer();
}

window.resetGame = function resetGame() {
    window.removeEventListener('keydown', handleKeyDown)
    window.removeEventListener('keyup', handleKeyUp)
    removeAllBricks()
    timerStop()
    resetBallState(ballState, consts);
    resetStickState(stickPos, consts);
    initGame();
    showInitialPage();
    console.log("GAME RESETTED")
}

window.continueGame = function continueGame() {
    document.getElementById('paused').style.visibility = 'hidden';
    GAMESTATE = GAME_STATES.PLAYING
    startTimer()
}

function updateTimer() {
    milliseconds += frame;
    if (milliseconds >= 1000) {
        milliseconds = 0
        seconds += 1;
        if(seconds == 60){
            minutes++;
            seconds = 0;
        }
        
        
        var string
        if(minutes<10){
            string = "0" + minutes + ":"
        }else{
            string = minutes + ":"
        }
        if(seconds<10){
            string = string + "0" + seconds
        }else{
            string = string + seconds
        }
        document.getElementById("timer").innerHTML = string;
    } 
}

function move(){
    if (GAMESTATE == GAME_STATES.PLAYING) {
        moveStick(stick, stickPos, consts)
        moveBall(ballState, stickPos)
        console.log(GAMESTATE)
        checkStrike()
    } else {
        return
    }
}





window.addEventListener('load', (event) => {
    showPlayers()
});


function showGameOver(){
    var form = document.getElementById("form")
    var scoreHolder = document.querySelector(".scoreHolder")
    showPlayers()
    
    document.getElementById('score-rep').innerHTML = "YOUR SCORE IS " + score;
    scoreHolder.value = score;
    form.style.display="flex"
}


window.showPlayers = function showPlayers(){
    var jsonFile = httpGet("http://localhost:4001/get/scores")
    if(jsonFile != null && jsonFile!=""){
        var array = JSON.parse(jsonFile)
        if (array == null) {
            return
        }
        var string = "<tr><th>Name</th><th>Score</th></tr>";

        for(var i = 0; i < array.length ; i++){
            string = string + "<tr><td>" + array[i].username + "</td><td>" + array[i].score  + "</td></tr>"
        }
        var table = document.querySelector("table")
        table.innerHTML = string
    }
}

function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

window.updateLives = function updateLives(){
    cancelAnimationFrame(consts.gameLoop)
    GAMESTATE = GAME_STATES.COUNTING;
    lives--
    livesElem.innerHTML = lives;
    if(lives<=0){
        GAMESTATE = GAME_STATES.GAMEOVER
        showGameOver()
        return
    }
    createBall()
    timerStop()
    
    countDown.style.display = "flex"
    var passed = 1
    var delay = setInterval(()=>{
        passed++;
        var countDown = document.getElementById("over");
        if (passed == 4) {
            passed = 1;
            countDown.innerHTML = passed
            countDown.style.display = "none"
            clearInterval(delay)
            GAMESTATE = GAME_STATES.PLAYING
            startTimer()
        }
        countDown.innerHTML = passed;
    }, 1000)
    
    
}


function createBall(){
    ball.style.width = consts.ballWidth + 'px'
    ball.style.height = consts.ballHeight + 'px'
    ball.style.left = stickPos.x + 20 + 'px'
    ball.style.top = stickPos.y - 200 + 'px'
    ballState.x = stickPos.x + 20
    ballState.y = stickPos.y - 200
}
function handleKeyDown(e) {
    switch(e.code) {
        case 'KeyD':
            //move right
            stickPos.moving = true;
            stickPos.direction = 1;
            break;fe571221b8c3b483eb271853d6231d10182b1928
        case 'KeyA':
            //move left
            stickPos.moving = true;
            stickPos.direction = 2;
            break;
        case 'KeyP':
            if (GAMESTATE == GAME_STATES.PAUSED) {
                document.getElementById('paused').style.visibility = 'hidden';
                GAMESTATE = GAME_STATES.PLAYING
                continueGame();
            } else if (GAMESTATE == GAME_STATES.PLAYING) {
                document.getElementById('paused').style.visibility = 'visible';
                GAMESTATE = GAME_STATES.PAUSED
            }
            break;
        default:
            break;
    }
}

function handleKeyUp(e) {
    switch(e.code) {
        case 'KeyD':
            stickPos.moving = false;
            break;
        case 'KeyA':
            stickPos.moving = false;
            break;
        default:
            break;
    }
}

function initListeners() {
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)
}


function checkStrike() {
    if (bricks.length == 0) {
        cancelAnimationFrame(consts.gameLoop)
        showGameOver()
        timerStop()
        return
    }
    for (var i=0;i<bricks.length;i++) {
        var ballBottom = ballState.y + consts.ballHeight;
        var ballRight = ballState.x + consts.ballWidth;
        var brickBottom = bricks[i].top + consts.brickHeight;
        var brickRight = bricks[i].left + consts.brickWidth;
        
        if (ballRight >= bricks[i].left && ballState.x <= brickRight && ballBottom >= bricks[i].top && ballState.y <= brickBottom) {
            if (ballRight > bricks[i].left && ballState.x < brickRight && (ballBottom >= bricks[i].top && ballBottom <= bricks[i].top + 2 || ballState.y <= brickBottom && ballState.y >= brickBottom - 2)) {
                ballState.dy *= -1;
            }
            if(ballBottom > bricks[i].top && ballState.y < brickBottom && (ballRight >= bricks[i].left && ballRight <= bricks[i].left+2 || ballState.x <= brickRight && ballState.x >= brickRight-2)){
                ballState.dx *= -1;
            }


            var b = document.querySelector("#" + bricks[i].id);
            screen.removeChild(b);
            bricks.splice(i,1)
            updateScore()
        }
    }
}

function updateScore(){
    score++;
    scoreElem.innerHTML = score 
}