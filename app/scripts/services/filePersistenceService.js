'use strict';

angular.module('whatNowApp')
  .factory('filePersistenceService', ['$window', '$compile', '$q', function ($window, $compile, $q) {
    var filePersistenceService = {};

    filePersistenceService.saveToFile = function(object, fileName) {
      var objectString = $window.JSON.stringify(object);
      objectString = $window.encodeURIComponent(objectString);
      // from http://stackoverflow.com/a/18197511/147507
      //var fakeAnchor = $document.createElement('a');
      var fakeAnchor = $compile('<a></a>')({});
      fakeAnchor.attr('href', 'data:text/plain;charset=utf-8,' + objectString);
      fakeAnchor.attr('download', fileName);
      fakeAnchor[0].click();
    };

    filePersistenceService.readFromFile = function(file) {
      var fileReader = new $window.FileReader();
      var deferred = $q.defer();
      fileReader.onloadend = function() {
        var fileContents = fileReader.result;
        var object = $window.JSON.parse(fileContents);
        deferred.resolve(object);
      };
      fileReader.readAsText(file);
      return deferred.promise;
    };

    return filePersistenceService;
  }]);