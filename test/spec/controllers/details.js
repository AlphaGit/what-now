'use strict';

describe('Controller: DetailsCtrl', function () {

  // load the controller's module
  beforeEach(module('whatNowApp'));

  var ctrl, scope, rootScope;
  var taskListServiceMock = {
    getPossibleDependencies: function() { return []; },
    generateNewTask: function() { return { id: 0 }; },
    getTaskList: function() { return []; },
    addTask: function() {}
  };

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($q, $controller, $rootScope) {
    rootScope = $rootScope;
    scope = $rootScope.$new();
    ctrl = $controller('DetailsCtrl', {
      $scope: scope,
      $q: $q,
      taskListService: taskListServiceMock
    });
  }));

  describe('binding to $scope', function() {
    it('should have a task being edited bound to the scope', function() {
      expect(scope.taskBeingEdited).toBeDefined();
    });

    it('should have a list of selected dependencies bound to the scope', function() {
      expect(scope.selectedDependencies).toBeDefined();
    });

    describe('#submitForm', function() {
      it('should be defined', function() {
        expect(scope.submitForm).toBeDefined();
      });

      it('should add the new task defined in the taskBeingEdited object', function() {
        var testTask = { name: 'Testing' };
        scope.taskBeingEdited = testTask;

        spyOn(taskListServiceMock, 'addTask');

        scope.submitForm();

        expect(taskListServiceMock.addTask).toHaveBeenCalledWith(testTask);
      });

      it('should unlink the newTask object from the recently added task', function() {
        var testTask = { name: 'Testing' };
        scope.taskBeingEdited = testTask;

        scope.submitForm();

        expect(scope.newTask).not.toBe(testTask);
      });

      it('should generate a new taskBeingEdited object', function() {
        var testTask = { name: 'Testing' };
        scope.taskBeingEdited = testTask;

        scope.submitForm();

        expect(scope.taskBeingEdited).not.toBe(testTask);
      });
    }); // #submitForm

    it('should listen the taskSelected event and use the task as the one being edited', function() {
      var task = { id: 1 };

      rootScope.$broadcast('taskSelected', task);

      expect(scope.taskBeingEdited).toBe(task);
    });

    describe('#filteredTaskList', function() {
      it('should be defined', function() {
        expect(scope.filteredTaskList).toBeDefined();
      });

      it('should return a promise', function() {
        expect(scope.filteredTaskList().then).toBeDefined();
      });

      it('should return a list of tasks', function() {
        var taskListMock = [{ id: 1, name: 'a' }, { id: 2, name: 'b' }];
        spyOn(taskListServiceMock, 'getPossibleDependencies').andReturn(taskListMock);
        var filteredTaskList;

        scope.$apply(function() {
          scope.filteredTaskList().then(function(taskList) {
            filteredTaskList = taskList;
          });
        });

        expect(filteredTaskList).toBe(taskListMock);
      });

      it('should call the taskListService to filter the list of tasks', function() {
        spyOn(taskListServiceMock, 'getPossibleDependencies').andReturn([]);
        var currentTask = new Task('test');
        scope.taskBeingEdited = currentTask;
        scope.filteredTaskList('some filter');
        expect(taskListServiceMock.getPossibleDependencies).toHaveBeenCalledWith(currentTask, 'some filter');
      });
    }); // #filteredTaskList

    describe('#addPrevious', function() {
      it('should be defined', function() {
        expect(scope.addPrevious).toBeDefined();
      });

      it('should call addPrevious is the task being edited is an actual task', function() {
        var task = new Task('test');
        var secondTask = new Task('second');

        scope.taskBeingEdited = task;

        spyOn(task, 'addPrevious');
        scope.addPrevious(secondTask);

        expect(task.addPrevious).toHaveBeenCalledWith(secondTask);
      });

      it('should do nothing if the task is a regular object', function() {
        var task = { addPrevious: function() {} };
        var secondTask = new Task('second');

        scope.taskBeingEdited = task;

        spyOn(task, 'addPrevious');
        scope.addPrevious(secondTask);

        expect(task.addPrevious).not.toHaveBeenCalled();
      });
    }); // #addPrevious

    describe('#removePrevious', function() {
      it('should be defined', function() {
        expect(scope.removePrevious).toBeDefined();
      });

      it('should call removePrevious if the task being edited is an actual task', function() {
        var task = new Task('test');
        var secondTask = new Task('second');
        task.addPrevious(secondTask);

        scope.taskBeingEdited = task;

        spyOn(task, 'removePrevious');

        scope.removePrevious(secondTask);

        expect(task.removePrevious).toHaveBeenCalledWith(secondTask);
      });

      it('should do nothing if the task is a regular object', function() {
        var task = { removePrevious: function() {} };
        var secondTask = new Task('second');

        scope.taskBeingEdited = task;

        spyOn(task, 'removePrevious');

        scope.removePrevious(secondTask);

        expect(task.removePrevious).not.toHaveBeenCalled();
      });
    }); // #removePrevious
  });
});
