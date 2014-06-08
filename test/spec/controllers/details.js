'use strict';

describe('Controller: DetailsCtrl', function () {

  // load the controller's module
  beforeEach(module('whatNowApp'));

  var ctrl, scope, rootScope;
  var taskListServiceMock = {
    generateNewTask: function() { return { id: 0 }; },
    getTaskList: function() { return []; },
    addTask: function() {}
  };

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    rootScope = $rootScope;
    scope = $rootScope.$new();
    ctrl = $controller('DetailsCtrl', {
      $scope: scope,
      taskListService: taskListServiceMock
    });
  }));

  describe('binding to $scope', function() {
    it('should have a task being edited bound to the scope', function() {
      expect(scope.taskBeingEdited).toBeDefined();
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
    });

    it('should listen the taskSelected event and use the task as the one being edited', function() {
      var task = { id: 1 };

      rootScope.$broadcast('taskSelected', task);

      expect(scope.taskBeingEdited).toBe(task);
    });
  });
});