/* global describe, it */

(function () {
  'use strict';

  describe('Game of Life View', function () {
  	var view, model;

  	beforeEach(function() {
  		view = new window.GameOfLife.View();
  		model = view.model;
   	});

   	describe('.createWorld', function() {
   		it('builds table', function() {
   			expect($('#world td').size()).to.eq(
   				model.getCountX() * model.getCountY());
   		});
   	});

   	describe('.updateCell', function() {
   		it('toggles cell when model changes', function() {
   			expect(model.isActive(1, 1)).to.be.false;
   			model.toggleCell(1, 1);
   			expect($('#cell_1_1').hasClass('on')).to.be.true;
   			model.toggleCell(1, 1);
   			expect($('#cell_1_1').hasClass('on')).to.be.false;
   		});
   	});

   	describe('.registerStartStopEvent', function() {
   		it('toggles button label', function() {
   			var starter = $('#starter');
   			expect(starter.html()).to.eq('Start');
   			starter.click();
   			expect(starter.html()).to.eq('Stop');
   			starter.click();
   			expect(starter.html()).to.eq('Start');
   		});
   	});

   	describe('.registerCellDrawEvent', function() {
   		it('mousedown toggles cell', function() {
   			$('#cell_1_1').trigger('mousedown');
   			expect($('#cell_1_1').hasClass('on')).to.be.true;
   			$('#cell_1_1').trigger('mousedown');
   			expect($('#cell_1_1').hasClass('on')).to.be.false;
   		});

   		it('mousemove toggles cells on', function() {
   			model.toggleCell(1, 3);

   			$('#cell_1_1').trigger('mousedown');
   			$('#cell_1_2').trigger('mouseenter');
   			$('#cell_1_3').trigger('mouseenter');
   			$('#cell_1_3').trigger('mouseup');
   			$('#cell_1_4').trigger('mouseenter');
   			expect($('#cell_1_1').hasClass('on')).to.be.true;
   			expect($('#cell_1_2').hasClass('on')).to.be.true;
   			expect($('#cell_1_3').hasClass('on')).to.be.true;
   			expect($('#cell_1_4').hasClass('on')).to.be.false;
   		});

   		it('mousemove toggles cells off', function() {
   			model.toggleCell(1, 1);
   			model.toggleCell(1, 3);
   			model.toggleCell(1, 5);

   			$('#cell_1_1').trigger('mousedown');
   			$('#cell_1_2').trigger('mouseenter');
   			$('#cell_1_3').trigger('mouseenter');
   			$('#starter').trigger('mouseup');
   			$('#cell_1_4').trigger('mouseenter');
   			$('#cell_1_5').trigger('mouseenter');
   			expect($('#cell_1_1').hasClass('on')).to.be.false;
   			expect($('#cell_1_2').hasClass('on')).to.be.false;
   			expect($('#cell_1_3').hasClass('on')).to.be.false;
   			expect($('#cell_1_4').hasClass('on')).to.be.false;
   			expect($('#cell_1_5').hasClass('on')).to.be.true;
   		});
   	});
  });
})();
