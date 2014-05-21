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
        var mockTask = { id: 0 };
        spyOn(taskListServiceMock, 'addTask');
        spyOn(taskListServiceMock, 'generateNewTask').andReturn(mockTask);

        inject(function($controller) {
          ctrl = $controller('TaskListCtrl', {
            $scope: scope,
            taskListService: taskListServiceMock
          });
        });

        ctrl.addTask();

        expect(taskListServiceMock.generateNewTask).toHaveBeenCalled();
        expect(taskListServiceMock.addTask).toHaveBeenCalledWith(mockTask);
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
  });
});
