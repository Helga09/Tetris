document.addEventListener('DOMContentLoaded', () => {
    showRules();
    const grid = document.querySelector('.grid');
    let squares = Array.from(document.querySelectorAll('.grid div'));
    const scoreDisplay = document.querySelector('#score');
    const startBtn = document.querySelector("#start-button");
    const width = 10;
    let nextRandom = 0;
    let timerId;
    let score = 0;
    const colors = [
        'orange',
        'red',
        'purple',
        'green',
        'blue'
    ];

    document.getElementById('rules').addEventListener('click',showRules);

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
        [0, width, width + 1, width * 2 + 1]
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

    let currentPosition = 4;
    let currentRotation = 0;

    // randomly select a Tetromino and its first rotation
    let random = Math.floor(Math.random() * theTetrominoes.length);
    let current = theTetrominoes[random][currentRotation];

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
            moveLeft();
        }
        else if (e.keyCode === 38) {
            rotate();
        }
        else if (e.keyCode === 39) {
            moveRigth();
        }
        else if (e.keyCode === 40) {
            moveDown();
        }
    }
    document.addEventListener('keyup', control);

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
            draw();
            displayShape();
            addScore();
            gameOver();
        }
    }

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
        if (currentRotation === current.length) { //if current rotation gets to 4, make it go to 0
            currentRotation = 0;
        }

        current = theTetrominoes[random][currentRotation];
        draw();
    }

    //show up-next tetromino in mini-grid
    const displaySquares = document.querySelectorAll('.mini-grid div');
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
    
    // add funcrionality to the button
    startBtn.addEventListener('click', () => {
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
            document.querySelector('audio').pause();
            startBtn.style.backgroundColor = "green";
            startBtn.innerHTML = 'Грати';
        }
        else {
            document.querySelector('audio').play();
            draw();
            timerId = setInterval(moveDown, 1000);
            nextRandom = Math.floor(Math.random() * theTetrominoes.length);
            displayShape();
            startBtn.style.backgroundColor = "red";
            startBtn.innerHTML = 'Пауза';
        }

    });

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
            document.querySelector('audio').pause();
        }
    }

    function showRules(){
        Swal.fire({
            title: '<strong><u>Правила гри</u></strong>',
            icon: 'info',
            html:
                'Для обертання  фігур використовується клавіша<img style="  width: 40px;height: 40px;" src="https://cdn-icons-png.flaticon.com/512/31/31838.png"><br>' +
                'Для переміщення фігур по гральному полю використовуються клавіші<img style="  width: 40px;height: 40px;" src="https://cdn-icons-png.flaticon.com/512/31/31931.png"> для зміщення фігури вліво та' +
                '<img style="  width: 40px;height: 40px;" src="https://cdn-icons-png.flaticon.com/512/30/30997.png"> для зміщення фігури вправо',
            showCloseButton: true,
            showCancelButton: true,
            focusConfirm: false
        })
    }

})
