(function($) {
	'use strict';

	function View() {
		var gridSize = 10;
		var model = this.model = new window.GameOfLife.Model();

		var init = function() {
			var dimensions = measureWorld();
			if (model.getCountX() !== dimensions[0] ||
				model.getCountY() !== dimensions[1]) {
			    model.setDimension(dimensions[0], dimensions[1]);
				createWorld();
			}
		};

		var measureWorld = function() {
			var totalHeight = $(window).innerHeight() -
			                  $('#header').outerHeight();
			var totalWidth = $('#world').innerWidth();
			var countX = Math.round(totalWidth / gridSize);
			var countY = Math.round(totalHeight / gridSize);

		    $('#world').css({ height: totalHeight });
		   	return [countX, countY];
		};

		var createWorld = function() {
			var grid = '<table><tbody><tr>';
			model.iterateCells(
				function(x, y) { grid += createCell(x, y); },
				function() { grid = appendRow(grid); });
			grid += '</tr></tbody></table>';
			$('#world').html(grid);
		};

		var createCell = function(x, y) {
			var td = '<td id="cell_' + x + '_' + y + '"';
			if (model.isActive(x, y)) {
				td += ' class="on"';
			}
			td += '> </td>';
			return td;
		};

		var appendRow = function(grid) {
			if (grid !== '<table><tbody><tr>') {
				grid += '</tr></tr>';
			}
			return grid;
		};

		var toggleCell = function(cell, state) {
			var match = /^cell_(\d+)_(\d+)$/.exec(cell.id);
			return model.toggleCell(match[1], match[2], state);
		};

		var updateCell = function(x, y, state) {
			var cell = $('#cell_' + x + '_' + y);
			if (state) { cell.addClass('on'); }
		    else { cell.removeClass('on'); }
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
	    	$(model).on('cell.update', function(event, x, y, state) {
		    	updateCell(x, y, state);
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
		        } else {
		    		model.start();
		    		$(this).html('Stop');
		    	}
		    });
	    };

	    var registerClearEvent = function() {
	    	$(document).on('click', '#cleaner', function() {
	    		model.clear();
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
		    registerClearEvent();
		    registerResizeEvent();
		};

		init();
		initEventHandlers();
    }

    window.GameOfLife.View = View;

})(jQuery);