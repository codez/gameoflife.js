(function() {
	'use strict';

	function View() {
		var gridSize = 10;
		var model = new window.GameOfLife.Model();

		var init = function() {
			var dimensions = measureWorld();
			if (model.getCountX() !== dimensions[0] ||
				model.getCountY !== dimensions[1]) {
			    model.init(dimensions[0], dimensions[1]);
				createWorld();
			}
		};

		var measureWorld = function() {
			var totalHeight = $(window).innerHeight() - $('#header').outerHeight();
			var totalWidth = $('#world').innerWidth();
			var countX = Math.round(totalWidth / gridSize);
			var countY = Math.round(totalHeight / gridSize);

			console.log('world is ' + totalWidth + 'x' + totalHeight);
			console.log('create ' + countX + 'x' + countY + ' cells');

		    $('#world').css({ height: totalHeight });

		   	return [countX, countY];
		};

		var createWorld = function() {
			var grid = '<tr>';
			model.iterateCells(
				function(x, y) { grid += createCell(x, y); },
				function() { grid = appendRow(grid); });
			grid += '</tr>';
			$('#world table tbody').html(grid);
		};

		var createCell = function(x, y) {
			var td = '<td id="' + x + '_' + y +
				       '" data-x="' + x +
				       '" data-y="' + y + '"';
			if (model.isActive(x, y)) {
				td += ' class="on"';
			}
			td += '></td>';
			return td;
		};

		var appendRow = function(grid) {
			if (grid !== '<tr>') {
				grid += '</tr></tr>';
			}
			return grid;
		};

		var toggleCell = function(cell, state) {
			var $cell = $(cell);
			var x = $cell.data('x');
			var y = $cell.data('y');
			var newState = model.toggleCell(x, y, state);
			updateCell(cell, newState);
			return newState;
		};

		var updateCell = function(cell, state) {
			if (state) { $(cell).addClass('on'); }
		    else { $(cell).removeClass('on'); }
		};

		var registerCellDrawEvents = function() {
	    	var activate;
	    	$(document).on('mousedown', '#world td', function() {
	    		activate = toggleCell(this);
	    	}).on('mouseup', function() {
	    		activate = undefined;
	    	}).on('mouseenter', '#world td', function() {
	    		if (activate !== undefined) {
	    		  toggleCell(this, activate);
	    		}
	    	});
	    };

	    var registerCellUpdateEvent = function() {
	    	$(document).on('cell.update', '#world td', function(event, state) {
		    	updateCell(this, state);
		    });
	    };

	    var registerStepEvent = function() {
	    	$(document).on('click', '#stepper', function() {
		    	model.step();
		    });
	    };

	    var registerStartStopEvent = function() {
	    	$(document).on('click', '#starter', function() {
		    	if (model.isRunning()) {
		    	   model.stop();
		    	   $(this).html('Start');
		        }
		    	else {
		    		model.start();
		    		$(this).html('Stop');
		    	}
		    });
	    };

	    var registerResizeEvent = function() {
	    	$(window).resize(function() {
	    		init();
	    	});
	    };

		var initEventHandlers = function() {
		    registerCellDrawEvents();
		    registerCellUpdateEvent();
		    registerStartStopEvent();
		    registerStepEvent();
		    registerResizeEvent();
		};

		init();
		initEventHandlers();
    }

    window.GameOfLife.View = View;

})();