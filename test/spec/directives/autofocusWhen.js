'use strict';

describe('Directive: autofocusWhen', function() {
  var scope, compile,
    defaultData = false,
    validTemplate = '<input type="text" autofocus-when="data"></input>';

  function createDirective(data, template) {
    scope.data = data || defaultData;
    var elm = compile(template || validTemplate)(scope);
    scope.$digest();
    return elm;
  }

  beforeEach(function() {
    module('whatNowApp');
    defaultData = {};
    inject(function($rootScope, $compile) {
      scope = $rootScope.$new();
      compile = $compile;
    });
  });

  it('should be created correctly with default data', function() {
    expect(createDirective).not.toThrow();
  });

  it('should autofocus the DOM element when the expression turns true', function() {
    var element = createDirective({ value: false }, '<input type="text" autofocus-when="data.value" />');
    
    scope.$apply(function() {
      scope.data.value = true;
    });

    expect(document.activeElement === element[0]);
  });
});