'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('whatNowApp'));

  var ctrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ctrl = $controller('MainCtrl', {
      $scope: scope
    });
  }));

  describe('controller', function() {
    describe('#addTask', function() {
      it('should be defined', function() {
        expect(ctrl.addTask).toBeDefined();
      });

      it('should add a task to the task list when passed into it', function() {
        var task = 'some task';
        ctrl.addTask(task);

        expect(ctrl.tasks.length).toBe(1);
        expect(ctrl.tasks[0]).toBe(task);
      });

      it('should initialize the dependsOn array of the passed task', function() {
        var newTask = { id: 1, name: 'new task', dependsOnText: '' };

        ctrl.addTask(newTask);

        expect(newTask.dependsOn.length).toBe(0);
      });

      it('should link tasks when passed task has the ID of another', function() {
        var firstTask = { id: 1, name: 'first task', dependsOnText: '', dependsOn: [] };
        ctrl.tasks = [firstTask];

        var newTask = { id: 2, name: 'second task', dependsOnText: '1', dependsOn: [] };
        ctrl.addTask(newTask);

        expect(newTask.dependsOn.length).toBe(1);
        expect(newTask.dependsOn[0]).toBe(firstTask);
      });

      it('should support a list of dependencies in comma separated values', function() {
        ctrl.tasks = [
          { id: 0, name: 'first task', dependsOnText: '', dependsOn: [] },
          { id: 1, name: 'second task', dependsOnText: '', dependsOn: [] },
          { id: 2, name: 'third task', dependsOnText: '', dependsOn: [] }
        ];

        var newTask = { id: 3, name: 'depends on all', dependsOnText: '0,1,2' };
        ctrl.addTask(newTask);

        expect(newTask.dependsOn).toBeDefined();
        expect(newTask.dependsOn.length).toBe(3);
      });

      it('should ignore spaces in the comma separated list', function() {
        ctrl.tasks = [
          { id: 0, name: 'first task', dependsOnText: '', dependsOn: [] },
          { id: 1, name: 'second task', dependsOnText: '', dependsOn: [] },
          { id: 2, name: 'third task', dependsOnText: '', dependsOn: [] }
        ];

        var newTask = { id: 3, name: 'depends on all', dependsOnText: '0, 1    ,           2       ' };
        ctrl.addTask(newTask);

        expect(newTask.dependsOn).toBeDefined();
        expect(newTask.dependsOn.length).toBe(3);
      });

      it('should not add the same task twice', function() {
        var task = ctrl.generateNewTask();

        ctrl.addTask(task);
        expect(ctrl.tasks.length).toBe(1);

        ctrl.addTask(task);
        expect(ctrl.tasks.length).toBe(1);
      });
    });

    describe('#removeTask', function() {
      it('should be defined', function() {
        expect(scope.removeTask).toBeDefined();
      });

      it('should remove the passed task from the task list', function() {
        var testTask = { name: 'Testing' };

        ctrl.addTask(testTask);

        ctrl.removeTask(testTask);

        expect(ctrl.tasks.length).toBe(0);
      });

      it('should remove tasks and also links from other\'s', function() {
        var task1 = { id: 1, name: 'first task', dependsOnText: '', dependsOn: [] };
        var task2 = { id: 2, name: 'second task', dependsOnText: '', dependsOn: [task1] };
        var task3 = { id: 3, name: 'third task', dependsOnText: '', dependsOn: [task1, task2] };

        ctrl.tasks = [task1, task2, task3];

        ctrl.removeTask(task1);

        expect(ctrl.tasks.length).toBe(2);
        expect(ctrl.tasks[0]).toBe(task2);
        expect(ctrl.tasks[1]).toBe(task3);

        expect(task2.dependsOn.length).toBe(0);
        expect(task3.dependsOn.length).toBe(1);
        expect(task3.dependsOn[0]).toBe(task2);
      });
    });

    describe('#generateNewTask', function() {
      it('should return a new task each time', function() {
        var task1 = ctrl.generateNewTask();
        var task2 = ctrl.generateNewTask();

        expect(task1).not.toBe(task2);
        expect(task1.id).not.toBe(task2.id);
      });
    });
  });

  describe('binding to $scope', function() {
    describe('variables', function() {
      it('should attach a list of tasks to the scope', function () {
        expect(scope.tasks).toBeDefined();
      });

      it('should have a task being edited bound to the scope', function() {
        expect(scope.taskBeingEdited).toBeDefined();
      });

      describe('.editingExistingTask', function() {
        it('should be false by default', function() {
          expect(scope.editingExistingTask).toBe(false);
        });

        it('should switch to true when editing a task', function() {
          scope.editTask({});
          expect(scope.editingExistingTask).toBe(true);
        });

        it('should switch to false after finishing editing a task', function() {
          scope.editTask({});
          scope.submitForm();
          expect(scope.editingExistingTask).toBe(false);
        });
      });
    });

    describe('#submitForm', function() {
      it('should be defined', function() {
        expect(scope.submitForm).toBeDefined();
      });

      it('should add the new task defined in the taskBeingEdited object', function() {
        var testTask = { name: 'Testing' };
        scope.taskBeingEdited = testTask;

        scope.submitForm();

        expect(ctrl.tasks.length).toBe(1);
        expect(ctrl.tasks[0]).toBe(testTask);
      });

      it('should unlink the newTask object from the recently added task', function() {
        var testTask = { name: 'Testing' };
        scope.taskBeingEdited = testTask;

        scope.submitForm();

        expect(scope.newTask).not.toBe(testTask);
      });

      it('should increase the internal id of the new task each time a task is added', function() {
        expect(scope.taskBeingEdited.id).toBe(1);
        scope.submitForm();
        expect(scope.taskBeingEdited.id).toBe(2);
      });
    });

    describe('#removeTask', function() {
      it('should be available for the scope', function() {
        expect(scope.removeTask).toBeDefined();
      });
    });

    describe('#editTask', function() {
      it('should be available for the scope', function() {
        expect(scope.editTask).toBeDefined();
      });

      it('should put in place the selected task for it to be edited', function() {
        var task = { id: 1, name: 'New task' };
        scope.editTask(task);
        expect(scope.taskBeingEdited).toBeDefined(task);
      });
    });
  });
});
