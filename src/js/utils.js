export const addBricks = (bricks, consts, screen) => {
    let initTop = 10;
    let initLeft = 10;
    
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 10; j++) {
            var brick = document.createElement('div')
            brick.classList.add('brick')
            brick.style.height = consts.brickHeight + "px";
            brick.style.width = consts.brickWidth + "px";

            brick.style.top = initTop + 'px'
            brick.style.left = initLeft + 'px'
            brick.setAttribute("id", "id" + i + j);
            let objBrick = {
                id: "id" + i + j,
                left : initLeft,
                top : initTop
            }
            screen.appendChild(brick)
            initLeft += 55  
            bricks.push(objBrick)
        }
        initLeft = 10
        initTop += 25
    }
}


export const setBallInits = (ball, consts, ballState) => {
    ball.style.width = consts.ballWidth + 'px'
    ball.style.height = consts.ballHeight + 'px'
    ball.style.left = ballState.x + 'px'
    ball.style.top = ballState.y + 'px'
}

export const setStickInits = (stick, consts, stickPos) => {
    stick.style.left = stickPos.x + 'px'
    stick.style.top = stickPos.y + 'px'
    stick.style.height = consts.stickHeight + 'px'
    stick.style.width = consts.stickWidth + 'px'
}


export const resetBallState = (ballState, consts) => {
    ballState.x = consts.ballInitialX
    ballState.y = consts.ballInitialY
    ballState.dx = consts.ballInitDx
    ballState.dy = consts.ballInitDy
} 

export function showInitialPage() {
    document.getElementById('initialPage').style.visibility = 'visible';
    document.getElementById('paused').style.visibility = 'hidden';
}

export const resetStickState = (stickPos, consts) => {
    stickPos.x = consts.stickInitX
    stickPos.y = consts.stickInitY
}