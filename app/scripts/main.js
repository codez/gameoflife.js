$(function() {
	'use strict';


	function GameOfLife() {
		this.gridSize = 10;
		this.stepInterval = 100;
		this.cells = [];
	};

    GameOfLife.prototype.init = function() {
		console.log('init world');

		this.measureWorld();
		this.initModel();
		this.initWorld();
		this.initEventHandlers();
	};

	GameOfLife.prototype.measureWorld = function() {
		var totalHeight = $(window).innerHeight() - $('#header').outerHeight();
		var totalWidth = $('#world').innerWidth();
		this.countX = Math.round(totalWidth / this.gridSize);
		this.countY = Math.round(totalHeight / this.gridSize);

		console.log('world is ' + totalWidth + 'x' + totalHeight)
		console.log('create ' + this.countX + 'x' + this.countY + ' cells');

        $('#world').css({ height: totalHeight });
	};

    GameOfLife.prototype.initModel = function() {
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

    GameOfLife.prototype.initWorld = function() {
    	var row;
    	this.iterateCells(
    		function(x, y) {
    			row.append('<td id="' + x + '_' + y +
					       '" data-x="' + x +
					       '" data-y="' + y + '"></td>');
    		},
    		function() {
    			$('#world table tbody').append('<tr></tr>');
    			row = $('#world table tbody tr:last-child');
    		});
	};

    GameOfLife.prototype.initEventHandlers = function() {
    	var _this = this;
    	$(window).resize(function() {   });

	    $(document).on('click', '#world td', function() {
	    	_this.toggleCell(this);
	    });

	    $(document).on('cell.update', '#world td', function(event, state) {
	    	if (state) { $(this).addClass('on'); }
	    	else { $(this).removeClass('on'); }
	    });

	    $(document).on('click', '#stepper', function(event) {
	    	_this.step();
	    })

	    $(document).on('click', '#starter', function(event) {
	    	if (_this.runner) {
	    	   _this.stop();
	    	   $(this).html('Start');
	        }
	    	else {
	    		_this.start();
	    		$(this).html('Stop');
	    	}
	    })
    };

    GameOfLife.prototype.toggleCell = function(cell) {
    	var $cell = $(cell);
    	var x = $cell.data('x');
    	var y = $cell.data('y');
    	this.cells[y][x] = !this.cells[y][x];
    	$cell.trigger('cell.update', [this.cells[y][x]]);
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

	GameOfLife.prototype.step = function() {
		var result = [];
		this.iterateCells(
			function(x, y) {
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
			},
			function(y) { result[y] = []; });

	    this.cells = result;
	};

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


	window.gameOfLife = new GameOfLife();
	window.gameOfLife.init();


});