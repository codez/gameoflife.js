/* global describe, it */

(function () {
  'use strict';

  describe('Game of Life model', function () {
  	var model;

  	beforeEach(function() {
  		model = new window.GameOfLife.Model();
    	model.setDimension(15, 10);
   	});

    describe('.setDimension', function () {
      it('updates count x and y', function () {
      	expect(model.getCountX()).to.equal(15);
      	expect(model.getCountY()).to.equal(10);
      });

      it('initializes cells', function () {
      	expect(model.isActive(0, 0)).to.equal(false);
      	expect(model.isActive(2, 1)).to.equal(false);
      });

      it('updates cells when growing', function () {
      	model.toggleCell(14, 9, true);
      	model.setDimension(30, 20);
      	expect(model.isActive(14, 9)).to.equal(true);
      	expect(model.isActive(14, 10)).to.equal(false);
      	expect(model.isActive(15, 9)).to.equal(false);
      });
    });

    describe('.toggleCell', function() {
    	it('sets and returns given state true', function() {
    		var result = model.toggleCell(2, 1, true);
    		expect(result).to.be.true;
    		expect(model.isActive(2, 1)).to.be.true;
    	});

    	it('sets and returns given state false', function() {
    		var result = model.toggleCell(2, 1, false);
    		expect(result).to.be.false;
    		expect(model.isActive(2, 1)).to.be.false;
    	});

    	it('toggles state and returns result', function() {
    		var result = model.toggleCell(2, 1);
    		expect(result).to.be.true;
    		expect(model.isActive(2, 1)).to.be.true;
    		result = model.toggleCell(2, 1);
    		expect(result).to.be.false;
    		expect(model.isActive(2, 1)).to.be.false;
    	});
    });

    describe('.iterateCells', function() {
    	it('iterates in set dimensions', function() {
    		var rowCount = 0,
    		    cellCount = 0;
    		model.iterateCells(function() { cellCount++; },
    			               function() { rowCount++; });
    		expect(rowCount).to.eq(10);
    		expect(cellCount).to.eq(150);
    	});


    	it('iterates in shrinked dimensions', function() {
    		var rowCount = 0,
    		    cellCount = 0;
    		model.setDimension(3, 2);
    		model.iterateCells(function() { cellCount++; },
    			               function() { rowCount++; });
    		expect(rowCount).to.eq(2);
    		expect(cellCount).to.eq(2 * 3);
    	});
    });

    describe('.isActive', function() {
    	it('returns cell value', function() {
    		expect(model.isActive(2, 1)).to.be.false;
    	});

    	it('throws error when out of scope', function() {
    		var fn = function() { model.isActive(15, 10); };
    		expect(fn).to.throw(RangeError);
    	});

    	it('throws error when out of scope after shrink', function() {
    		expect(model.isActive(10, 5)).to.be.false;
    		model.setDimension(10, 5);
    		var fn = function() { model.isActive(15, 10); };
    		expect(fn).to.throw(RangeError);
    	});
    });

    describe('running', function() {
    	it('is possible to start and stop', function() {
    		expect(model.isRunning()).to.be.false;
    		model.start();
    		expect(model.isRunning()).to.be.true;
    		model.stop();
    		expect(model.isRunning()).to.be.false;
    	});
    });

    describe('stepping', function() {
    	var activateCells = function(cells) {
    		for (var i = 0; i < cells.length; i++) {
    			model.toggleCell(cells[i][0], cells[i][1], true);
    		}
    	};

    	var checkActiveCells = function(cells) {
    		model.iterateCells(function(x, y) {
    			var active = false;
    			for (var i = 0; i < cells.length; i++) {
    				if (cells[i][0] === x && cells[i][1] === y) {
    					active = true;
    					break;
    				}
    			}
    			var msg =  x + '/' + y + ' should be ' + active;
    			expect(model.isActive(x, y), msg).to.eq(active);
    		});
    	};

    	it('advances glider around the edge', function() {
    		activateCells([[1,1], [2,1], [3,1], [3,2], [2,3]]);
    		model.step();
    		checkActiveCells([[2,0], [2,1], [3,1], [1,2], [3,2]]);
    		model.step();
    		checkActiveCells([[2,0], [3,0], [1,1], [3,1], [3,2]]);
    		model.step();
    		checkActiveCells([[2,0], [3,0], [3,1], [4,1], [2,2]]);
    		model.step();
    		checkActiveCells([[2,0], [3,0], [4,0], [4,1], [3,2]]);
    		model.step();
    		checkActiveCells([[3,9], [3,0], [4,0], [2,1], [4,1]]);
    		model.step();
    		checkActiveCells([[3,9], [4,9], [2,0], [4,0], [4,1]]);
    		model.step();
    		checkActiveCells([[3,9], [4,9], [4,0], [5,0], [3,1]]);
    		model.step();
    		checkActiveCells([[3,9], [4,9], [5,9], [5,0], [4,1]]);
    		model.step();
    		checkActiveCells([[4,8], [4,9], [5,9], [3,0], [5,0]]);
    	});
    });
  });
})();
