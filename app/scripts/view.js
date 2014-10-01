$(function() {
	'use strict';

	function View() {
		this.gridSize = 10;
		this.model = new window.GameOfLife.Model();

		this.init();
	}

	View.prototype.init = function() {
		this.measureWorld();
		this.initWorld();
		this.initEventHandlers();
	}

	View.prototype.measureWorld = function() {
		var totalHeight = $(window).innerHeight() - $('#header').outerHeight();
		var totalWidth = $('#world').innerWidth();
		var countX = Math.round(totalWidth / this.gridSize);
		var countY = Math.round(totalHeight / this.gridSize);

		console.log('world is ' + totalWidth + 'x' + totalHeight)
		console.log('create ' + countX + 'x' + countY + ' cells');

        $('#world').css({ height: totalHeight });
        this.model.init(countX, countY);
	};

    View.prototype.initWorld = function() {
    	var row;
    	this.model.iterateCells(
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

	View.prototype.toggleCell = function(cell, state) {
		var $cell = $(cell);
    	var x = $cell.data('x');
    	var y = $cell.data('y');
		var newState = this.model.toggleCell(x, y, state);
		this.updateCell(cell, newState);
		return newState;
	}

	View.prototype.updateCell = function(cell, state) {
		if (state) { $(cell).addClass('on'); }
	    else { $(cell).removeClass('on'); }
	}

    View.prototype.initEventHandlers = function() {
    	var _this = this;
    	$(window).resize(function() {   });

	    (function() {
	    	var activate = undefined;
	    	$(document).on('mousedown', '#world td', function(event) {
	    		activate = _this.toggleCell(this);
	    	}).on('mouseup', function(event) {
	    		activate = undefined;
	    	}).on('mouseenter', '#world td', function(event) {
	    		if (activate != undefined) {
	    		  _this.toggleCell(this, activate);
	    		}
	    	});
	    })();

	    $(document).on('cell.update', '#world td', function(event, state) {
	    	_this.updateCell(this, state);
	    });

	    $(document).on('click', '#stepper', function(event) {
	    	_this.model.step();
	    })

	    $(document).on('click', '#starter', function(event) {
	    	if (_this.model.isRunning()) {
	    	   _this.model.stop();
	    	   $(this).html('Start');
	        }
	    	else {
	    		_this.model.start();
	    		$(this).html('Stop');
	    	}
	    })
    };

    window.GameOfLife.View = View;

});