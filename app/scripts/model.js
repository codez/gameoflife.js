// immediate function for private scope
// only functions added to prototype will be public.
(function() {

    'use strict';

	function GameOfLife() {
     	var stepInterval = 100;
		var cells = [];
        var countX = 0, countY = 0;
        var runner = null;
        var that = this;

        this.setDimension = function(_countX, _countY) {
            // add new rows
            initCells(countY, _countY, 0, _countX);
            // add new columns
            initCells(0, _countY, countX, _countX);

        	countX = _countX;
        	countY = _countY;
        };

        this.iterateCells = function(cellCallback, rowCallback) {
        	for (var y = 0; y < countY; y++) {
        		if (rowCallback) { rowCallback(y); }
        		for (var x = 0; x < countX; x++) {
        			cellCallback(x, y);
        		}
        	}
        };

        this.toggleCell = function(x, y, state) {
            checkBounds(x, y);
        	if (state === undefined) {
        		cells[y][x] = !cells[y][x];
    	    } else {
    	    	cells[y][x] = state;
    	    }
        	$(this).trigger('cell.update', [x, y, cells[y][x]]);
        	return cells[y][x];
        };

        this.getCountX = function() {
            return countX;
        };

        this.getCountY = function() {
            return countY;
        };

        this.isActive = function(x, y) {
            checkBounds(x, y);
            return cells[y][x];
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
            //var start = new Date().getTime();
    		var result = [];
    		this.iterateCells(
    			function(x, y) { computeResultCell(result, x, y); },
    			function(y) { result[y] = []; });

    	    cells = result;
            //var stop = new Date().getTime();
            //console.log('step took ' + (stop - start));
    	};

        var initCells = function(startY, endY, startX, endX) {
            for (var y = startY; y < endY; y++) {
                if (!cells[y]) { cells[y] = [] };
                for (var x = startX; x < endX; x++) {
                    cells[y][x] = false;
                }
            }
        };

    	var computeResultCell = function(result, x, y) {
    		var count = countNeighbours(x, y);
            var newState = computeNewState(x, y, count);
            setResultCell(result, x, y, newState);
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

        var computeNewState = function(x, y, count) {
            if (count === 3) {
                return true;
            } else if (count === 4) {
                return cells[y][x];
            } else {
                return false;
            }
        };

        var setResultCell = function(result, x, y, state) {
            result[y][x] = state;
            if (state !== cells[y][x]) {
                $(that).trigger('cell.update', [x, y, state]);
            }
        };

        var checkBounds = function(x, y) {
            if (x < 0 || y < 0 || x >= countX || y >= countY) {
                throw new RangeError('values ' + x + '/' + y +
                                     ' are out of bounds');
            }
        }
    }

    window.GameOfLife = {
    	Model: GameOfLife
    };


})(); // immediate function