'use strict';

(function(window, undefined) {

  var Node = function(data) {
    this.next = [];
    this.previous = [];
    this.data = data;
  };

  var assertNodeType = function(possibleNode) {
    if (!(possibleNode instanceof Node)) {
      throw new TypeError();
    }
  };

  Node.prototype.addNext = function(node) {
    assertNodeType(node);

    if (this.next.indexOf(node) === -1) {
      this.next.push(node);
      node.addPrevious(this);
    }
  };

  Node.prototype.addPrevious = function(node) {
    assertNodeType(node);

    if (this.previous.indexOf(node) === -1) {
      this.previous.push(node);
      node.addNext(this);
    }
  };

  Node.prototype.removeNext = function(node) {
    assertNodeType(node);

    var nextNodeIndex = this.next.indexOf(node);
    if (nextNodeIndex > -1) {
      this.next.splice(nextNodeIndex, 1);
      node.removePrevious(this);
    }
  };

  Node.prototype.removePrevious = function(node) {
    assertNodeType(node);

    var previousNodeIndex = this.previous.indexOf(node);
    if (previousNodeIndex > -1) {
      this.previous.splice(previousNodeIndex, 1);
      node.removeNext(this);
    }
  };

  Node.prototype.toString = function() {
    return '[Node] ' + this.data;
  };

  window.Node = Node;

})(window);