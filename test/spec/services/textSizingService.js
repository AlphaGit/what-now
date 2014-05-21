'use strict';

describe('textSizingService', function() {
  var textSizing;

  beforeEach(function() {
    module('whatNowApp');

    inject(function(textSizingService) {
      textSizing = textSizingService;
    });
  });

  describe('#getTextWidth', function() {
    it('should be defined', function() {
      expect(textSizing.getTextWidth).toBeDefined();
    });

    it('should get the width for the text passed', function() {
      var size = textSizing.getTextWidth('Hello world');
      // we need to test for a range since text renderings change browser by browser and os
      expect(size < 86 && size > 75).toBe(true);
    });

    it('should consider uppercase and lowercase for most fonts', function() {
      var size = textSizing.getTextWidth('Hello WorlD');
      // we need to test for a range since text renderings change browser by browser and os
      expect(size < 92 && size > 80).toBe(true);
    });

    it('should allow for different font families', function() {
      var size = textSizing.getTextWidth('Hello world', { fontFamily: 'Monospace' });
      // we need to test for a range since text renderings change browser by browser and os
      expect(size < 111 && size > 62).toBe(true);
    });

    it('should allow for different font sizes', function() {
      var size = textSizing.getTextWidth('Hello world', { fontSize: 50 });
      // we need to test for a range since text renderings change browser by browser and os
      expect(size > 245 && size < 251).toBe(true);
    });
  }); // #getTextWidth

  describe('#breakInChunks', function() {
    it('should be defined', function() {
      expect(textSizing.breakInChunks).toBeDefined();
    });

    it('should return a single empty chunk if passed a falsy string', function() {
      expect(textSizing.breakInChunks('', 50).length).toBe(1);
      expect(textSizing.breakInChunks(null, 50).length).toBe(1);
      expect(textSizing.breakInChunks(undefined, 50).length).toBe(1);
      expect(textSizing.breakInChunks(0, 50).length).toBe(1);
    });

    it('should break a text in multiple chunks depending on the maximum size specified', function() {
      var chunks = textSizing.breakInChunks('Hello world', 50);
      expect(chunks.length).toBe(2);
    });

    it('should make each of the chunks be narrower than the max size specified', function() {
      var chunks = textSizing.breakInChunks('Hello world', 50);
      chunks.forEach(function (chunk) {
        expect(textSizing.getTextWidth(chunk) < 50).toBe(true);
      });
    });

    it('should return the original text, except separators, in the separated chunks', function() {
      var chunks = textSizing.breakInChunks('Hello world', 50);
      expect(chunks[0].indexOf('Hello')).toBe(0);
      expect(chunks[1].indexOf('world')).toBe(0);
    });

    it('should also work for more than 2-word texts', function() {
      var chunks = textSizing.breakInChunks('Hello world this is a long name that will be broken into several pieces', 70);

      expect(chunks.length > 7).toBe(true);
    });
  });
});