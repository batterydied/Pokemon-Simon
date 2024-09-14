function game() {

    let start = 0;
    let pattern = [];
    let patternIndex = 0;
    let currentLevel = 1;
    let highScore = getHighScore();
    let animationRunning = true;

    highScoreDisplay();
    
    let animationTimeout = animateText();
    userInput();

    function highScoreDisplay() {
        if (highScore > 0) {
            $("#level-title").append(`<p>High Score: ${highScore}</p>`);
        }
    }

    function userInput(){
        $(document).on("click", onUserInterface);
        $(document).on("keydown", onUserInterface);
    }
    
    function onUserInterface(event) {
        if (start === 0) {
            start = 1;
            clearTimeout(animationTimeout);
            animationRunning = false;
            beginGame();
        } else {
            keyHandler(event);
        }
    }

    function animateText() {
        if (animationRunning) {
            $("#level-title").css({transform: "scale(1.02)", transition: "transform 0.5s"});
            setTimeout(function() {
                $("#level-title").css({transform: "scale(1)", transition: "transform 0.5s"});
            }, 500);
            setTimeout(animateText, 1000);
        }
    }

    function beginGame() {
        $(document).off("click", onUserInterface);
        currentScore = 0;
        patternIndex = 0;
        $("#level-title").html(`Level ${currentLevel}`);
        getPattern();
        setTimeout(() => {
            $(".btn").on("click", clickHandler);
        }, 300);
    }

    function getPattern() {
        const buttonKeyMapping = {0: "green", 1: "red", 2: "yellow", 3: "blue"};
        const randomNum = Math.floor(Math.random() * 4);
        const color = buttonKeyMapping[randomNum];
        pattern.push(color);
        const currentButton = $(`#${color}`);
        clickAnimation(currentButton);
        playAudio(`./assets/sounds/${color}.mp3`);
    }

    function clickHandler() {
        const currentColor = $(this).attr("id");
        const currentButton = $(`#${currentColor}`);
        clickAnimation(currentButton);
        check(currentColor);
    }

    function keyHandler(event) {
        keyMapping = {"q": "green", "w": "red", "a": "yellow", "s": "blue"};
        const currentColor = keyMapping[event.key];
        const currentButton = $(`#${currentColor}`);
        if (currentColor) {
            clickAnimation(currentButton);
            check(currentColor);
        }
    }

    function check(currentColor) {
        if (pattern[patternIndex] != currentColor) {
            $(".btn").off("click", clickHandler);
            gameOver();
            setTimeout(() => {
                $(document).on("click", onUserInterface);
            }, 1);
        } else {
            playAudio(`./assets/sounds/${currentColor}.mp3`);
            patternIndex++;
            if (patternIndex == currentLevel) {
                currentLevel++;
                $(".btn").off("click", clickHandler);
                setTimeout(function() {
                    beginGame();
                }, 600);
            }
        }
    }

    function clickAnimation(currentButton) {
        currentButton.addClass("pressed");
        setTimeout(() => {
            currentButton.removeClass("pressed");
        }, 100);
    }

    function gameOver() {
        playAudio("./assets/sounds/wrong.mp3");
        scoreDisplay();
        resetGame();
        $("body").addClass("game-over");
        setTimeout(() => {
            $("body").removeClass("game-over");
        }, 20);
    }

    function playAudio(filepath) {
        const audio = new Audio(filepath);
        audio.play();
    }

    function getScore() {
        return currentLevel - 1;
    }

    function scoreDisplay() {
        let currentScore = getScore();
        let scoreText = `<p>Current Score: ${currentScore}</p>`;

        if (currentScore > highScore) {
            setHighScore(currentScore);
            scoreText = `<p>Current Score: ${currentScore}, New High Score!</p>`;
            setTimeout(() => {
                playAudio("./assets/sounds/level-up.mp3");
            }, 300);
        }
        $("#level-title").html(`<span class="game-over-styles">GAME OVER</span>${scoreText}`);
    }

    function getHighScore() {
        return localStorage.getItem("highScore") || 0;
    }

    function setHighScore(score) {
        localStorage.setItem("highScore", score);
        highScore = score;
    }

    function resetGame() {
        pattern = [];
        currentLevel = 1;
        start = 0;
    }
}

game();
