'use strict';

describe('taskSerializationService', function() {
  var service, windowMock;
  beforeEach(function() {
    module('whatNowApp');

    windowMock = {
      JSON: {
        stringify: function() {},
        parse: function() {}
      }
    };

    module(function ($provide) {
      $provide.value('$window', windowMock);
    });

    inject(function(taskSerializationService) {
      service = taskSerializationService;
    });
  });

  describe('#serializeTasks', function() {
    it('should be defined', function() {
      expect(service.serializeTasks).toBeDefined();
    });

    it('should stringify the object passed to it', function() {
      var testObject = { something: 1 };

      spyOn(windowMock.JSON, 'stringify');

      service.serializeTasks(testObject);

      expect(windowMock.JSON.stringify).toHaveBeenCalled();
    });

    it('should render references to tasks as ids', function() {
      var filterFunction;
      windowMock.JSON.stringify = function(object, filter) {
        filterFunction = filter;
      };

      service.serializeTasks({});

      // for regular properties, returns the value
      expect(filterFunction('a', 'b')).toBe('b');

      // for "next", it should get just the task IDs
      var serializedNext = filterFunction('next', [{ name: 'A', taskId: 1 }]);
      expect(serializedNext.length).toBe(1);
      expect(serializedNext[0].$taskId).toBe(1);

      // for "previous", it should get just the task IDs
      var serializedPrevious = filterFunction('previous', [{ name: 'A', taskId: 1 }]);
      expect(serializedPrevious.length).toBe(1);
      expect(serializedPrevious[0].$taskId).toBe(1);
    });
  }); // #serializeTasks

  describe('#deserializeTasks', function() {
    it('should be defined', function() {
      expect(service.deserializeTasks).toBeDefined();
    });

    it('should parse the passed string into it', function() {
      spyOn(windowMock.JSON, 'parse').andReturn([]);

      service.deserializeTasks('[{ something: 1 }]');

      expect(windowMock.JSON.parse).toHaveBeenCalled();
    });

    it('should return task instances', function() {
      var parsedTasks = [
        { taskId: 1, next: [], previous: [] },
      ];
      spyOn(windowMock.JSON, 'parse').andReturn(parsedTasks);

      var result = service.deserializeTasks('');
      expect(result.length).toBe(1);
      expect(result[0] instanceof Task).toBe(true);
    });

    it('should parse task references', function() {
      var parsedTasks = [
        { taskId: 1, next: [{ $taskId: 2 }], previous: [] },
        { taskId: 2, next: [], previous: [{ $taskId: 1 }] }
      ];
      spyOn(windowMock.JSON, 'parse').andReturn(parsedTasks);

      var result = service.deserializeTasks('');

      expect(result.length).toBe(2);
      
      expect(result[0].next.length).toBe(1);
      expect(result[0].next[0]).toBe(result[1]);
      expect(result[0].previous.length).toBe(0);

      expect(result[1].previous.length).toBe(1);
      expect(result[1].previous[0]).toBe(result[0]);
      expect(result[1].next.length).toBe(0);
    });
  }); // #deserializeTasks
});