// immediate function for private scope
// only functions added to prototype will be public.
(function() {

    'use strict';

	function GameOfLife() {
     	this.stepInterval = 100;
		this.cells = [];
	};

    GameOfLife.prototype.init = function(countX, countY) {
    	this.countX = countX;
    	this.countY = countY;

    	this.iterateCells(
    		function(x,y) { this.cells[y][x] = false; },
    		function(y) { this.cells[y] = []; });
    };

    GameOfLife.prototype.iterateCells = function(cellCallback, rowCallback) {
    	for (var y = 0; y < this.countY; y++) {
    		if (rowCallback) { rowCallback.apply(this, [y]); }
    		for (var x = 0; x < this.countX; x++) {
    			cellCallback.apply(this, [x, y]);
    		}
    	}
    };

    GameOfLife.prototype.toggleCell = function(x, y, state) {
    	if (state === undefined) {
    		this.cells[y][x] = !this.cells[y][x];
	    } else {
	    	this.cells[y][x] = state;
	    }
    	//$cell.trigger('cell.update', [this.cells[y][x]]);
    	return this.cells[y][x];
    };

	GameOfLife.prototype.start = function() {
		var _this = this;
		this.runner = setInterval(
			function() { _this.step(); },
			this.stepInterval);

	};

	GameOfLife.prototype.stop = function() {
		if (this.runner) {
			clearInterval(this.runner);
			this.runner = null;
		}
	};

	GameOfLife.prototype.isRunning = function() {
		return this.runner != null;
	}

	GameOfLife.prototype.step = function() {
		var result = [];
		this.iterateCells(
			function(x, y) { this.computeResultCell(result, x, y); },
			function(y) { result[y] = []; });

	    this.cells = result;
	};

	GameOfLife.prototype.computeResultCell = function(result, x, y) {
		var count = this.countNeighbours(x, y);

        if (count === 3) {
        	result[y][x] = true;
        	if (!this.cells[y][x]) {
        		$('#' + x + '_' + y).trigger('cell.update', [true])
        	}
        } else if (count === 4) {
        	result[y][x] = this.cells[y][x]
        } else {
        	result[y][x] = false;
        	if (this.cells[y][x]) {
        		$('#' + x + '_' + y).trigger('cell.update', [false])
        	}
        }
	}

	GameOfLife.prototype.countNeighbours = function(x, y) {
		var amount = 0;

        if (this.isActive(x-1, y-1)) amount++;
        if (this.isActive(x,   y-1)) amount++;
        if (this.isActive(x+1, y-1)) amount++;
        if (this.isActive(x-1, y  )) amount++;
        if (this.isActive(x  , y  )) amount++;
        if (this.isActive(x+1, y  )) amount++;
        if (this.isActive(x-1, y+1)) amount++;
        if (this.isActive(x,   y+1)) amount++;
        if (this.isActive(x+1, y+1)) amount++;

        return amount;
	};

	GameOfLife.prototype.isActive = function(x, y) {
		if (y < 0) y = this.countY - 1;
	    if (y >= this.countY) y = 0;
		if (x < 0) x = this.countX - 1;
	    if (x >= this.countX) x = 0;

        return this.cells[y][x];
    };

    window.GameOfLife = {
    	Model: GameOfLife
    };

})(); // immediate function