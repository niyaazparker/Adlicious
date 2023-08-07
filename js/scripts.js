    // JavaScript code for the game
    const playButton = document.querySelector('#play-button');
    const canvas = document.getElementById("myCanvas");
    const ctx = canvas.getContext("2d");

    // Player and ball dimensions and initial positions
    const playerOneHeight = 66;
    const playerOneWidth = 50;
    let playerOneX = (canvas.width - playerOneWidth) / 2;
    let playerOneY = (canvas.height - playerOneHeight * 2);
    let rightPressed = false;
    let leftPressed = false;

    // Ball properties
    let x = canvas.width / 2;
    let y = playerOneY - playerOneHeight;
    let dx = 4;
    let dy = -4;

    const ballHeight = 24;
    const ballWidth = 24;

    // Goal properties
    const goalWidth = 80;
    const goalHeight = 40;
    const goalX = canvas.width / 2 - goalWidth / 2;

    // Offset necessary because of the way field.png was originally created (green borders)
    const fieldOffset = 6;

    // Mini Players properties
    const miniPlayerRowCount = 2;
    const miniPlayerolumnCount = 6;
    const miniPlayerWidth = 30;
    const miniPlayerHeight = 30;
    const miniPlayerPadding = 20;
    const miniPlayerOffsetTop = 160;
    const miniPlayerOffsetLeft = 10;

    // Variables for score, lives
    let score = 0;
    let lives = 3;

    // Variables for ball, goal, playerBlue images
    let ball = new Image();
    let goal = new Image();
    let playerBlue = new Image();

    // Two-dimensional array for the cones
    const cones = [];
    for (let c = 0; c < miniPlayerolumnCount; c++) {
      cones[c] = [];
      for (let r = 0; r < miniPlayerRowCount; r++) {
        cones[c][r] = { x: 0, y: 0, status: 1 };
      }
    }

    // Keyboard events for player movement
    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);

    // Handle key presses
    function keyDownHandler(e) {
      if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = true;
      } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = true;
      }
    }

    // Handle key releases
    function keyUpHandler(e) {
      if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = false;
      } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = false;
      }
    }

    // Mouse events for player movement
    document.addEventListener("mousemove", mouseMoveHandler, false);

    // Handle mouse movement
    function mouseMoveHandler(e) {
      const relativeX = e.clientX - canvas.offsetLeft;
      if (relativeX > playerOneWidth / 2 && relativeX < canvas.width - playerOneWidth / 2) {
        playerOneX = relativeX - playerOneWidth / 2;
      }
    }

    // Mobile touch events for player movement
    document.addEventListener("touchstart", touchHandler);
    document.addEventListener("touchmove", touchHandler);

    // Handle touch events
    function touchHandler(e) {
      if (e.touches) {
        playerOneX = e.touches[0].pageX - canvas.offsetLeft - playerOneWidth / 2;
        playerOneY = e.touches[0].pageY - canvas.offsetTop - playerOneHeight / 2;
        e.preventDefault();
      }
    }

    // Reload the page
    function reloadThePage() {
      document.location.reload();
    }

    // Detect collision between ball and cones
    function collisionDetectionPlayers() {
      for (let c = 0; c < miniPlayerolumnCount; c++) {
        for (let r = 0; r < miniPlayerRowCount; r++) {
          const coneItems = cones[c][r];
          if (coneItems.status === 1) {
            if (x > coneItems.x && x < coneItems.x + miniPlayerWidth && y > coneItems.y && y < coneItems.y + miniPlayerHeight) {
              dy = -dy;
              coneItems.status = 0;
              score++;
            }
          }
        }
      }
    }

    // Detect collision between ball and goal
    function collisionDetectionGoal() {
      if (x > goalX && y < goal.y + goalHeight && x < goalX + goalWidth - ballWidth) {
        dy = 0;
        dx = 0;
        score++;

        // Update the alert message to display the goals and lives
        const message = `GOAAAAAAL!\nYou Scored: ${score}\nLives Remaining: ${lives}`;
        alert(message);

        document.location.reload();
      }
    }

    // Draw the player's score
    function drawScore() {
      ctx.font = "400 15px Arial";
      ctx.fillStyle = "#FFFFFF";
      ctx.textAlign = "left";
      ctx.fillText(`Score: ${score}`, 8, 22);
    }

    // Draw the player's remaining lives
    function drawLives() {
      ctx.font = "400 15px Arial";
      ctx.fontWeight = "nbold";
      ctx.fillStyle = "#FFFFFF";
      ctx.textAlign = "left";
      ctx.fillText(`Lives: ${lives}`, canvas.width - 65, 22);
    }

    // Draw the goal image on the canvas
    function drawGoal() {
      goal.src = "images/goal.png";
      ctx.drawImage(goal, goalX, 10);
      console.log("goalX is " + goalX)
    }

    // Draw the ball image on the canvas
    function drawBall() {
      ball.src = "images/ball.png";
      ctx.drawImage(ball, x, y);
    }

    // Draw the playerBlue image on the canvas
    function drawPlayerOne() {
      playerBlue.src = "images/player-1.png";
      ctx.drawImage(playerBlue, playerOneX, canvas.height - playerOneHeight - fieldOffset)
    }

    // Draw the cones on the canvas
    function drawPlayers() {
      for (let c = 0; c < miniPlayerolumnCount; c++) {
        for (let r = 0; r < miniPlayerRowCount; r++) {
          if (cones[c][r].status === 1) {
            const coneX = c * (miniPlayerWidth + miniPlayerPadding) + miniPlayerOffsetLeft;
            const coneY = r * (miniPlayerHeight + miniPlayerPadding) + miniPlayerOffsetTop;
            cones[c][r].x = coneX;
            cones[c][r].y = coneY;
            let cone = new Image();
            cone.src = "images/player-update.png";
            ctx.drawImage(cone, coneX, coneY);
          }
        }
      }
    }

    // Hide the play button
    function hidePlayButton() {
      playButton.style.visibility = 'hidden';
    }

    // Show the play button
    function showPlayButton() {
      playButton.style.visibility = 'visible';
    }

    // Main drawing function for the game
    function draw() {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw game elements
      drawPlayers();
      drawGoal();
      drawBall();
      drawPlayerOne();
      drawScore();
      drawLives();
      collisionDetectionPlayers();
      collisionDetectionGoal();
      hidePlayButton();

      // Ball collision with walls
      if (x + dx > canvas.width - ballWidth - fieldOffset || x < fieldOffset) {
        dx = -dx;
      }
      if (y + dy < ballHeight / 2 + fieldOffset) {
        dy = -dy;
      } else if (y + dy > canvas.height - playerOneHeight - ballHeight) {
        if (x > playerOneX && x < playerOneX + playerOneWidth) {
          dy = -dy;
        } else if (y + dy > canvas.height - ballHeight / 4) {
          lives--;
          if (!lives) {
            alert("Please try again");
            document.location.reload();
          } else {
            x = canvas.width / 2;
            y = canvas.height - fieldOffset - 80; // this 'magic number' to be fixed in future version
            dx = 5;
            dy = -5;
            playerOneX = (canvas.width - playerOneWidth) / 2;
          }
        }
      }

      // Player movement based on keyboard input
      if (rightPressed) {
        playerOneX += 7;
        if (playerOneX + playerOneWidth > canvas.width) {
          playerOneX = canvas.width - playerOneWidth - fieldOffset;
        }
      } else if (leftPressed) {
        playerOneX -= 7;
        if (playerOneX < 0) {
          playerOneX = 0 + fieldOffset;
        }
      }

      // Update ball position
      x += dx;
      y += dy;

      // Request the next animation frame
      requestAnimationFrame(draw);
    }

    // Initialize image assets
    drawPlayers();
    drawGoal();
    drawBall();
    drawPlayerOne();

    // Initialize game when the play button is clicked
    playButton.addEventListener('click', draw);
