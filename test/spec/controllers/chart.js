'use strict';

describe('Controller: TaskListCtrl', function () {

  // load the controller's module
  beforeEach(module('whatNowApp'));

  var ctrl, scope;
  var taskListServiceMock = {
    generateNewTask: function() { return { id: 0 }; },
    getTaskList: function() { return []; },
    addTask: function() {}
  };

  describe('binding to $scope', function() {
    it('should initialize the task list based on what the taskListService returns', inject(function ($controller, $rootScope) {
      var mockResult = [{ name: 'Task 1' }];
      spyOn(taskListServiceMock, 'getTaskList').andReturn(mockResult);

      scope = $rootScope.$new();
      ctrl = $controller('TaskListCtrl', {
        $scope: scope,
        taskListService: taskListServiceMock
      });

      expect(taskListServiceMock.getTaskList).toHaveBeenCalled();
      expect(scope.tasks).toBe(mockResult);
    }));
  });
});