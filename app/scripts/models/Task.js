'use strict';

(function(window, undefined) {

  var lastTaskId = 0;
  var Node = window.Node;

  var Task = function(parameters) {
    var self = this;

    function initializeFromName(name) {
      initializeFromObject({
        name: name,
        isComplete: false
      });
    }

    function initializeFromObject(object) {
      self.name = object.name;
      self.isComplete = object.isComplete || false;
      if (object.previous && object.previous.length) {
        object.previous.forEach(function(previousTask) {
          self.addPrevious(previousTask);
        });
      }
    }

    // common initialization
    Node.call(this);
    this.taskId = ++lastTaskId;
    this.isSuggested = false;
    this.isSelected = false;

    parameters = parameters || '';

    if (typeof parameters === 'string') {
      initializeFromName(parameters);
    } else {
      initializeFromObject(parameters);
    }
  };

  Task.prototype = Object.create(Node.prototype);
  Task.prototype.constructor = Task;

  Task.prototype.toString = function() {
    return '[Task#' + this.taskId + '] ' + this.name;
  };

  Task.prototype.clone = function() {
    var cloned = Node.prototype.clone.call(this);
    cloned.taskId = ++lastTaskId;
    cloned.name = this.name;
    cloned.isSuggested = this.isSuggested;
    cloned.isComplete = this.isComplete;
    cloned.isSelected = this.isSelected;
    return cloned;
  };

  window.Task = Task;

})(window);
