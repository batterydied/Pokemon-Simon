function game(){

    let start = 0;
    let pattern = [];
    let patternIndex = 0;
    let currentLevel = 1;
    let highScore = getHighScore();
    let animationRunning = true;

    highScoreDisplay();
    
    function initialized(event){
        if(start === 0){
            start = 1;
            clearTimeout(animationTimeout);
            animationRunning = false;
            beginGame();
            }else{
                keyHandler(event);
            }
    }
    function animateText() {
        if(animationRunning){
            $('#level-title').css({transform:'scale(1.02)', transition:'transform 0.5s'});
            setTimeout(function(){
            $('#level-title').css({transform: 'scale(1)', transition: 'transform 0.5s'});}, 500)
            setTimeout(animateText, 1000);
        }
    }

    let animationTimeout = animateText();
    $(document).on("click", initialized);
    $(document).on("keydown", initialized);

    function beginGame(){
        $(document).off("click", initialized);
        currentScore = 0;
        patternIndex = 0;
        $("#level-title").html(`Level ${currentLevel}`);
        getPattern();
        setTimeout(function(){
            $(".btn").on("click", clickHandler);
        }, 500)
    }

    function getPattern(){
        const buttonKeyMapping = {0: "green", 1: "red", 2: "yellow", 3: "blue"};
            const randomNum = Math.floor(Math.random() * 4);
            const color = buttonKeyMapping[randomNum];
            pattern.push(color);
            const button = `#${color}`;
                $(button).addClass("pressed");  
                const audio = new Audio(`./assets/sounds/${color}.mp3`);
                audio.play(); 
                setTimeout(function(){
                    audio.play();
                    $(button).removeClass("pressed"); 
                }, 100);
    }

    function clickHandler(){
        const currentColor = $(this).attr("id");
        const currentButton = $(`#${currentColor}`);
        check(currentButton, currentColor);
    }

    function keyHandler(event){
        keyMapping = {"q": "green", "w": "red", "a": "yellow", "s": "blue"};
        const currentColor = keyMapping[event.key];
        const currentButton = $(`#${currentColor}`);
        if(currentColor){
            check(currentButton, currentColor); 
        }
    }

    function check(currentButton, currentColor){
        $(currentButton).addClass("pressed");
            if(pattern[patternIndex] != currentColor){
                $(".btn").off("click", clickHandler);
                gameOver();
                currentButton.removeClass("pressed");
                setTimeout(()=>{$(document).on("click", initialized);}, 1);
             }else{
                const audio = new Audio(`./assets/sounds/${currentColor}.mp3`); 
                    audio.play();
                    setTimeout(function(){
                        currentButton.removeClass("pressed"); 
                    }, 100);
                patternIndex++;
                if(patternIndex == currentLevel){
                    currentLevel++;
                    $(".btn").off("click", clickHandler);
                    setTimeout(function(){
                        beginGame();
                    }, 600);
                }
            }  
    }

    function highScoreDisplay(){
        if(highScore > 0){
            $("#level-title").append(`<p>High Score: ${highScore}</p>`);
        }
    }
    function getHighScore() {
        return localStorage.getItem('highScore') || 0;
    }
    
    function setHighScore(score) {
        localStorage.setItem('highScore', score);
        HighScore = score;
    }
    
    function gameOver(){
        playAudio('./assets/sounds/wrong.mp3');
        scoreDisplay();
        resetGame();
        $('body').addClass('game-over');
        setTimeout(()=>{
            $('body').removeClass('game-over');
        }, 20);
    }
    function playAudio(filepath){
        const audio = new Audio(filepath);
        audio.play();
    }
    function getScore(){
        return currentLevel - 1;
    }
    function scoreDisplay(){
        let currentScore = getScore();
        let scoreText = `<p>Current Score: ${currentScore}</p>`;

        if(currentScore > highScore){
            setHighScore(currentScore);
            scoreText = `<p>Current Score: ${currentScore}, New High Score!</p>`
            setTimeout(()=>{
                playAudio('./assets/sounds/level-up.mp3');
            }, 300);
        }
        $('#level-title').html(`<span class="game-over-styles">GAME OVER</span><p>Press A Key to Start Again</p>${scoreText}`);
    }
    function resetGame(){
        pattern = [];
        currentLevel = 1;
        start = 0;
    }
}

game();