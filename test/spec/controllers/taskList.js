'use strict';

describe('Controller: TaskListCtrl', function () {

  // load the controller's module
  beforeEach(module('whatNowApp'));

  var ctrl, scope;
  var taskListServiceMock = {
    generateNewTask: function() { return { id: 0 }; },
    getTaskList: function() { return []; },
    addTask: function() {},
    selectTask: function () {}
  };

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ctrl = $controller('TaskListCtrl', {
      $scope: scope,
      taskListService: taskListServiceMock
    });
  }));

  describe('controller', function() {
    describe('#addTask', function() {
      it('should be defined', function() {
        expect(ctrl.addTask).toBeDefined();
      });

      it('should call the TaskListService addTask method', function() {
        var spy = spyOn(taskListServiceMock, 'addTask');

        inject(function($controller) {
          ctrl = $controller('TaskListCtrl', {
            $scope: scope,
            taskListService: taskListServiceMock
          });
        });

        ctrl.addTask();

        expect(taskListServiceMock.addTask).toHaveBeenCalled();
        var spyCallArgument = spy.argsForCall[0][0];
        expect(spyCallArgument instanceof Task).toBe(true);

        // default values for the new task
        expect(spyCallArgument.name).toBe('(New task)');
        expect(spyCallArgument.isComplete).toBe(false);
      });
    }); // #addTask
  }); // controller

  describe('binding to $scope', function() {
    describe('variables', function() {
      it('should attach a list of tasks to the scope', function () {
        expect(scope.tasks).toBeDefined();
      });
    });

    describe('#removeTask', function() {
      it('should be available for the scope', function() {
        expect(scope.removeTask).toBeDefined();
      });
    });

    describe('#selectTask', function() {
      it('should be defined', function() {
        expect(scope.selectTask).toBeDefined();
      });

      it('should call the selectTask method of the TaskListService', function() {
        spyOn(taskListServiceMock, 'selectTask');

        var task = { id: 0 };

        scope.selectTask(task);

        expect(taskListServiceMock.selectTask).toHaveBeenCalledWith(task);
      });
    });

    describe('#getDependsOnText', function() {
      it('should be defined', function() {
        expect(scope.getDependsOnText).toBeDefined();
      });

      it('should return a list of dependencies for a task', function() {
        var task1 = new Task('task1');
        var task2 = new Task('task2');
        var task3 = new Task('task3');
        task3.addPrevious(task1);
        task3.addPrevious(task2);

        var dependsOnText = scope.getDependsOnText(task3);

        expect(dependsOnText).toBe([task1.taskId, task2.taskId].join(', '));
      });
    });
  });
});
