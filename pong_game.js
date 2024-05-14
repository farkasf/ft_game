console.clear();
let gameMode = 1;
let running;

let keyState = {
    keyW: false,
    keyS: false,
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
};

let ballSpeed = 25;
const paddleSpeed = 10;

function startGameFunction(window, document, THREE) {
    let WIDTH = window.innerWidth - (0.05 * window.innerWidth),
        HEIGHT = window.innerHeight - (0.1 * window.innerHeight),
        // define the set-up for 3D camera        
        BALL_MAX_SPEED = 30,
        BALL_RADIUS = 20,
        PADDLE_WIDTH = 200,
        PADDLE_HEIGHT = 30,
        VIEW_ANGLE = 45,
        ASPECT = WIDTH / HEIGHT,
        NEAR = 0.1,
        FAR = 10000,
        FIELD_WIDTH = 1200,
        FIELD_LENGTH = 3000,

        //scoreBoard = document.getElementById('scoreBoard'),
		scoreBoardPlayer1 = document.getElementById('player1Score'),
		scoreBoardPlayer2 = document.getElementById('player2Score'),


        container, renderer, camera, mainLight,
        scene, ball, paddle1, paddle2, field,
        score = {
            player1: 0,
            player2: 0
        };

    if(gameMode === 2){
        ballSpeed = 20
        BALL_MAX_SPEED = 25
        BALL_RADIUS = 40
        PADDLE_WIDTH = 400
        PADDLE_HEIGHT = 60
    }

    // choose a random direction along Z-axis to movre the ball
    function startBall() {
        let direction = Math.random() > 0.5 ? -1 : 1;
        ball.$velocity = {
            x: 0,
            z: direction * ballSpeed
        };
        ball.$stopped = false;
    }

    function movePaddleTwo() {
        if (gameMode === 1) {
            /* vs AI: Paddle2 tries to align itself with ball position on x axis
            and maintainss a 100 unit offset. If paddle2 is more than 100 units
            to the right of the ball, it moves left by 6 units or by difference 
            between its position and the ball - whichever is smaller.
            Same applies for the movement to the right. */
            let ballPos = ball.position,
                cpuPos = paddle2.position;

            if (cpuPos.x - 100 > ballPos.x) {
                cpuPos.x -= Math.min(cpuPos.x - ballPos.x, 6);
            } else if (cpuPos.x - 100 < ballPos.x) {
                cpuPos.x += Math.min(ballPos.x - cpuPos.x, 6);
            }
        } else {
            /* Player vs player: move up or down by paddleSpeed units */
            switch (true) {
                case keyState.ArrowUp:
                    paddle2.position.x -= paddleSpeed;
                    break;
                case keyState.ArrowDown:
                    paddle2.position.x += paddleSpeed;
                    break;
            }
            // Constrain the paddles to stay within field
            const halfPaddleWidth = PADDLE_WIDTH / 2;
            const halfFieldWidth = FIELD_WIDTH / 2;
            paddle2.position.x = Math.min(halfFieldWidth - halfPaddleWidth, Math.max(-halfFieldWidth + halfPaddleWidth, paddle2.position.x));
        }


    }

    function moveBall() {
        if (!ball.$velocity) {
            startBall();
        }

        if (ball.$stopped) {
            return;
        }

        updateBallPosition();

        if (hitsSideField()) {
            ball.$velocity.x *= -1;
        }

        if (hitsPaddle1()) {
            hitBallBack(paddle1);
        }

        if (hitsPaddle2()) {
            hitBallBack(paddle2);
        }

        if (missesPaddle1()) {
            addScore('player2');
        }

        if (missesPaddle2()) {
            addScore('player1');
        }
    }

    // Check if the ball has passed the depth position of the paddle
    function missesPaddle1() {
        return ball.position.z > paddle1.position.z + 100;
    }

    function missesPaddle2() {
        return ball.position.z < paddle2.position.z - 100;
    }

    // move the ball based on its velocity frame by frame
    function updateBallPosition() {
        let ballPos = ball.position;
        ballPos.x += ball.$velocity.x;
        ballPos.z += ball.$velocity.z;
    }

    // determine position of the ball and field, calculate
    // if left or right edge of the ball has touched the side, return true or false
    function hitsSideField() {
        let ballX = ball.position.x,
            halfFieldWidth = FIELD_WIDTH / 2;
        return ballX - BALL_RADIUS < -halfFieldWidth || ballX + BALL_RADIUS > halfFieldWidth;
    }

    // calculate new horizontal direction after the ball is hit
    // change the ball forward direction
    function hitBallBack(paddle) {
        const relativeHitPosition = (ball.position.x - paddle.position.x) / (PADDLE_WIDTH / 2);
        const newHorizontalVelocity = ball.$velocity.x + relativeHitPosition * BALL_MAX_SPEED;
        ball.$velocity.x = Math.max(-BALL_MAX_SPEED, Math.min(BALL_MAX_SPEED, newHorizontalVelocity));
        ball.$velocity.z *= -1;
    }

    // check if the front edge of the ball is at or passed the paddle position
    // AND check if the ball is aligned with the paddle horizontally
    function hitsPaddle1() {
        return ball.position.z + BALL_RADIUS >= paddle1.position.z &&
            isBallAlignedWithPaddle(paddle1);
    }

    function hitsPaddle2() {
        return ball.position.z - BALL_RADIUS <= paddle2.position.z &&
            isBallAlignedWithPaddle(paddle2);
    }

    // check horizontal alignment, if the ball has made contact with the paddle
    // ball position must be between left and right edges of the paddle
    function isBallAlignedWithPaddle(paddle) {
        let halfPaddleWidth = PADDLE_WIDTH / 2,
            paddleX = paddle.position.x,
            ballX = ball.position.x;
        return Math.abs(ballX - paddleX) <= halfPaddleWidth + BALL_RADIUS;
    }

    function handleWinningCondition() {
        if (score.player1 === 3) {
            stopGame();
            renderWinningScreen('Player 1');
        } else if (score.player2 === 3) {
            stopGame();
            renderWinningScreen('Player 2');
        }
    }

    // Render winning message and an image 
    function renderWinningScreen(winningPlayer) {
        const mainContainer = document.getElementById('content');
        const overlay = document.createElement('div');
        overlay.className = 'overlay-fullscreen';
        // Winning screen within the overlay
        const winningScreen = document.createElement('div');
        winningScreen.className = 'winning-screen';
        // Winning message
        const message = document.createElement('div');
        message.className = 'winning-message';
        message.textContent = `${winningPlayer} won!`;
        winningScreen.appendChild(message);

		const quitMessage = document.createElement('div');
		quitMessage.className = 'text-shadow';
		quitMessage.textContent = "Press 'q' to quit";
		winningScreen.appendChild(quitMessage);

        overlay.appendChild(winningScreen);
        mainContainer.appendChild(overlay);
    }
    
    function addScore(playerName) {
        addPoint(playerName);
        updateScoreBoard();
        stopBall();
        setTimeout(reset, 2000);
        handleWinningCondition();
    }

    function updateScoreBoard() {
		scoreBoardPlayer1.innerHTML = score.player1;
		scoreBoardPlayer2.innerHTML = score.player2;
        //scoreBoard.innerHTML = 'Player 1: ' + score.player1 + ' Player 2: ' + score.player2;
    }

    function stopBall() {
        ball.$stopped = true;
    }

    function addPoint(playerName) {
        score[playerName]++;
        console.log(score);
    }

    function startRender() {
        running = true;
        render();
    }

    function stopRender() {
        running = false;
    }

    function stopGame() {
        stopRender();
        scene.clear();
        renderer.renderLists.dispose();
    }


    function render() {
        if (running) {
            requestAnimationFrame(render.bind(this));

            moveBall();
            movePaddleTwo();
            movePaddleOne();
            renderer.render(scene, camera);
        }
    }

    function reset() {
        ball.position.set(0, 0, 0);
        ball.$velocity = null;
    }

    // handle aspect ratio of screen size when the browser window changs
    function onWindowResize() {
        WIDTH = (window.innerWidth - (0.05 * window.innerWidth)) / 2;
        HEIGHT = (window.innerHeight - (0.1 * window.innerHeight)) / 2;

        camera.aspect = WIDTH / HEIGHT;
        camera.updateProjectionMatrix();

        renderer.setSize(WIDTH, HEIGHT);
    }

    function init() {
        // display game in the container
        initScene();
        initCamera();
        initField();
        initBackgroundPlanes();
        initPaddles();
        initLighting();
        updateScoreBoard();
        startRender();
    
        // Initialize resize
        onWindowResize();
        window.addEventListener('resize', onWindowResize.bind(this));
    }
    
        //initialize the scene background and ball
        function initScene() {
            const textureLoader = new THREE.TextureLoader();
            const starsTexture = textureLoader.load('/assets/img/stars.png');
        
            container = document.getElementById('container');
        
            renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setSize(WIDTH, HEIGHT);
            // background color
            renderer.setClearColor(0x000000);
            container.appendChild(renderer.domElement);
        
            scene = new THREE.Scene();
        
            // ball specs
            const ballGeometry = new THREE.SphereGeometry(BALL_RADIUS, 16, 16);
            const ballMaterial = new THREE.MeshStandardMaterial({ color: 0xF7F7F7 });
            ball = new THREE.Mesh(ballGeometry, ballMaterial);
            scene.add(ball);
        }
    
        // camera settings
        function initCamera() {
            if (gameMode === 1) {
                // 1 vs AI camera specs
                camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
                camera.position.set(0, 100, FIELD_LENGTH / 2 + 700);
                camera.lookAt(0, 0, 0);
            } else {
                // player vs player camera specs
                camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
                camera.position.set(FIELD_WIDTH, FIELD_LENGTH * 0.60, 0);
                camera.lookAt(new THREE.Vector3(0, 0, 0));
            }
        
            scene.add(camera);
        }
        
        // add a fundament to the field
        function initField() {
            const fieldGeometry = new THREE.BoxGeometry(FIELD_WIDTH, 5, FIELD_LENGTH);
            const fieldMaterial = new THREE.MeshStandardMaterial({ color: 0x332E3C });
            field = new THREE.Mesh(fieldGeometry, fieldMaterial);
            field.position.set(0, -50, 0);
            scene.add(field);
        
            // Create edges geometry
            const edgesGeometry = new THREE.BoxGeometry(FIELD_WIDTH + 10, 10, FIELD_LENGTH + 10);
            const edgesMaterial = new THREE.MeshBasicMaterial({ color: 0x22162B, emissive: 0xFFFFFF });
            const edges = new THREE.Mesh(edgesGeometry, edgesMaterial);
            edges.position.set(0, -57, 0);
            scene.add(edges);
        }
        
        // set the texture as a background for all planges
        function initBackgroundPlanes() {
            const textureLoader = new THREE.TextureLoader();
            const starsTexture = textureLoader.load('/assets/img/stars.png');
        
            const backgroundMaterial = new THREE.MeshBasicMaterial({ map: starsTexture });
            backgroundMaterial.map.wrapS = THREE.RepeatWrapping;
            backgroundMaterial.map.wrapT = THREE.RepeatWrapping;
            const backgroundPlanes = [];
            const planeSize = Math.max(FIELD_WIDTH, FIELD_LENGTH) * 3;
            const planeGeometry = new THREE.PlaneGeometry(planeSize, planeSize);
        
            // Define the positions and rotations for each plane
            const planePositions = [
                { x: 0, y: 0, z: -FIELD_LENGTH * 1.5 },
                { x: 0, y: 0, z: FIELD_LENGTH * 1.5, ry: Math.PI },
                { x: -FIELD_WIDTH * 1.5, y: 0, z: 0,ry: Math.PI / 2 },
            { x: FIELD_WIDTH * 1.5, y: 0, z: 0, ry: -Math.PI / 2 },
            { x: 0, y: FIELD_LENGTH * 1.5, z: 0, rx: -Math.PI / 2 },
            { x: 0, y: -FIELD_LENGTH * 1.5, z: 0, rx: Math.PI / 2 }
        ];

        const textureRepeat = Math.max(FIELD_WIDTH, FIELD_LENGTH) / planeSize * 10;

        for (const { x, y, z, rx = 0, ry = 0 } of planePositions) {
            const plane = new THREE.Mesh(planeGeometry, backgroundMaterial);
            plane.position.set(x, y, z);
            plane.rotateX(rx);
            plane.rotateY(ry);
            backgroundMaterial.map.repeat.set(textureRepeat, textureRepeat);
            backgroundPlanes.push(plane);
            scene.add(plane);
        }
    }

    // initialize paddles
    function initPaddles() {
        paddle1 = addPaddle();
        paddle1.position.z = FIELD_LENGTH / 2;
        paddle2 = addPaddle();
        paddle2.position.z = -FIELD_LENGTH / 2;
    }

    // add Hemisphere light
    function initLighting() {
        mainLight = new THREE.HemisphereLight(0xFFFFFF, 0x003300, 1);
        scene.add(mainLight);
    }
    
    // paddle specs
    function addPaddle() {
        const paddleGeometry = new THREE.BoxGeometry(PADDLE_WIDTH, PADDLE_HEIGHT, 20);
        const paddleMaterial = new THREE.MeshPhongMaterial({
          color: 0xFFFFFF,
          specular: 0xFFFFFF,
          shininess: 50, 
          emissive: 0x333333,
        });
        const paddle = new THREE.Mesh(paddleGeometry, paddleMaterial);
        scene.add(paddle);
        return paddle;
      }

    function movePaddleOne() {
        if (gameMode === 1) {
            // 1 vs AI
            switch (true) {
                case keyState.ArrowLeft:
                    paddle1.position.x -= paddleSpeed;
                    break;
                case keyState.ArrowRight:
                    paddle1.position.x += paddleSpeed;
                    break;
                default:
                    // No movement
                    break;
            }
    
            // Limit paddle1 movement within the field
            const halfPaddleWidth = PADDLE_WIDTH / 2;
            const halfFieldWidth = FIELD_WIDTH / 2;
    
            paddle1.position.x = Math.min(halfFieldWidth - halfPaddleWidth, Math.max(-halfFieldWidth + halfPaddleWidth, paddle1.position.x));
        } else {
            // 1 vs 1
            switch (true) {
                case keyState.keyW:
                    paddle1.position.x -= paddleSpeed;
                    break;
                case keyState.keyS:
                    paddle1.position.x += paddleSpeed;
                    break;
            }
    
            // Limit paddle1 movement within the field
            const halfPaddleWidth = PADDLE_WIDTH / 2;
            const halfFieldWidth = FIELD_WIDTH / 2;
    
            paddle1.position.x = Math.min(halfFieldWidth - halfPaddleWidth, Math.max(-halfFieldWidth + halfPaddleWidth, paddle1.position.x));
        }
    }

    init();

    function handleKeyDown(event) {
        if (event.key === 'w') {
            keyState["keyW"] = true;
        } else if (event.key === 's') {
            keyState["keyS"] = true;
        } else if (event.key === 'ArrowUp') {
            keyState[event.key] = true;
        } else if (event.key === 'ArrowDown') {
            keyState[event.key] = true;
        } else if (event.key === 'ArrowLeft') {
            keyState[event.key] = true;
        } else if (event.key === 'ArrowRight') {
            keyState[event.key] = true;
        }
    }

    function handleKeyUp(event) {
        if (event.key === 'w') {
            keyState["keyW"] = false;
        } else if (event.key === 's') {
            keyState["keyS"] = false;
        } else if (event.key === 'ArrowUp') {
            keyState[event.key] = false;
        } else if (event.key === 'ArrowDown') {
            keyState[event.key] = false;
        } else if (event.key === 'ArrowLeft') {
            keyState[event.key] = false;
        } else if (event.key === 'ArrowRight') {
            keyState[event.key] = false;
        }
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
}

function showGame() {
    // Remove any existing game content
    const gameContainer = document.getElementById('game-container');
    while (gameContainer.firstChild) {
        gameContainer.removeChild(gameContainer.firstChild);
    }
    // Create a new container for rendering
    const renderContainer = document.createElement('div');
    renderContainer.id = 'container';
    gameContainer.appendChild(renderContainer);
    // Create a new scoreboard
    // const scoreBoard = document.createElement('div');
    // scoreBoard.id = 'scoreBoard';
    // scoreBoard.textContent = 'Player 1: 0 Player 2: 0';
    // gameContainer.insertBefore(scoreBoard, renderContainer);
    // Start the game
    startGameFunction(window, window.document, window.THREE);
}

