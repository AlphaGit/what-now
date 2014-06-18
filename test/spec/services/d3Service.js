'use strict';

describe('d3Service', function() {
  beforeEach(function() {
    module('whatNowApp');
  });

  it('should return the global reference to d3', function() {
    var d3Mock = { mock: true };
    module(function ($provide) {
      $provide.value('$window', { d3: d3Mock });
    });

    var service;
    inject(function(d3Service) {
      service = d3Service;
    });

    expect(service).toBe(d3Mock);
  });
});