'use strict';

describe('Directive: clickFileLoader', function() {
  var scope, compile, defaultData,
    validTemplate = '<click-file-loader></click-file-loader>';

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

  it('should insert an input item into the DOM', function() {
    var element = createDirective();
    expect(element.find('input').length).toBe(1);
  });

  it('should transclude templates', function() {
    var element = createDirective(null, '<click-file-loader><span /></click-file-loader>');
    expect(element.find('span').length).toBe(1);

    element = createDirective(null, '<click-file-loader><a class="a-link" /></click-file-loader>');
    expect(element.find('span').length).toBe(0);
    expect(element.find('a').length).toBe(1);
    expect(element.find('a').hasClass('a-link')).toBe(true);
  });

  it('should update the file selected once the input changes its value', function() {
    scope.update = function() { };
    spyOn(scope, 'update').andCallThrough();
    //var fileMock = { file: true };

    var element = createDirective(null, '<click-file-loader on-file-selected="update"><div /></click-file-loader>');
    var input = element.find('input');
    input.triggerHandler('change');

    expect(scope.update).toHaveBeenCalled();
    expect(input.val()).toBeFalsy();

    //TODO can this be done? files seems to be a read only property
    //element.find('input')[0].files = [fileMock];
    //expect(scope.update).toHaveBeenCalledWith(fileMock);
  });

  it('should listen the click on the container element and trigger the click on the input', function() {
    var element = createDirective();

    var input = element.find('input')[0];
    spyOn(input, 'click');

    element.triggerHandler('click');

    expect(input.click).toHaveBeenCalled();
  });
});