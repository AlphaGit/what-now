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

    var jQueryService;
    inject(function(jQuery) {
      jQueryService = jQuery;
    });

    expect(jQueryService).toBe(jQueryMock);
  });
});