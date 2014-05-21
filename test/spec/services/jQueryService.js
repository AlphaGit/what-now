'use strict';

describe('jQuery service', function() {
  beforeEach(function() {
    module('whatNowApp');
  });

  it('should return the global reference to jQuery', function() {
    var jQueryMock = { mock: true };
    module(function ($provide) {
      $provide.value('$window', { jQuery: jQueryMock });
    });

    var service;
    inject(function(jQueryService) {
      service = jQueryService;
    });

    expect(service).toBe(jQueryMock);
  });
});