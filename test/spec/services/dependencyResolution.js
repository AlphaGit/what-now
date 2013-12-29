describe('dependencyResolutionService', function() {
	'use strict';

	var drs; // dependency resolution service

	beforeEach(function() {
		module('whatNowApp');

		inject(function(dependencyResolutionService) {
			drs = dependencyResolutionService;
		});
	});

	describe('arrangeInLayers method', function() {
		it('should be defined', function() {
			expect(drs.arrangeInLayers).toBeDefined();
		});

		it('should return an empty array of layers if the passed tasklist is empty', function() {
			var result = drs.arrangeInLayers([]);
			expect(result.length).toBe(0);
		});

		it('should return an empty array of layers if the passed tasklist is not passed', function() {
			var result = drs.arrangeInLayers();
			expect(result.length).toBe(0);
		});

		it('should arrange each layer of dependencies', function() {
			var task1 = { id: 0, name: 'first task', dependsOnText: '', dependsOn: [] };
			var task2 = { id: 1, name: 'second task', dependsOnText: '', dependsOn: [task1] };
			var task3 = { id: 2, name: 'third task', dependsOnText: '', dependsOn: [task1, task2] };

			var taskList = [task1, task2, task3];

			var layers = drs.arrangeInLayers(taskList);

			// result: task1 -> task2 -> task3
			expect(layers.length).toBe(3);

			// layer 1 should only have task1
			expect(layers[0].length).toBe(1);
			expect(layers[0][0]).toBe(task1);

			// layer 2 should only have task2
			expect(layers[1].length).toBe(1);
			expect(layers[1][0]).toBe(task2);

			// layer 3 should only have task3
			expect(layers[2].length).toBe(1);
			expect(layers[2][0]).toBe(task3);
		});
	});

	describe('allDependenciesPresent method', function() {
		it('should be defined', function() {
			expect(drs.allDependenciesPresent).toBeDefined();
		});

		it('should return true if the task has no dependencies', function() {
			var task = { name: 'task', dependsOn: [] };
			var availableDependencies = [];

			expect(drs.allDependenciesPresent(task, availableDependencies)).toBe(true);
		});

		it('should return false if dependencies for the task are not present (no dependencies)', function() {
			var task1 = { name: 'task1', dependsOn: [] };
			var task2 = { name: 'tasl2', dependsOn: [task1] };

			expect(drs.allDependenciesPresent(task2, [])).toBe(false);
		});

		it('should return false if dependencies for the task are not present (with dependencies)', function() {
			var task1 = { name: 'task1', dependsOn: [] };
			var task2 = { name: 'tasl2', dependsOn: [task1] };
			var task3 = { name: 'task3', dependsOn: [task2] };

			expect(drs.allDependenciesPresent(task2, [task3])).toBe(false);
		});

		it('should return true if all dependencies are present', function() {
			var task1 = { name: 'task1', dependsOn: [] };
			var task2 = { name: 'tasl2', dependsOn: [] };
			var task3 = { name: 'task3', dependsOn: [task1, task2] };

			expect(drs.allDependenciesPresent(task3, [task1, task2])).toBe(true);
		});

		it('should return true if there are no dependencies', function() {
			var task = { name: 'task', dependsOn: [] };

			expect(drs.allDependenciesPresent(task, [])).toBe(true);
		});
	});
});