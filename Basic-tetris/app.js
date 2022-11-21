document.addEventListener('DOMContentLoaded', () => {
    showRules();
    const grid = document.querySelector('.grid');
    let squares = Array.from(document.querySelectorAll('.grid div'));
    const scoreDisplay = document.querySelector('#score');
    const startBtn = document.querySelector("#start-button");
    const startNewGameBtn = document.getElementById("startNewGame");
    var slider = document.getElementById("speed");
    var volumeMusic = document.getElementById("volumeMusic");
    const displaySquares = document.querySelectorAll('.mini-grid div');
    document.querySelector('audio').pause();
    const width = 10;
    let nextRandom = 0;
    let currentRotation = 0;
    let timerId;
    let score = 0;
    const colors = [
        'orange',
        'red',
        'purple',
        'green',
        'blue'
    ];

    document.getElementById('rules').addEventListener('click', showRules);


    // The Tetrominoes
    const lTetromino = [
        [1, width + 1, width * 2 + 1, 2],
        [width, width + 1, width + 2, width * 2 + 2],
        [1, width + 1, width * 2 + 1, width * 2],
        [width, width * 2, width * 2 + 1, width * 2 + 2]
    ];

    const zTetromino = [
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1],
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1]
    ];

    const tTetromino = [
        [1, width, width + 1, width + 2],
        [1, width + 1, width + 2, width * 2 + 1],
        [width, width + 1, width + 2, width * 2 + 1],
        [1, width, width + 1, width * 2 + 1]
    ];

    const oTetromino = [
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1]
    ];

    const iTetromino = [
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3],
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3]
    ];

    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];


    var currentPosition = 4;

    // randomly select a Tetromino and its first rotation
    var random = Math.floor(Math.random() * theTetrominoes.length);
    var current = theTetrominoes[random][currentRotation];

    // draw the tetromino
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino');
            squares[currentPosition + index].style.backgroundColor = colors[random];
        })
    }

    // undrow the Tetromino
    function undrow() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino');
            squares[currentPosition + index].style.backgroundColor = '';
        })
    }


    // assign functions to keyCodes
    function control(e) {

        if (e.keyCode === 37) {
            if (timerId) {
                moveLeft();
            }
        }
        else if (e.keyCode === 38) {
            if (timerId) {
                rotate();
            }
        }
        else if (e.keyCode === 39) {
            if (timerId) {
                moveRigth();
            }
        }
        else if (e.keyCode === 40) {
            if (timerId) {
                moveDown();
            }
        }
    }
    document.addEventListener('keydown', control);

    var arrow_keys_handler = function (e) {
        switch (e.code) {
            case "ArrowUp": case "ArrowDown": case "ArrowLeft": case "ArrowRight":
            case "Space": e.preventDefault(); break;
            default: break; // do not block other keys
        }
    };



    // move down function
    function moveDown() {
        undrow();
        currentPosition += width;
        draw();
        freeze();
    }

    // freeze function
    function freeze() {
        if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'));
            //start a new tetromino falling
            random = nextRandom;
            nextRandom = Math.floor(Math.random() * theTetrominoes.length);
            current = theTetrominoes[random][currentRotation];
            currentPosition = 4;
            addScore();
            draw();
            displayShape();
            gameOver();
        }
    }
    freeze();

    // move the tetromino left, unless is at the edge or there is a blocage
    function moveLeft() {
        undrow();
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);

        if (!isAtLeftEdge) currentPosition -= 1;

        if (current.some(index => squares[currentPosition + index].classList.contains("taken"))) {
            currentPosition += 1;
        }

        draw();
    }

    // move the tetromino rigth, unless is at the edge or there is a blocage
    function moveRigth() {
        undrow();
        const isAtRigthEdge = current.some(index => (currentPosition + index) % width === width - 1);

        if (!isAtRigthEdge) currentPosition += 1;

        if (current.some(index => squares[currentPosition + index].classList.contains("taken"))) {
            currentPosition -= 1;
        }

        draw();
    }

    // rotate the tetromino
    function rotate() {
        undrow();
        currentRotation++;

        if (currentRotation === current.length) {
            currentRotation = 0;
        }

        current = theTetrominoes[random][currentRotation];
        draw();
    }

    //show up-next tetromino in mini-grid

    const displayWidth = 4;
    const displayIndex = 0;

    // the Tetrominos without rotations
    const upNextTetrominoes = [
        [1, displayWidth + 1, displayWidth * 2 + 1, 2], //lTetromino
        [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], //zTetromino
        [1, displayWidth, displayWidth + 1, displayWidth + 2], //tTetromino
        [0, 1, displayWidth, displayWidth + 1], //oTetromino
        [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1] //iTetromino
    ];

    //display the shape in the mini-grid display
    function displayShape() {
        displaySquares.forEach(squares => {
            squares.classList.remove('tetromino');
            squares.style.backgroundColor = '';
        })
        upNextTetrominoes[nextRandom].forEach(index => {
            displaySquares[displayIndex + index].classList.add('tetromino');
            displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom];
        });
    }




    startNewGameBtn.addEventListener('click', startNewGame);
    // add funcrionality to the button
    startBtn.addEventListener('click', startGame);

    slider.oninput = function () {
        if (timerId) {
            clearInterval(timerId);
            timerId = setInterval(moveDown, this.value);
        }
    }

    volumeMusic.oninput = function () {
        document.querySelector('audio').play();
        document.querySelector('audio').volume = (this.value / 100);
    }

    function startNewGame() {
        document.querySelector('audio').pause();
        startBtn.style.backgroundColor = "green";
        startBtn.innerHTML = 'Грати';
        startNewGameBtn.style.display = 'none';
        window.removeEventListener("keydown", arrow_keys_handler, false);
        clearInterval(timerId);
        timerId = null;
        score = 0;
        scoreDisplay.innerHTML = 0;
        

        document.querySelector('audio').currentTime = 0;

        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino');
            squares[currentPosition + index].style.backgroundColor = '';
        })

        for (let i = 0; i < 199; i += width) {
            const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9];
            row.forEach(index => {
                squares[index].classList.remove('taken');
                squares[index].classList.remove('tetromino');
                squares[index].style.backgroundColor = '';
            })
            const squaresRemoved = squares.splice(i, width);
            squares = squaresRemoved.concat(squares);
            squares.forEach(cell => grid.appendChild(cell));

        }

        undrow();
        displaySquares.forEach(squares => {
            squares.classList.remove('tetromino');
            squares.style.backgroundColor = '';
        })

        random = nextRandom;
        nextRandom = Math.floor(Math.random() * theTetrominoes.length);
        current = theTetrominoes[random][currentRotation];
        currentPosition = 4;
    }

    function startGame() {
        if (timerId) {
            window.removeEventListener("keydown", arrow_keys_handler, false);
            clearInterval(timerId);
            timerId = null;
            document.querySelector('audio').pause();
            startBtn.style.backgroundColor = "green";
            startBtn.innerHTML = 'Грати';
        }
        else {
            startNewGameBtn.style.display = 'inline-block';
            window.addEventListener("keydown", arrow_keys_handler, false);
            document.querySelector('audio').play();
            draw();
            timerId = setInterval(moveDown, slider.value);
            nextRandom = Math.floor(Math.random() * theTetrominoes.length);
            displayShape();
            startBtn.style.backgroundColor = "red";
            startBtn.innerHTML = 'Пауза';
        }

    }

    // add score
    function addScore() {
        for (let i = 0; i < 199; i += width) {
            const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9];

            if (row.every(index => squares[index].classList.contains('taken'))) {
                score += 10;
                scoreDisplay.innerHTML = score;
                row.forEach(index => {
                    squares[index].classList.remove('taken');
                    squares[index].classList.remove('tetromino');
                    squares[index].style.backgroundColor = '';
                })
                const squaresRemoved = squares.splice(i, width);
                squares = squaresRemoved.concat(squares);
                squares.forEach(cell => grid.appendChild(cell));
            }
        }
    }

    // game over
    function gameOver() {
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            scoreDisplay.innerHTML = 'кінець';
            clearInterval(timerId);
            timerId = null;
            document.querySelector('audio').pause();
        }
    }

    function showRules() {
        Swal.fire({
            title: '<strong><u>Правила гри</u></strong>',
            icon: 'info',
            html:
                'Для обертання  фігур використовується клавіша <img style="  width: 40px;height: 40px;" src="https://cdn-icons-png.flaticon.com/512/31/31838.png"><br>' +
                'Для переміщення фігур по гральному полю використовуються клавіші <img style="  width: 40px;height: 40px;" src="https://cdn-icons-png.flaticon.com/512/31/31931.png"> для зміщення фігури вліво та' +
                ' <img style="  width: 40px;height: 40px;" src="https://cdn-icons-png.flaticon.com/512/30/30997.png"> для зміщення фігури вправо<br>' +
                'Для швидшого опускання фігури використовується клавіша <img style="  width: 40px;height: 40px;" src="https://cdn-icons-png.flaticon.com/512/31/31945.png"><br>' +
                'Також швидкість опускання фігури регулюється слайдером',
            showCloseButton: true,
            showCancelButton: true,
            focusConfirm: false
        })
    }

})
