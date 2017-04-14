/*===============Clases===============*/
/**
 *@constructor
 */
function renderChar(posX, posY, radius, color) {
    this._posX = posX;
    this._posY = posY;
    this._radius = radius;
    this._color = color;
    this._centerX = this._posX * 25 + radius;
    this._centerY = this._posY * 25 + radius;
}

renderChar.prototype.draw = function () {
    throw "Function not implemented yet.";
};
renderChar.prototype.reset = function () {
    throw "Fuction not implemented yet."
};
Object.defineProperties(renderChar.prototype, {
    centerX: {
        get: function () {
            return this._centerX;
        },
        set: function (value) {
            this._centerX = value;
        }
    },

    centerY: {
        get: function () {
            return this._centerY;
        },
        set: function (value) {
            this._centerY = value;
        }
    },

    radius: {
        get: function () {
            return this._radius;
        },
        set: function (value) {
            this._radius = value;
        }
    },

    color: {
        set: function (value) {
            this._color = value;
        }
    },
    posX: {
        get: function () {
            return this._posX;
        },
        set: function (value) {
            this._posX = value;
        }
    },
    posY: {
        get: function () {
            return this._posY;
        },
        set: function (value) {
            this._posY = value;
        }
    }

});

/**
 *@constructor
 */
function Character(name, direction, speed, game, state, posX, posY, radius, color) {
    renderChar.call(this, posX, posY, radius, color);
    this._name = name;
    this._direction = direction;
    this._speed = speed;
    this._game = game;
    this._state = state;
    this._startX = posX * 25 + radius;
    this._startY = posY * 25 + radius;
    this._initX = posX;
    this._initY = posY;
    this._initDir = direction;
}
Character.prototype = Object.create(renderChar.prototype);
Object.defineProperties(Character.prototype, {
    name: {
        get: function () {
            return this._name;
        },
        set: function (value) {
            this._name = value;
        }
    },
    direction: {
        get: function () {
            return this._direction;
        },
        set: function (value) {
            this._direction = value;
        }
    },
    speed: {
        get: function () {
            return this._speed;
        },
        set: function (value) {
            this._speed = value;
        }
    },
    state: {
        get: function () {
            return this._state;
        },
        set: function (value) {
            this._state = value;
        }
    },
    game: {
        get: function () {
            return this._game;
        },
        set: function (value) {
            this._game = value;
        }
    }
});
Character.prototype.collision = function () {
    switch (this._direction) {
    case 'right':
        return this._game.mapa._dataMap[this._posY][this._posX + 1]._isPassable;
        break;

    case 'left':
        return this._game.mapa._dataMap[this._posY][this._posX - 1]._isPassable;
        break;

    case 'up':
        return this._game.mapa._dataMap[this._posY - 1][this._posX]._isPassable;
        break;

    case 'down':
        return this._game.mapa._dataMap[this._posY + 1][this._posX]._isPassable;
        break;
    }
};
/**
 *@constructor
 */
function Pacman(name, posX, posY, color, game) {
    Character.call(this, name, "left", 1, game, true, posX, posY, 12, color);
    this._dotsCount = 0;
    this._pillsCount = 0;
    this._life = 3;
    this._score = 0;
    this._frames = 0;
    this._count = 0;
    this._ghostPoints = 0;
}

Pacman.prototype = Object.create(Character.prototype);
Pacman.prototype.constructor = Pacman;
Object.defineProperties(Pacman.prototype, {
    dotsCount: {
        get: function () {
            return this._dotsCount;
        },
        set: function (value) {
            this._dotsCount = value;
        }
    },
    pillsCount: {
        get: function () {
            return this._pillsCount;
        },
        set: function (value) {
            this._pillsCount = value;
        }
    },
    life: {
        get: function () {
            return this._life;
        },
        set: function (value) {
            this._life = value;
        }
    },
    score: {
        get: function () {
            return this._score;
        }
    },
    frames: {
        get: function () {
            return this._frames;
        },
        set: function (value) {
            this._frames = value;
        }
    }
});
Pacman.prototype.draw = function () {
    context.beginPath();
    context.fillStyle = this._color;
    switch (this._direction) {
    case 'right':
        context.arc(this._centerX, this._centerY, this._radius, (Math.PI / 180) * 40, (Math.PI / 180) * 320, false);
        break;

    case 'left':
        context.arc(this._centerX, this._centerY, this._radius, (Math.PI / 180) * 220, (Math.PI / 180) * 140, false);
        break;

    case 'up':
        context.arc(this._centerX, this._centerY, this._radius, (Math.PI / 180) * 320, (Math.PI / 180) * 220, false);
        break;

    case 'down':
        context.arc(this._centerX, this._centerY, this._radius, (Math.PI / 180) * 140, (Math.PI / 180) * 40, false);
        break;
    }
    context.lineTo(this._centerX, this._centerY);
    context.fill();
    context.closePath();
};
Pacman.prototype.calcScore = function (ghostPoints) {
    this._ghostPoints += ghostPoints;
};
Pacman.prototype.update = function () {
    
    if (this._frames == 0) {
        this._state = false;
    }
    if (this.collision()) {
        switch (this._direction) {
        case 'up':
            this._centerY -= this._speed;
            break;
        case 'down':
            this._centerY += this._speed;
            break;
        case 'right':
            this._centerX += this._speed;
            break;
        case 'left':
            this._centerX -= this._speed;
            break;
        }
        this._frames++;
    }

    if (this._frames == 25) {
        this._state = true;
        this._frames = 0;
        switch (this._direction) {
        case 'up':
            this._posY--;
            break;
        case 'down':
            this._posY++;
            break;
        case 'right':
            this._posX++;
            break;
        case 'left':
            this._posX--;
            break;
        }
        if(this._game.mapa._dataMap[this._posY][this._posX].name === 'dot') {
            this._dotsCount++;
        }else if (this._game.mapa._dataMap[this._posY][this._posX].name === 'pill') {
            this._pillsCount++;
            this._count = 1;
        }
        this._game.mapa._dataMap[this._posY][this._posX] = this._game.mapa.getBlank(); 
        this._score = this._pillsCount * 50 + this._dotsCount * 10 + this._ghostPoints; //aca esta el problema
        
    }
    if(this._count === 1) {
        for(var x in this._game.ghostArray){
                this._game.ghostArray[x]._dangerState = true;
            }
        this._count = 0;
    }

};
Pacman.prototype.reset = function () {
    this._centerY = this._startY;
    this._centerX = this._startX;
    this._direction = 'left';
    this._posX = this._initX;
    this._posY = this._initY;
    this._state = true;
    this._frames = 0;
};

/**
 *@constructor
 */
function Ghost(name, direction, speed, game, posX, posY, fixedX, fixedY, color) {
    Character.call(this, name, direction, speed, game, true, posX, posY, 12, color);
    this._ghostColor = color;
    this._mode = 2 // 1 chase, 2 scatter, 3 danger
    this._dangerState = false;
    this._dangerColor = '#0101DF';
    this._frames = 0;
    this._count = 0;
    this._fixedX = fixedX;
    this._fixedY = fixedY;
    this._date = Date.now();
    this._speed = speed;
    this._pacX = 0;
    this._pacY = 0;
    this._cframes = 25;
}
Ghost.prototype = Object.create(Character.prototype);
Ghost.prototype.constructor = Ghost;
Object.defineProperties(Ghost.prototype, {
    mode: {
        get: function () {
            return this._mode;
        },
        set: function (value) {
            this._mode = value;
        }
    },
    dangerState: {
        get: function () {
            return this._dangerState;
        },
        set: function (value) {
            this._dangerState = value;
        }
    }
});
Ghost.prototype.draw = function () {
    context.beginPath();
    context.fillStyle = this._color;
    context.arc(this._centerX, this._centerY, this._radius, 0, Math.PI, true);
    context.fill();
    context.fillRect(this._centerX - 12, this._centerY, 24, 12); //ver
    context.closePath();

};
Ghost.prototype.danger = function () {
    this._pacX = this._game.pacman.posX;
    this._pacY = this._game.pacman.posY;
    var array = this.getArray();
    this._color = this._dangerColor;
    this._speed = 0.5;
    this._cframes = 50;
    switch (this._direction) {
    case 'up':
        for (var x in array) {
            if ((this._pacX < this._posX && array[x] === 'right') || (array.length == 2 && array[x] === 'right')) {
                this.right();
                break;
            } else if ((this._pacX > this._posX && array[x] === 'left') || (array.length == 2 && array[x] === 'left')) {
                this.left();
                break;
            } else if (array[x] === 'up' && this.collision()) {
                this.up();
            } else if (this.collision() === false) {
                this.left();
            }
        }

        break;
    case 'down':
        for (var x in array) {
            if ((this._pacX < this._posX && array[x] === 'right') || (array.length == 2 && array[x] === 'right')) {
                this.right();
                break;
            } else if ((this._pacX > this._posX && array[x] === 'left') || (array.length == 2 && array[x] === 'left')) {
                this.left();
                break;
            } else if (array[x] === 'down' && this.collision()) {
                this.down();
            } else if (this.collision() === false) {
                this.left();
            }
        }
        break;
    case 'left':
        for (var x in array) {
            if ((this._pacY < this._posY && array[x] === 'down') || (array.length == 2 && array[x] === 'down')) {
                this.down();
                break;
            } else if ((this._pacY > this._posY && array[x] === 'up') || (array.length == 2 && array[x] === 'up')) {
                this.up();
                break;
            } else if (array[x] === 'left' && this.collision()) {
                this.left();
            } else if (this.collision() === false) {
                this.up();
            }
        }
        break;
    case 'right':
        for (var x in array) {
            if ((this._pacY < this._posY && array[x] === 'down') || (array.length == 2 && array[x] === 'down')) {
                this.down();
                break;
            } else if ((this._pacY > this._posY && array[x] === 'up') || (array.length == 2 && array[x] === 'up')) {
                this.up();
                break;
            } else if (array[x] === 'right' && this.collision()) {
                this.right();
            } else if (this.collision() === false) {
                this.up();
            }
        }
        break;
    }
};
Ghost.prototype.noDanger = function () {
    this._color = this._ghostColor;
    this._speed = 1;
    this._mode = 1;
    this._date = Date.now();
    this._dangerState = false;
    this._cframes = 25;
};
Ghost.prototype.aiChase = function () {
    throw "Function not implemented yet.";
};
Ghost.prototype.aiScatter = function () {
    var array = this.getArray();
    switch (this._direction) {
    case 'up':
        for (var x in array) {
            if ((this._fixedX > this._posX && array[x] === 'right') || (array.length == 2 && array[x] === 'right')) {
                this.right();
                break;
            } else if ((this._fixedX < this._posX && array[x] === 'left') || (array.length == 2 && array[x] === 'left')) {
                this.left();
                break;
            } else if (array[x] === 'up') {
                this.up();
            }
        }

        break;
    case 'down':
        for (var x in array) {
            if ((this._fixedX > this._posX && array[x] === 'right') || (array.length == 2 && array[x] === 'right')) {
                this.right();
                break;
            } else if ((this._fixedX < this._posX && array[x] === 'left') || (array.length == 2 && array[x] === 'left')) {
                this.left();
                break;
            } else if (array[x] === 'down') {
                this.down();
            }
        }

        break;
    case 'left':
        for (var x in array) {
            if ((this._fixedY > this._posY && array[x] === 'down') || (array.length == 2 && array[x] === 'down')) {
                this.down();
                break;
            } else if ((this._fixedY < this._posY && array[x] === 'up') || (array.length == 2 && array[x] === 'up')) {
                this.up();
                break;
            } else if (array[x] === 'left') {
                this.left();
            }
        }
        break;
    case 'right':
        for (var x in array) {
            if ((this._fixedY > this._posY && array[x] === 'down') || (array.length == 2 && array[x] === 'down')) {
                this.down();
                break;
            } else if ((this._fixedY < this._posY && array[x] === 'up') || (array.length == 2 && array[x] === 'up')) {
                this.up();
                break;
            } else if (array[x] === 'right') {
                this.right();
            }
        }
        break;
    }
};
Ghost.prototype.update = function () {
    if (this._frames == 0) {
        this._state = false;
    }
    if (this.collision()) {
        switch (this._direction) {
        case 'up':
            this._centerY -= this._speed;
            break;
        case 'down':
            this._centerY += this._speed;
            break;
        case 'right':
            this._centerX += this._speed;
            break;
        case 'left':
            this._centerX -= this._speed;
            break;
        }
        this._frames++;
    }
    if (this._frames == this._cframes) {
        this._state = true;
        this._frames = 0;
        //this._count = 1;
        switch (this._direction) {
        case 'up':
            this._posY--;
            break;
        case 'down':
            this._posY++;
            break;
        case 'right':
            this._posX++;
            break;
        case 'left':
            this._posX--;
            break;
        }
    }
};
Ghost.prototype.reset = function () {
    this._centerY = this._startY;
    this._centerX = this._startX;
    this._direction = this._initDir;
    this._posX = this._initX;
    this._posY = this._initY;
    this._state = true;
    this._frames = 0;
    this._date = Date.now();
    this._mode = 2;
    this._cframes = 25;
    this._speed = 1;
    this._color = this._ghostColor;
    this._dangerState = false;
    this._count = 0;
};
Ghost.prototype.changeMode = function () {
        if(this._dangerState && this._count === 0) {
            this._mode = 3;
            this._date = Date.now();  
            this._count = 1;
            }
    var current = Date.now();
    var elapsed = Math.abs((current - this._date) / 1000);

    if (this._state === true || this.collision() === false) {
        if (this._mode === 1) {
            if (elapsed < 20) {
                this.aiChase();
            } else if (elapsed >= 20) {
                this._mode = 2;
                this._date = Date.now();
                elapsed = 0;
                switch (this._direction) {
                case 'up':
                    this.down();
                    break;
                case 'down':
                    this.up();
                    break;
                case 'left':
                    this.right();
                    break;
                case 'right':
                    this.left();
                    break;
                }

            }


        } else if (this._mode === 2) {
            if (elapsed < 7) {
                this.aiScatter();
            } else if (elapsed >= 7) {
                this._mode = 1;
                this._date = Date.now();
                elapsed = 0;
                switch (this._direction) {
                case 'up':
                    this.down();
                    break;
                case 'down':
                    this.up();
                    break;
                case 'left':
                    this.right();
                    break;
                case 'right':
                    this.left();
                    break;
                }
            }
        }else if(this._mode === 3) {
            if(elapsed < 10) {
                this.danger();
            }else{
                this.noDanger();
                this._count = 0;
                elapsed = 0;
            }
        }
        
        }
};
Ghost.prototype.up = function () {
    this._direction = 'up';
};
Ghost.prototype.down = function () {
    this._direction = 'down';
};
Ghost.prototype.left = function () {
    this._direction = 'left';
};
Ghost.prototype.right = function () {
    this._direction = 'right';
};
Ghost.prototype.getArray = function () {
    var up = this._game.getMapb(this._posX, this._posY - 1);
    var left = this._game.getMapb(this._posX - 1, this._posY);
    var right = this._game.getMapb(this._posX + 1, this._posY);
    var down = this._game.getMapb(this._posX, this._posY + 1);
    var array = [];
    if (up) {
        array.push('up');
    }
    if (left) {
        array.push('left');
    }
    if (right) {
        array.push('right');
    }
    if (down) {
        array.push('down');
    }
    return array;
};


function Blinky(game) {
    Ghost.call(this, 'blinky', 'up', 1, game, 13, 8, 23, 0, 'red');
}
Blinky.prototype = Object.create(Ghost.prototype);
Blinky.prototype.constructor = Blinky;
Blinky.prototype.aiChase = function () {
    this._pacX = this._game.pacman.posX;
    this._pacY = this._game.pacman.posY;
    var array2 = this.getArray();
    switch (this._direction) {
    case 'up':
        for (var x in array2) {
            if ((this._pacX > this._posX && array2[x] === 'right') || (array2.length == 2 && array2[x] === 'right')) {
                this.right();
                break;
            } else if ((this._pacX < this._posX && array2[x] === 'left') || (array2.length == 2 && array2[x] === 'left')) {
                this.left();
                break;
            } else if (array2[x] === 'up' && this.collision()) {
                this.up();
            } else if (this.collision() === false) {
                this.left();
            }
        }

        break;
    case 'down':
        for (var x in array2) {
            if ((this._pacX > this._posX && array2[x] === 'right') || (array2.length == 2 && array2[x] === 'right')) {
                this.right();
                break;
            } else if ((this._pacX < this._posX && array2[x] === 'left') || (array2.length == 2 && array2[x] === 'left')) {
                this.left();
                break;
            } else if (array2[x] === 'down' && this.collision()) {
                this.down();
            } else if (this.collision() === false) {
                this.left();
            }
        }
        break;
    case 'left':
        for (var x in array2) {
            if ((this._pacY > this._posY && array2[x] === 'down') || (array2.length == 2 && array2[x] === 'down')) {
                this.down();
                break;
            } else if ((this._pacY < this._posY && array2[x] === 'up') || (array2.length == 2 && array2[x] === 'up')) {
                this.up();
                break;
            } else if (array2[x] === 'left' && this.collision()) {
                this.left();
            } else if (this.collision() === false) {
                this.up();
            }
        }
        break;
    case 'right':
        for (var x in array2) {
            if ((this._pacY > this._posY && array2[x] === 'down') || (array2.length == 2 && array2[x] === 'down')) {
                this.down();
                break;
            } else if ((this._pacY < this._posY && array2[x] === 'up') || (array2.length == 2 && array2[x] === 'up')) {
                this.up();
                break;
            } else if (array2[x] === 'right' && this.collision()) {
                this.right();
            } else if (this.collision() === false) {
                this.up();
            }
        }
        break;
    }
};

function Pinky(game) {
    Ghost.call(this, 'pinky', 'up', 1, game, 12, 8, 3, 0, 'pink');
}
Pinky.prototype = Object.create(Ghost.prototype);
Pinky.prototype.constructor = Pinky;
Pinky.prototype.setPosPac = function () {
    switch (this._game.pacman.direction) {
    case 'up':
        this._pacX = (this._game.pacman.posX - 4 < 1) ? this._game.pacman.posX : this._game.pacman.posX - 4;
        this._pacY = (this._game.pacman.posY - 4 < 1) ? this._game.pacman.posY : this._game.pacman.posY - 4;
        break;
    case 'down':
        this._pacY = (this._game.pacman.posY + 4 > 21) ? this._game.pacman.posY : this._game.pacman.posY + 4;
        this._pacX = this._game.pacman.posX;
        break;
    case 'left':
        this._pacX = (this._game.pacman.posX - 4 < 1) ? this._game.pacman.posX : this._game.pacman.posX - 4;
        this._pacY = this._game.pacman.posY;
        break;
    case 'right':
        this._pacX = (this._game.pacman.posX + 4 > 25) ? this._game.pacman.posX : this._game.pacman.posX + 4;
        this._pacY = this._game.pacman.posY;
        break;
    }
};
Pinky.prototype.aiChase = function () {
    this.setPosPac();
    var array = this.getArray();
    switch (this._direction) {
    case 'up':
        for (var x in array) {
            if ((this._pacX > this._posX && array[x] === 'right') || (array.length == 2 && array[x] === 'right')) {
                this.right();
                break;
            } else if (this._pacX < this._posX && array[x] === 'left' || (array.length == 2 && array[x] === 'left')) {
                this.left();
                break;
            } else if (array[x] === 'up' && this.collision()) {
                this.up();
            } else if (this.collision() === false) {
                this.left();
            }
        }

        break;
    case 'down':
        for (var x in array) {
            if ((this._pacX > this._posX && array[x] === 'right') || (array.length == 2 && array[x] === 'right')) {
                this.right();
                break;
            } else if (this._pacX < this._posX && array[x] === 'left' || (array.length == 2 && array[x] === 'left')) {
                this.left();
                break;
            } else if (array[x] === 'down' && this.collision()) {
                this.down();
            } else if (this.collision() === false) {
                this.right();
            }
        }

        break;
    case 'left':
        for (var x in array) {
            if ((this._pacY > this._posY && array[x] === 'down') || (array.length == 2 && array[x] === 'down')) {
                this.down();
                break;
            } else if (this._pacY < this._posY && array[x] === 'up' || (array.length == 2 && array[x] === 'up')) {
                this.up();
                break;
            } else if (array[x] === 'left' && this.collision()) {
                this.left();
            } else if (this.collision() === false) {
                this.up();
            }
        }
        break;
    case 'right':
        for (var x in array) {
            if ((this._pacY > this._posY && array[x] === 'down') || (array.length == 2 && array[x] === 'down')) {
                this.down();
                break;
            } else if (this._pacY < this._posY && array[x] === 'up' || (array.length == 2 && array[x] === 'up')) {
                this.up();
                break;
            } else if (array[x] === 'right' && this.collision()) {
                this.right();
            } else if (this.collision() === false) {
                this.down();
            }
        }
        break;
    }
};

function Inky(game) {
    Ghost.call(this, 'inky', 'up', 1, game, 13, 8, 23, 18, 'cyan');
    this.targetX = 0;
    this.targetY = 0;
}
Inky.prototype = Object.create(Ghost.prototype);
Inky.prototype.constructor = Inky;
Inky.prototype.aiChase = function () {
    switch(this._game.pacman.direction) {
        case 'up':
            this._pacX = this._game.pacman.posX; 
            this._pacY = this._game.pacman.posY-2;
            break;
        case 'down':
            this._pacX = this._game.pacman.posX; 
            this._pacY = this._game.pacman.posY+2;
            break;
        case 'left':
            this._pacX = this._game.pacman.posX-2; 
            this._pacY = this._game.pacman.posY;
            break;
        case 'right':
            this._pacX = this._game.pacman.posX+2; 
            this._pacY = this._game.pacman.posY;
            break;
    }
    if(this._posX <= this._pacX) {
        this.targetX = (this._pacX - this._posX) + this._pacX;
        if(this._posY < this._pacY){
            this.targetY = (this._pacY - this._posY) + this._pacY;
        }else {
            this.targetY = (this._posY - this._pacY) - this._pacY;
        }
    } else if(this._posY <= this._pacY) {
        this.targetX = (this._posX - this._pacX) - this._pacX;
        this.targetY = (this._pacY - this._posY) + this._pacY;
    }else {
        this.targetX = (this._posX - this._pacX) - this._pacX;
        this.targetY = (this._posY - this._pacY) - this._pacY;
    }
    
    var array = this.getArray();
    switch (this._direction) {
    case 'up':
        for (var x in array) {
            if ((this.targetX > this._posX && array[x] === 'right') || (array.length == 2 && array[x] === 'right')) {
                this.right();
                break;
            } else if ((this.targetX < this._posX && array[x] === 'left') || (array.length == 2 && array[x] === 'left')) {
                this.left();
                break;
            } else if (array[x] === 'up' && this.collision()) {
                this.up();
            } else if (this.collision() === false) {
                this.left();
            }
        }

        break;
    case 'down':
        for (var x in array) {
            if ((this.targetX > this._posX && array[x] === 'right') || (array.length == 2 && array[x] === 'right')) {
                this.right();
                break;
            } else if ((this.targetX < this._posX && array[x] === 'left') || (array.length == 2 && array[x] === 'left')) {
                this.left();
                break;
            } else if (array[x] === 'down' && this.collision()) {
                this.down();
            } else if (this.collision() === false) {
                this.left();
            }
        }
        break;
    case 'left':
        for (var x in array) {
            if ((this.targetY > this._posY && array[x] === 'down') || (array.length == 2 && array[x] === 'down')) {
                this.down();
                break;
            } else if ((this.targetY < this._posY && array[x] === 'up') || (array.length == 2 && array[x] === 'up')) {
                this.up();
                break;
            } else if (array[x] === 'left' && this.collision()) {
                this.left();
            } else if (this.collision() === false) {
                this.up();
            }
        }
        break;
    case 'right':
        for (var x in array) {
            if ((this.targetY > this._posY && array[x] === 'down') || (array.length == 2 && array[x] === 'down')) {
                this.down();
                break;
            } else if ((this.targetY < this._posY && array[x] === 'up') || (array.length == 2 && array[x] === 'up')) {
                this.up();
                break;
            } else if (array[x] === 'right' && this.collision()) {
                this.right();
            } else if (this.collision() === false) {
                this.up();
            }
        }
        break;
    }
};

function Clyde(game) {
    Ghost.call(this, 'clyde', 'up', 1, game, 13, 8, 5, 18, 'orange');
}
Clyde.prototype = Object.create(Ghost.prototype);
Clyde.prototype.constructor = Clyde;
Clyde.prototype.aiChase = function () {
    var array = this.getArray();
    this._pacX = this._game.pacman.posX;
    this._pacY = this._game.pacman.posY;
    var difX = Math.abs(this._pacX - this._posX);
    var difY = Math.abs(this._pacY - this._posY);

    switch (this._direction) {
    case 'up':
        for (var x in array) {
            if ((difX >= 8 || difY >= 8) || (difX >= 8 && difY >= 8)) {
                if ((this._pacX > this._posX && array[x] === 'right') || (array.length == 2 && array[x] === 'right')) {
                    this.right();
                    break;
                } else if ((this._pacX < this._posX && array[x] === 'left') || (array.length == 2 && array[x] === 'left')) {
                    this.left();
                    break;
                } else if (array[x] === 'up' && this.collision()) {
                    this.up();
                } else if (this.collision() === false) {
                    this.left();
                }
            } else {
                if ((this._fixedX > this._posX && array[x] === 'right') || (array.length == 2 && array[x] === 'right')) {
                    this.right();
                    break;
                } else if ((this._fixedX < this._posX && array[x] === 'left') || (array.length == 2 && array[x] === 'left')) {
                    this.left();
                    break;
                } else if (array[x] === 'up' && this.collision()) {
                    this.up();
                }else if (this.collision() === false) {
                    this.left();
                }
            }
        }
        break;
    case 'down':
        for (var x in array) {
            if ((difX >= 8 || difY >= 8) || (difX >= 8 && difY >= 8)) {
                if ((this._pacX > this._posX && array[x] === 'right') || (array.length == 2 && array[x] === 'right')) {
                    this.right();
                    break;
                } else if ((this._pacX < this._posX && array[x] === 'left') || (array.length == 2 && array[x] === 'left')) {
                    this.left();
                    break;
                } else if (array[x] === 'down' && this.collision()) {
                    this.down();
                } else if (this.collision() === false) {
                    this.left();
                }
            } else {
                if ((this._fixedX > this._posX && array[x] === 'right') || (array.length == 2 && array[x] === 'right')) {
                    this.right();
                    break;
                } else if ((this._fixedX < this._posX && array[x] === 'left') || (array.length == 2 && array[x] === 'left')) {
                    this.left();
                    break;
                } else if (array[x] === 'down' && this.collision()) {
                    this.down();
                }else if (this.collision() === false) {
                    this.right();
                }
            }
        }
        break;
    case 'left':
        for (var x in array) {
            if ((difX >= 8 || difY >= 8) || (difX >= 8 && difY >= 8)) {
                if ((this._pacY > this._posY && array[x] === 'down') || (array.length == 2 && array[x] === 'down')) {
                    this.down();
                    break;
                } else if ((this._pacY < this._posY && array[x] === 'up') || (array.length == 2 && array[x] === 'up')) {
                    this.up();
                    break;
                } else if (array[x] === 'left' && this.collision()) {
                    this.left();
                } else if (this.collision() === false) {
                    this.up();
                }
            } else {
                if ((this._fixedY > this._posY && array[x] === 'down') || (array.length == 2 && array[x] === 'down')) {
                    this.down();
                    break;
                } else if ((this._fixedY < this._posY && array[x] === 'up') || (array.length == 2 && array[x] === 'up')) {
                    this.up();
                    break;
                } else if (array[x] === 'left' && this.collision()) {
                    this.left();
                }else if (this.collision() === false) {
                    this.up();
                }
            }
        }
        break;
    case 'right':
        for (var x in array) {
            if ((difX >= 8 || difY >= 8) || (difX >= 8 && difY >= 8)) {
                if ((this._pacY > this._posY && array[x] === 'down') || (array.length == 2 && array[x] === 'down')) {
                    this.down();
                    break;
                } else if ((this._pacY < this._posY && array[x] === 'up') || (array.length == 2 && array[x] === 'up')) {
                    this.up();
                    break;
                } else if (array[x] === 'right' && this.collision()) {
                    this.right();
                } else if (this.collision() === false) {
                    this.up();
                }
            } else {
                if ((this._fixedY > this._posY && array[x] === 'down') || (array.length == 2 && array[x] === 'down')) {
                    this.down();
                    break;
                } else if ((this._fixedY < this._posY && array[x] === 'up') || (array.length == 2 && array[x] === 'up')) {
                    this.up();
                    break;
                } else if (array[x] === 'right' && this.collision()) {
                    this.right();
                }else if (this.collision() === false) {
                    this.down();
                }
            }
        }
        break;
    }


};

/**
 *@constructor
 */
function Tile(name, size, color, bool) {
    this._name = name;
    this._size = size;
    this._color = color;
    this._isPassable = bool;
}
Tile.prototype.draw = function (x, y) {
    context.beginPath();
    context.fillStyle = this._color;
    context.fillRect(x, y, this._size, this._size);
    context.closePath();
};
Object.defineProperties(Tile.prototype, {
    name: {
        get : function () {
            return this._name;
        },
        set : function (value) {
            this._name = value;
        }
    }
});

/**
 *@constructor
 */
function Map() {
    var wall = new Tile('wall', 25, 'darkblue', false);
    var dot = new Tile('dot', 4, 'beige', true);
    var pill = new Tile('pill', 6, 'beige', true);
    var gSpace = new Tile('gSpace', 25, 'black', false);
    var blank = new Tile('blank', 25, 'black', true);
    this.getBlank = function () {
        return blank;
    };
    this._dataMap = [
            [wall, wall, wall, wall, wall, wall, wall, wall, wall, wall, wall, wall, wall, wall, wall, wall, wall, wall, wall, wall, wall, wall, wall, wall, wall, wall], //0
            [wall, pill, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, wall, wall, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, pill, wall], //1
            [wall, dot, wall, wall, wall, dot, wall, wall, wall, wall, wall, dot, wall, wall, dot, wall, wall, wall, wall, wall, dot, wall, wall, wall, dot, wall], //2
            [wall, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, wall], //3
            [wall, dot, wall, wall, wall, dot, wall, wall, dot, wall, wall, wall, wall, wall, wall, wall, wall, dot, wall, wall, dot, wall, wall, wall, dot, wall], //4
            [wall, dot, dot, dot, dot, dot, wall, wall, dot, dot, dot, dot, wall, wall, dot, dot, dot, dot, wall, wall, dot, dot, dot, dot, dot, wall], //5
            [wall, wall, wall, wall, wall, dot, wall, wall, wall, wall, wall, dot, wall, wall, dot, wall, wall, wall, wall, wall, dot, wall, wall, wall, wall, wall], //6
            [wall, wall, wall, wall, wall, dot, wall, wall, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, wall, wall, dot, wall, wall, wall, wall, wall], //7
            [wall, wall, wall, wall, wall, dot, wall, wall, dot, wall, wall, wall, gSpace, gSpace, wall, wall, wall, dot, wall, wall, dot, wall, wall, wall, wall, wall], //8
            [wall, wall, wall, wall, wall, dot, dot, dot, dot, wall, gSpace, gSpace, gSpace, gSpace, gSpace, gSpace, wall, dot, dot, dot, dot, wall, wall, wall, wall, wall], //9
            [wall, wall, wall, wall, wall, dot, wall, wall, dot, wall, gSpace, gSpace, gSpace, gSpace, gSpace, gSpace, wall, dot, wall, wall, dot, wall, wall, wall, wall, wall], //10
            [wall, wall, wall, wall, wall, dot, wall, wall, dot, wall, wall, wall, wall, wall, wall, wall, wall, dot, wall, wall, dot, wall, wall, wall, wall, wall], //11
            [wall, wall, wall, wall, wall, dot, wall, wall, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, wall, wall, dot, wall, wall, wall, wall, wall], //12
            [wall, wall, wall, wall, wall, dot, wall, wall, dot, wall, wall, wall, wall, wall, wall, wall, wall, dot, wall, wall, dot, wall, wall, wall, wall, wall], //13
            [wall, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, wall, wall, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, wall], //14
            [wall, dot, wall, wall, wall, dot, wall, wall, wall, wall, wall, dot, wall, wall, dot, wall, wall, wall, wall, wall, dot, wall, wall, wall, dot, wall], //15
            [wall, dot, dot, dot, wall, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, wall, dot, dot, dot, wall], //16
            [wall, wall, wall, dot, wall, dot, wall, wall, dot, wall, wall, wall, wall, wall, wall, wall, wall, dot, wall, wall, dot, wall, dot, wall, wall, wall], //17
            [wall, dot, dot, dot, dot, dot, wall, wall, dot, dot, dot, dot, wall, wall, dot, dot, dot, dot, wall, wall, dot, dot, dot, dot, dot, wall], //18
            [wall, dot, wall, wall, wall, wall, wall, wall, wall, wall, wall, dot, wall, wall, dot, wall, wall, wall, wall, wall, wall, wall, wall, wall, dot, wall], //19
            [wall, pill, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, pill, wall], //20
            [wall, wall, wall, wall, wall, wall, wall, wall, wall, wall, wall, wall, wall, wall, wall, wall, wall, wall, wall, wall, wall, wall, wall, wall, wall, wall], //21
    ];
    this._width = 650; //dar valor
    this._height = 550;
    this._cellSize = 25; //dar valor
}
Map.prototype.draw = function () {
    var x = 0;
    var y = 0;
    context.beginPath();
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < this._dataMap.length; i++) {
        for (var j = 0; j < this._dataMap[i].length; j++) {
            if (this._dataMap[i][j]._name === 'wall' || this._dataMap[i][j].name === 'gSpace' || this._dataMap[i][j].name === 'blank') {
                this._dataMap[i][j].draw(x, y);
            } else {
                this._dataMap[i][j].draw((x + 12), (y + 12));
            }
            x += this._cellSize;
        }
        x = 0;
        y += this._cellSize;
    }
    context.closePath();
};

/**
 *@constructor
 */
function Game() {
    this.pacman = new Pacman('pacman', 13, 12, 'yellow', this); //cambiar coordenadas
    this.mapa = new Map();
    this.pacNextDir = "left";
    this.pacMove = this.pacman.collision();
    this.blinky = new Blinky(this);
    this.pinky = new Pinky(this);
    this.clyde = new Clyde(this);
    this.inky = new Inky(this);
    this.count = 0;
    this.ghostArray = [this.blinky, this.pinky, this.inky, this.clyde];
    this.gc = 1;//ghost count
    this.clear = function () {
        clearInterval(interval);
        this.pacman.reset();
        this.blinky.reset();
        this.pinky.reset();
        this.inky.reset();
        this.clyde.reset();
        this.pacman.life = this.pacman.life -1;
        this.pacNextDir = 'left';
        window.onkeydown = null;
        window.onkeydown = getkey;
        setTimeout(startGame, 1000);
    };
    
}
Game.prototype.checkPacman = function () {
    if (this.pacman.state === true || this.pacMove === false) {
        this.pacman.direction = this.pacNextDir;
    }
};
Game.prototype.gameOver = function () {
    if(this.blinky.posX === this.pacman.posX && this.blinky.posY === this.pacman.posY && this.blinky.mode !== 3){
        this.clear();
    }else if(this.pinky.posX === this.pacman.posX && this.pinky.posY === this.pacman.posY && this.pinky.mode !== 3) {
        this.clear();
    }else if(this.clyde.posX === this.pacman.posX && this.clyde.posY === this.pacman.posY && this.clyde.mode !== 3) {
        this.clear();
    }else if(this.inky.posX === this.pacman.posX && this.inky.posY === this.pacman.posY && this.inky.mode !== 3) {
        this.clear();
    }

};
Game.prototype.checkDanger = function () {
        if(this.blinky.posX === this.pacman.posX && this.blinky.posY === this.pacman.posY && this.blinky.mode === 3) {
            this.gc++;
            this.pacman.calcScore(Math.pow(2, this.gc)*100);
            clearInterval(interval);
            this.blinky.reset();
            setTimeout(startGame, 1000/75);
        }
    if(this.pinky.posX === this.pacman.posX && this.pinky.posY === this.pacman.posY && this.pinky.mode === 3) {
            this.gc++;
            this.pacman.calcScore(Math.pow(2, this.gc)*100);
            clearInterval(interval);
            this.pinky.reset();
            setTimeout(startGame, 1000/75);
        }
    if(this.clyde.posX === this.pacman.posX && this.clyde.posY === this.pacman.posY && this.clyde.mode === 3) {
            this.gc++;
            this.pacman.calcScore(Math.pow(2, this.gc)*100);
            clearInterval(interval);
            this.clyde.reset();
            setTimeout(startGame, 1000/75);
        }
    if(this.inky.posX === this.pacman.posX && this.inky.posY === this.pacman.posY && this.inky.mode === 3) {
            this.gc++;
            this.pacman.calcScore(Math.pow(2, this.gc)*100);
            clearInterval(interval);
            this.inky.reset();
            setTimeout(startGame, 1000/75);
        }
    if(this.blinky._mode !== 3 && this.pinky._mode !== 3 && this.inky._mode !== 3 && this.clyde._mode !== 3) {
        this.gc = 0;
    }
    
};
Game.prototype.updateWorld = function () {
    this.gameOver();
    this.pacMove = this.pacman.collision();
    this.blinky.update();
    if(this.pacman.dotsCount >= 5) {
    this.pinky.update();
    }
    if(this.pacman.dotsCount >= 30){
        this.inky.update();
    }
    if(this.pacman.dotsCount >= 75) {
    this.clyde.update();
    }
    this.pacman.update();
    this.blinky.changeMode();
    this.inky.changeMode();
    this.clyde.changeMode();
    this.pinky.changeMode();
    
    this.checkDanger();
    this.checkPacman();
    
};
Game.prototype.drawWorld = function () {
    this.mapa.draw();
    this.pacman.draw();
    this.blinky.draw();
    this.pinky.draw();
    this.inky.draw();
    this.clyde.draw();
    if (this.pacman.life === 0) {
        context.beginPath();
        context.fillStyle = 'white';
        context.font = '35px Namco';
        context.fillText('game over', 100, 300);
        context.closePath();
        clearInterval(interval);
    }
};
Game.prototype.getMapb = function (x, y) {
    return this.mapa._dataMap[y][x]._isPassable;
};
Game.prototype.win = function () {
    var dots = 0;
    for(var i = 0; i < this.mapa.length; i++){
        for(var j = 0; j < this.mapa[i].length; j++){
            if(this.mapa[i][j].name === 'dot' || this.mapa[i][j].name ==='pill') {
                dots++;
            }
        }
    }
    if(dots === 0 && this.pacman.life !== 0){
        context.font = '50px Namco';
        context.fillText('you win', 200, 300);
        clearInterval(interval);
    }
};

/*===============Funciones Extras===============*/
function startGame() {
    interval = setInterval(function () {
        game.updateWorld();
        game.drawWorld();
        drawStatus();
    }, 1000 / 75);
}

function getkey(e) {
    switch (e.keyCode) {
    case 37:
        game.pacNextDir = "left";
        break;
    case 38:
        game.pacNextDir = "up";
        break;
    case 39:
        game.pacNextDir = "right";
        break;
    case 40:
        game.pacNextDir = "down";
        break;
    }
}

function drawStatus() {
    var score = game.pacman.score;
    var life = game.pacman.life;
    context.beginPath();
    context.font = '20px Namco';
    context.fillStyle = '#FFFFFF';
    context.fillText('score', 700, 200);
    context.fillText(score, 700, 250);
    context.fillText('lives', 700, 300);
    context.fillText(life, 700, 350);
    context.closePath();
    
}

/*===============Variables Globales===============*/
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
window.onkeydown = getkey;
var game = new Game();
var interval;
startGame();


