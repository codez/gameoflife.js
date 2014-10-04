// immediate function for private scope
// only functions added to prototype will be public.
(function() {

    'use strict';

	function GameOfLife() {
     	var stepInterval = 100;
		var cells = [];
        var countX = 0, countY = 0;
        var runner = null;

        this.init = function(_countX, _countY) {
            // add new rows
            for (var y = countY; y < _countY; y++) {
                cells[y] = [];
            }
            // add new columns for all rows
            for (y = 0; y < _countY; y++) {
                for (var x = countX; x < countX; x++) {
                    cells[y][x] = false;
                }
            }
        	countX = _countX;
        	countY = _countY;
        };

        this.iterateCells = function(cellCallback, rowCallback) {
        	for (var y = 0; y < countY; y++) {
        		if (rowCallback) { rowCallback.apply(this, [y]); }
        		for (var x = 0; x < countX; x++) {
        			cellCallback.apply(this, [x, y]);
        		}
        	}
        };

        this.toggleCell = function(x, y, state) {
        	if (state === undefined) {
        		cells[y][x] = !cells[y][x];
    	    } else {
    	    	cells[y][x] = state;
    	    }
        	//$cell.trigger('cell.update', [cells[y][x]]);
        	return cells[y][x];
        };

        this.getCountX = function() {
            return countX;
        };

        this.getCountY = function() {
            return countY;
        };

        this.isActive = function(x, y) {
            return isActive(x, y);
        };

    	this.start = function() {
    		var _this = this;
    		runner = setInterval(
    			function() { _this.step(); },
    			stepInterval);

    	};

    	this.stop = function() {
    		if (runner) {
    			clearInterval(runner);
    			runner = null;
    		}
    	};

    	this.isRunning = function() {
    		return runner !== null;
    	};

    	this.step = function() {
    		var result = [];
    		this.iterateCells(
    			function(x, y) { computeResultCell(result, x, y); },
    			function(y) { result[y] = []; });

    	    cells = result;
    	};

    	var computeResultCell = function(result, x, y) {
    		var count = countNeighbours(x, y);

            if (count === 3) {
            	result[y][x] = true;
            	if (!cells[y][x]) {
            		$('#' + x + '_' + y).trigger('cell.update', [true]);
            	}
            } else if (count === 4) {
            	result[y][x] = cells[y][x];
            } else {
            	result[y][x] = false;
            	if (cells[y][x]) {
            		$('#' + x + '_' + y).trigger('cell.update', [false]);
            	}
            }
    	};

    	var countNeighbours = function(x, y) {
    		var amount = 0;

            if (isActive(x-1, y-1)) { amount++; }
            if (isActive(x,   y-1)) { amount++; }
            if (isActive(x+1, y-1)) { amount++; }
            if (isActive(x-1, y  )) { amount++; }
            if (isActive(x  , y  )) { amount++; }
            if (isActive(x+1, y  )) { amount++; }
            if (isActive(x-1, y+1)) { amount++; }
            if (isActive(x,   y+1)) { amount++; }
            if (isActive(x+1, y+1)) { amount++; }

            return amount;
    	};

        var isActive = function(x, y) {
            if (y < 0)       { y = countY - 1; }
            if (y >= countY) { y = 0; }
            if (x < 0)       { x = countX - 1; }
            if (x >= countX) { x = 0; }

            return cells[y][x];
        };
    }

    window.GameOfLife = {
    	Model: GameOfLife
    };


})(); // immediate function