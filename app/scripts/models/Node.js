'use strict';

(function(window, undefined) {
  var nodeId = 0;

  var Node = function(data) {
    this.nodeId = nodeId++;
    this.next = [];
    this.previous = [];
    this.data = data;
  };

  var assertNodeType = function(possibleNode) {
    if (!(possibleNode instanceof Node)) {
      throw new TypeError();
    }
  };

  var _isReachableThroughProperty = function(visitedNodes, nodeToFind, currentNode, property) {
    // found it! is reachable
    if (currentNode[property].indexOf(nodeToFind) > -1) {
      return true;
    }

    // didn't find it and we already visited all of the next ones, we're not going to find it
    var allNextVisited = currentNode[property].every(function(nextNode) {
      return visitedNodes.indexOf(nextNode) > -1;
    });

    if (allNextVisited) {
      return false;
    }

    visitedNodes = visitedNodes.concat(currentNode[property]);
    return currentNode[property].some(function(nodeToSearchIn) {
      return _isReachableThroughProperty(visitedNodes, nodeToFind, nodeToSearchIn, property);
    });
  };

  var _isReachableThroughNext = function(nodeToFind, currentNode) {
    return _isReachableThroughProperty([], nodeToFind, currentNode, 'next');
  };

  var _isReachableThroughPrevious = function(nodeToFind, currentNode) {
    return _isReachableThroughProperty([], nodeToFind, currentNode, 'previous');
  };

  Node.prototype.addNext = function(node) {
    assertNodeType(node);

    if (this.canAddAsNext(node)) {
      this.next.push(node);
      node.addPrevious(this);
    }
  };

  Node.prototype.canAddAsPrevious = function(node) {
    return node !== this && // is not the same node
      this.previous.indexOf(node) === -1 && // it has not been already added
      !_isReachableThroughNext(node, this); // it would not generate cycles
  };

  Node.prototype.canAddAsNext = function(node) {
    return node !== this && // is not the same node
      this.next.indexOf(node) === -1 && // it has not been already added
      !_isReachableThroughPrevious(node, this); // it would not generate cycles
  };

  Node.prototype.addPrevious = function(node) {
    assertNodeType(node);

    if (this.canAddAsPrevious(node)) {
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

  //TODO Needs test
  Node.prototype.clone = function() {
    var cloned = new Node(this.data);
    cloned.next = [].concat(this.next);
    cloned.previous = [].concat(this.previous);
    return cloned;
  };

  window.Node = Node;

})(window);