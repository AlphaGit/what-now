'use strict';

angular.module('whatNowApp')
  .factory('textSizingService', ['jQuery', function ($) {

    /******************* private members *************************/
    var $hiddenText = $('<span style="display: none"></span>');
    $('body').append($hiddenText);

    var service = {};
    var defaultStyle = {
      fontFamily: 'Arial',
      fontSize: '16px',
      margin: 0,
      padding: 0,
      lineHeight: '16px'
    };

    var mixStylesWithDefault = function (userStyles) {
      var mixedStyles = angular.extend({}, defaultStyle);
      return angular.extend(mixedStyles, userStyles || {});
    };

    /******************** public members **************************/
    service.getTextWidth = function(text, style) {
      var finalStyle = mixStylesWithDefault(style);

      $hiddenText.css(finalStyle);
      $hiddenText.text(text);
      return $hiddenText.width();
    };

    service.breakInChunks = function(text, maxWidth) {
      var chunks = [];

      var words = text.split(/\s+/);
      if (words.length === 1) {
        return words;
      }

      if (words.length === 2) {
        return (service.getTextWidth(text) <= maxWidth) ? [text] : words;
      }

      var currentChunk = words.shift();
      var nextWord = words.shift();

      while (words.length) {
        if (service.getTextWidth(currentChunk + ' ' + nextWord) > maxWidth) {
          chunks.push(currentChunk);
          currentChunk = nextWord;
          nextWord = words.shift();
        } else {
          currentChunk += ' ' + nextWord;
          nextWord = words.shift();
        }
      }

      if (service.getTextWidth(currentChunk + ' ' + nextWord) > maxWidth) {
        chunks.push(currentChunk);
        chunks.push(nextWord);
      } else {
        chunks.push(currentChunk + ' ' + nextWord);
      }

      return chunks;
    };

    return service;
  }]);