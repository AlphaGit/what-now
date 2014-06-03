'use strict';

describe('filePersistenceService', function() {
  var service, compileMock, windowMock;
  beforeEach(function() {
    module('whatNowApp');

    windowMock = {
      JSON: {
        stringify: function() {}
      },
      encodeURIComponent: function() { }
    };
    compileMock = function() {
      return function() {
        return {
          attr: function() {},
          '0': {
            click: function() { }
          }
        };
      };
    };

    module(function ($provide) {
      $provide.value('$window', windowMock);
      $provide.value('$compile', compileMock);
    });

    inject(function(filePersistenceService) {
      service = filePersistenceService;
    });
  });

  describe('#saveToFile', function() {
    it('should be defined', function() {
      expect(service.saveToFile).toBeDefined();
    });

    it('should stringify the object passed to it', function() {
      var testObject = { something: 1 };

      spyOn(windowMock.JSON, 'stringify');

      service.saveToFile(testObject, 'test.txt');

      expect(windowMock.JSON.stringify).toHaveBeenCalledWith(testObject);
    });
  }); // #saveToFile

  describe('#readFromFile', function() {
    it('should be defined', function() {
      expect(service.readFromFile).toBeDefined();
    });

    it('should try to read the file and parse its contents', function() {
      var fileContentsMock = 'File contents';
      var fileReaderInstanceMock = {
        readAsText: function() {
          return fileContentsMock;
        },
        triggerLoadEnd: function() {
          this.onloadend();
        }
      };
      windowMock.FileReader = function() {
        return fileReaderInstanceMock;
      };
      windowMock.JSON.parse = function() {
        return fileContentsMock;
      };

      var file = {};

      spyOn(windowMock, 'FileReader').andCallThrough();
      spyOn(windowMock.JSON, 'parse').andCallThrough();

      service.readFromFile(file);
      fileReaderInstanceMock.result = fileContentsMock;
      fileReaderInstanceMock.triggerLoadEnd();

      expect(windowMock.FileReader).toHaveBeenCalled();
      expect(windowMock.JSON.parse).toHaveBeenCalledWith(fileContentsMock);

    });
  }); // #readFromFile
});