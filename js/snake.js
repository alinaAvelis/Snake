game.snake = {
    game: game,
    cells: [],
    moving: false,
    direction: false,
    directions: {
        up: {
            row: -1,
            col: 0,
            angle: 0
        },
        down: {
            row: 1,
            col: 0,
            angle: 180,
        },
        left: {
            row: 0,
            col: -1,
            angle: 270,
        },
        right: {
            row: 0,
            col: 1,
            angle: 90
        }
    },
    create() {
        let startCells = [{row: 7, col: 7}, {row: 8, col: 7}];
        this.direction = this.directions.up;

        for (let startCell of startCells) {
            this.cells.push(this.game.board.getCell(startCell.row, startCell.col));
        }
    },
    renderHead() {
        // Получить голову
        let head = this.cells[0];
        let halfSize = this.game.sprites.head.width / 2;
        // сохранить исходное состояние объекта
        this.game.ctx.save();
        // контекст вращается относительно начальной точки координат
        // нужно переместить точку отчета координат в центр изображения, потому что вращать нам нужно относительно центра головы
            // в верхний левый угол
        this.game.ctx.translate(head.x, head.y);
            // в центр
        this.game.ctx.translate(halfSize, halfSize);

        // выполняем вращение относительно центра. Функция использует радианы, поэтому используем формулу преобразования в градусы

        this.game.ctx.rotate(this.direction.angle * Math.PI / 180);
        // Отрисовать голову c учетом поворота контекста, возращает точку координат из центра в левый верхний угол
        this.game.ctx.drawImage(this.game.sprites.head, -halfSize, -halfSize);

        // возвращаем исходное состояние контекста к тому моменту, который мы сохранили выше.
        this.game.ctx.restore();
    },
    renderBody() {
        for (let i = 1; i < this.cells.length; i++) {
            this.game.ctx.drawImage(this.game.sprites.body, this.cells[i].x, this.cells[i].y);
        }
    },
    render() {
        this.renderHead();
        this.renderBody();
    },
    start(keyCode) {
        switch (keyCode) {
            case 38:
                this.direction = this.directions.up;
                break;
            case 37:
                this.direction = this.directions.left;
                break;
            case 39:
                this.direction = this.directions.right;
                break;
            case 40:
                this.direction = this.directions.down;
                break;
        }

        if(!this.moving) {
            this.game.onSnakeStart();
        }

        this.moving = true;
    },
    move() {
        if (!this.moving) {
            return;
        }
        // получить следующую ячейку
        let cell = this.getNextCell();
        // если такая ячейка есть
        if(!cell || this.hasCell(cell) || this.game.board.isBombCell(cell)) {
            // остановить игру
            this.game.stop();
        }
        if (cell) {
            // добавить новую ячейку в snake.cells 
            this.cells.unshift(cell);

            // если новая ячейка не является яблоком
            if (!this.game.board.isFoodCell(cell)) {
                // удалить последнюю ячейку из snake.cells
                this.cells.pop();
            } else {
               // если новая ячейка является яблоком
               this.game.onSnakeEat();
            }
        }
    },
    hasCell(cell) {
        return this.cells.find(part => part === cell);
    },
    getNextCell() {
        let head = this.cells[0];

        let row = head.row + this.direction.row;
        let col = head.col + this.direction.col;

        return this.game.board.getCell(row, col);
    }
};
