$(function() {
	function GameOfLife() {
		var gridSize = 20;

		this.init = function() {
			console.log('init world')

			var totalHeight = $(window).innerHeight() - $('#header').outerHeight();
			var totalWidth = $('#world').innerWidth();
			var countX = Math.round(totalWidth / gridSize);
			var countY = Math.round(totalHeight / gridSize);

			console.log('world is ' + totalWidth + 'x' + totalHeight)
			console.log('create ' + countX + 'x' + countY + ' cells');

	        $('#world').css({ height: totalHeight });

			for (y = 0; y < countY; y++) {
				$('#world table tbody').append('<tr></tr>');
				var row = $('#world table tbody tr:last-child');
				for (x = 0; x < countX; x++) {
					row.append('<td></td>');
				}
			}
		}

		this.start = function() {

		}
	}


	window.gameOfLife = new GameOfLife();
	window.gameOfLife.init();
	  $(window).resize(function(){

	  });
});