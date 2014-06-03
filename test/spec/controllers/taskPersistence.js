'use strict';

describe('Controller: TaskPersistenceCtrl', function () {

  // load the controller's module
  beforeEach(module('whatNowApp'));

  var ctrl, scope;
  var taskListServiceMock = {
    generateNewTask: function() { return { id: 0 }; },
    getTaskList: function() { return []; },
    setTaskList: function() {},
    addTask: function() {},
    selectTask: function () {}
  };

  var filePersistenceServiceMock = {
    saveToFile: function() {},
    readFromFile: function() {
      return {
        then: function() {}
      };
    }
  };

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ctrl = $controller('TaskPersistenceCtrl', {
      $scope: scope,
      taskListService: taskListServiceMock,
      filePersistenceService: filePersistenceServiceMock
    });
  }));

  describe('binding to scope', function() {
    it('should have a saveTasks function', function() {
      expect(scope.saveTasks).toBeDefined();
    });

    it('should have a loadTasks function', function() {
      expect(scope.loadTasks).toBeDefined();
    });
  });

  describe('controller', function() {
    describe('#saveTasks', function() {
      it('should get the list of tasks from the taskListService', function() {
        spyOn(taskListServiceMock, 'getTaskList');

        ctrl.saveTasks();

        expect(taskListServiceMock.getTaskList).toHaveBeenCalled();
      });

      it('should call the filePersistenceService with the list of tasks to be saved', function() {
        var taskList = [{ id: 0 }, { id: 1 }];
        taskListServiceMock.getTaskList = function() { return taskList; };

        spyOn(filePersistenceServiceMock, 'saveToFile');
        ctrl.saveTasks();

        expect(filePersistenceServiceMock.saveToFile).toHaveBeenCalledWith(taskList, 'taskList.txt');
      });
    }); // #saveTasks

    describe('#loadTasks', function() {
      it('should be defined', function() {
        expect(ctrl.loadTasks).toBeDefined();
      });

      it('should call the filePersistenceService to load a file object', function() {
        var mockTasks = [{ id: 0 }, { id: 1 }];
        var fakePromise = {
          then: function(callback) {
            callback(mockTasks);
          }
        };

        spyOn(filePersistenceServiceMock, 'readFromFile').andReturn(fakePromise);
        spyOn(taskListServiceMock, 'setTaskList');

        var file = { something: true };

        ctrl.loadTasks(file);

        expect(filePersistenceServiceMock.readFromFile).toHaveBeenCalledWith(file);
        expect(taskListServiceMock.setTaskList).toHaveBeenCalledWith(mockTasks);
      });

      it('should avoid trying to load from the file if the file was not passed', function() {
        spyOn(filePersistenceServiceMock, 'readFromFile').andCallThrough();

        ctrl.loadTasks();

        expect(filePersistenceServiceMock.readFromFile).not.toHaveBeenCalled();
      });
    });
  }); // controller
});
