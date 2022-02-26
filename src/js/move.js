import {GAME_STATES, SCREENHEIGHT, SCREENWIDH, consts} from './consts.js'

export function moveStick(stick, stickPos, consts) {
    if (stickPos.moving === true) {
        if (stickPos.direction === 1) {
            ///move right
            if (stickPos.x + consts.stickWidth >= SCREENWIDH ){
                return
            }
            stickPos.x += consts.stickSpeed;
            stick.style.left = `${stickPos.x}px`;
        } else if (stickPos.direction === 2) {
            ///move left
            if (stickPos.x <= 0) {
                return 
            }
            stickPos.x -= consts.stickSpeed;
            stick.style.left = `${stickPos.x}px`;
        }
    }
}

export function moveBall(ballState, stickPos) {
    
    if (ballState.x + consts.ballWidth >= SCREENWIDH) {
        ballState.dx = -ballState.dx;
    }

    if (ballState.x <= 0) {
        ballState.dx = -ballState.dx;
    }

    if (ballState.y <= 0) {
        ballState.dy = -ballState.dy;
    }

    if (ballState.y + consts.ballHeight >= SCREENHEIGHT) {
        updateLives()
    }

    let stickLeft = stickPos.x;
    let stickRight = stickPos.x + consts.stickWidth;
    let stickBottom = stickPos.y + consts.stickHeight;
    let stickTop = stickPos.y;

    let ballLeft = ballState.x;
    let ballRight = ballState.x + consts.ballWidth;
    let ballBottom = ballState.y + consts.ballHeight;
    

    if (ballBottom < stickBottom) {
        if (ballBottom >= stickPos.y && (ballRight >= stickLeft && ballLeft <= stickRight)) {
            ballState.dy = -consts.ballSpeed;
            if (stickPos.moving === true) {
                if (stickPos.direction == 1) {
                    if (ballState.dx < 0) {
                        ballState.dx *= -1;
                    }
                } 
                if (stickPos.direction == 2) {
                    if (ballState.dx > 0) {
                        ballState.dx *= 1
                    }
                }
            }
        }
    }

    ballState.x += ballState.dx;
    ballState.y += ballState.dy;

    ball.style.left = ballState.x + 'px'
    ball.style.top = ballState.y + 'px'
}
