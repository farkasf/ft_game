let lastUpdateTime = 0;
let predictedBallPos = { x: 0, z: 0 };

// Control the AI paddle movement
function moveAI(paddle2, ball, keyState, paddleSpeed, PADDLE_WIDTH, FIELD_WIDTH) {
    // AI can only refresh its view once per second
    const currentTime = Date.now();
    if (currentTime - lastUpdateTime >= 1000) {
        lastUpdateTime = currentTime;

        // Get the current position and velocity of the ball
        let ballPos = ball.position;
        let ballVelocity = ball.$velocity;
        // Calculate how long it takes the ball to reach AI paddle
        let timeToReachPaddle = Math.abs((paddle2.position.z - ballPos.z) / ballVelocity.z);
        // Predict future x-position of the ball when it reaches paddle
        let futurePosX = ballPos.x + ballVelocity.x * timeToReachPaddle;
        // Check if the predicted position is within field boundary
        let fieldHalfWidth = FIELD_WIDTH / 2;

        // Adjust the prediction if the ball will bounce off the side of the field
        while (Math.abs(futurePosX) > fieldHalfWidth) {
            // If the ball will bounce off right/left wall, check how the ball returns back within field
            if (futurePosX > fieldHalfWidth) {
                futurePosX = fieldHalfWidth - (futurePosX - fieldHalfWidth);
            } else if (futurePosX < -fieldHalfWidth) {
                futurePosX = -fieldHalfWidth - (futurePosX + fieldHalfWidth);
            }
        }

        // Add a random offset of -100 to 100 units to make the AI paddle less accurate
        let offset = (Math.random() - 0.5) * PADDLE_WIDTH;
        predictedBallPos.x = futurePosX + offset;
    }

    // Define a limit how far AI paddle needs to move from the current position
    // Avoids twitching of the paddle as it adjusts its position
    let cpuPos = paddle2.position;
    const movementLimit = PADDLE_WIDTH / 4;
    // Gradually move the paddle towards the predicted position
    const smootherMovement = 0.05;
    let delta = predictedBallPos.x - cpuPos.x;
    if (Math.abs(delta) > movementLimit) {
        AI_simulatedKeypress(keyState, delta); // trigger keypress
        cpuPos.x += delta * smootherMovement;
    }

    // Ensure the paddle stays within the field
    const halfPaddleWidth = PADDLE_WIDTH / 2;
    const halfFieldWidth = FIELD_WIDTH / 2;
    paddle2.position.x = Math.min(halfFieldWidth - halfPaddleWidth, Math.max(-halfFieldWidth + halfPaddleWidth, paddle2.position.x));
}

// Simulated key press (100 milliseconds at a time)
function AI_simulatedKeypress(keyState, delta) {
    keyState.ArrowUp = false;
    keyState.ArrowDown = false;

    // Simulate key presses based on the target position
    if (delta > 0) {
        keyState.ArrowDown = true;
    } else if (delta < 0) {
        keyState.ArrowUp = true;
    }
    setTimeout(() => {
        keyState.ArrowUp = false;
        keyState.ArrowDown = false;
    }, 100);
}
