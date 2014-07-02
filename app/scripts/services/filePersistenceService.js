'use strict';

angular.module('whatNowApp')
  .factory('filePersistenceService', ['$window', '$compile', '$q', function ($window, $compile, $q) {
    var filePersistenceService = {};

    filePersistenceService.saveToFile = function(objectString, fileName) {
      // from http://stackoverflow.com/a/18197511/147507
      //var fakeAnchor = $document.createElement('a');
      var fakeAnchor = $compile('<a></a>')({});
      objectString = $window.encodeURIComponent(objectString);
      fakeAnchor.attr('href', 'data:text/plain;charset=utf-8,' + objectString);
      fakeAnchor.attr('download', fileName);
      fakeAnchor[0].click();
    };

    filePersistenceService.readFromFile = function(file) {
      var fileReader = new $window.FileReader();
      var deferred = $q.defer();
      fileReader.onloadend = function() {
        deferred.resolve(fileReader.result);
      };
      fileReader.readAsText(file);
      return deferred.promise;
    };

    return filePersistenceService;
  }]);