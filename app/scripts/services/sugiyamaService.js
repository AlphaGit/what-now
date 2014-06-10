'use strict';

angular.module('whatNowApp')
  .factory('sugiyamaService', [function () {
    var sugiyamaService = {};

    sugiyamaService.areAllPresent = function (listOfNodes, nodesToCheck) {
      var areAllPresent = true;
      var evaluatingIndex = nodesToCheck.length - 1;
      while (areAllPresent && evaluatingIndex >= 0) {
        areAllPresent = listOfNodes.indexOf(nodesToCheck[evaluatingIndex--]) > -1;
      }

      return areAllPresent;
    };

    sugiyamaService.isAnyPresent = function (listOfNodes, nodesToCheck) {
      var isAnyPresent = false;
      var evaluatingIndex = nodesToCheck.length - 1;
      while (!isAnyPresent && evaluatingIndex >= 0) {
        isAnyPresent = listOfNodes.indexOf(nodesToCheck[evaluatingIndex--]) > -1;
      }

      return isAnyPresent;
    };

    var extractIndependent = function(availableDependencies, availableNodes) {
      var nodeIndex = availableNodes.length - 1;
      var layer = [];

      while (nodeIndex >= 0) {
        var currentNode = availableNodes[nodeIndex];
        if (sugiyamaService.areAllPresent(availableDependencies, currentNode.previousNodes)) {
          layer.push(currentNode);
          availableNodes.splice(nodeIndex, 1);
        }

        nodeIndex--;
      }

      return layer;
    };

    // will arrange nodes in layers
    // layer 1 will have all nodes with no previous nodes
    // layer 2 will have all nodes with only previous in layer 1
    // layer 3 will have all nodes with only previous in layers 1 and 2
    // and so on...
    sugiyamaService.arrangeInLayers = function (nodeArray) {
      var layers = [];

      nodeArray = nodeArray || [];
      var nodesToVisit = nodeArray.slice(0);
      var visitedNodes = [];

      while (nodesToVisit.length) {
        var layer = extractIndependent(visitedNodes, nodesToVisit);
        layers.push(layer);
        visitedNodes = visitedNodes.concat(layer);
      }

      return layers;
    };

    sugiyamaService.hasNextNodes = function (node) {
      return !!node.nextNodes.length;
    };

    var fakeNodeData = { __fake: true };
    sugiyamaService.isFakeNode = function (node) {
      return node.data === fakeNodeData;
    };

    sugiyamaService.insertFakeNodeBeforeNext = function(list, currentNode, nextNode) {
      var fakeNode = sugiyamaService.createNode(fakeNodeData);

      sugiyamaService.disconnectNodes(currentNode, nextNode);
      sugiyamaService.connectNodes(fakeNode, nextNode);
      sugiyamaService.connectNodes(currentNode, fakeNode);

      list.push(fakeNode);
    };

    sugiyamaService.addFakeNodes = function(columns) {
      // check all columns except the last one
      for (var columnIndex = 0; columnIndex < columns.length - 1; columnIndex++) {
        var nextColumn = columns[columnIndex + 1];
        for (var rowIndex = 0; rowIndex < columns[columnIndex].length; rowIndex++) {
          var currentNode = columns[columnIndex][rowIndex];
          var originalNextNodes = currentNode.nextNodes.slice(0);
          for (var nextNodeIndex = 0; nextNodeIndex < originalNextNodes.length; nextNodeIndex++) {
            var nextNode = originalNextNodes[nextNodeIndex];
            if (nextColumn.indexOf(nextNode) === -1) {
              sugiyamaService.insertFakeNodeBeforeNext(columns[columnIndex + 1], currentNode, nextNode);
            }
          }
        }
      }

      return columns;
    };

    var minimizeCrossingsArisingFromColumnAndRows = function(grid, columnIndex, rowIndex1, rowIndex2) {
      var originalNode1 = grid[columnIndex][rowIndex1];
      var originalNode2 = grid[columnIndex][rowIndex2];
      var nextColumn = grid[columnIndex + 1];

      for (var nextNode1Index = 0; nextNode1Index < originalNode1.nextNodes.length; nextNode1Index++) {
        var nextNode1 = originalNode1.nextNodes[nextNode1Index];
        var nextNode1Row = nextColumn.indexOf(nextNode1);

        for (var nextNode2Index = 0; nextNode2Index < originalNode2.nextNodes.length; nextNode2Index++) {
          var nextNode2 = originalNode2.nextNodes[nextNode2Index];
          var nextNode2Row = nextColumn.indexOf(nextNode2);

          if (nextNode1Row > nextNode2Row) {
            nextColumn.splice(nextNode1Row, 1, nextNode2);
            nextColumn.splice(nextNode2Row, 1, nextNode1);
            // switch variables too (no temporary variables)
            nextNode1Row = nextNode2Row + (nextNode2Row = nextNode1Row, 0);
          }
        }
      }
    };

    var minimizeCrossingsArisingFromColumn = function(grid, columnIndex) {
      for (var rowIndex = 0; rowIndex < grid[columnIndex].length; rowIndex++) {
        for (var secondNodeIndex = rowIndex + 1; secondNodeIndex < grid[columnIndex].length; secondNodeIndex++) {
          minimizeCrossingsArisingFromColumnAndRows(grid, columnIndex, rowIndex, secondNodeIndex);
        }
      }
    };

    sugiyamaService.minimizeCrossings = function(grid) {
      for (var columnIndex = 0; columnIndex < grid.length; columnIndex++) {
        minimizeCrossingsArisingFromColumn(grid, columnIndex);
      }
    };

    var unlinkFakeNode = function (fakeNode) {
      // fake node: remove and connect nodes that it is connecting
      var previousNodes = fakeNode.previousNodes.slice(0); // copy since it's going to be modified
      previousNodes.forEach(function (previousNode) {
        // previous --> next1, previous --> next2, etc
        fakeNode.nextNodes.forEach(function (nextNode) {
          sugiyamaService.connectNodes(previousNode, nextNode);
        });

        // previous --X--> fake
        sugiyamaService.disconnectNodes(previousNode, fakeNode);
      });

      var nextNodes = fakeNode.nextNodes.slice(0); // copy since it's going to be modified
      nextNodes.forEach(function (nextNode) {
        sugiyamaService.disconnectNodes(fakeNode, nextNode);
      });
    };

    var removeFakeNodesColumn = function (column) {
      var rowIndex = column.length;
      while (rowIndex--) {
        var node = column[rowIndex];
        if (sugiyamaService.isFakeNode(node)) {
          unlinkFakeNode(node);
          column.splice(rowIndex, 1);
        }
      }
    };

    sugiyamaService.removeFakeNodes = function (grid) {
      for (var columnIndex = 0; columnIndex < grid.length; columnIndex++) {
        removeFakeNodesColumn(grid[columnIndex]);
      }
    };

    sugiyamaService.createNode = function (data) {
      return {
        data: data,
        nextNodes: [],
        previousNodes: []
      };
    };

    sugiyamaService.connectNodes = function (node, nextNode) {
      if (node.nextNodes.indexOf(nextNode) === -1) {
        node.nextNodes.push(nextNode);
      }

      if (nextNode.previousNodes.indexOf(node) === -1) {
        nextNode.previousNodes.push(node);
      }
    };

    sugiyamaService.disconnectNodes = function (previousNode, nextNode) {
      var nextNodeIndex = previousNode.nextNodes.indexOf(nextNode);
      if (nextNodeIndex > -1) {
        previousNode.nextNodes.splice(nextNodeIndex, 1);
      }

      var previousNodeIndex = nextNode.previousNodes.indexOf(nextNode);
      if (previousNodeIndex > -1) {
        nextNode.previousNodes.splice(previousNodeIndex, 1);
      }
    };

    sugiyamaService.getDrawingStructure = function (nodeArray) {
      var columns = sugiyamaService.arrangeInLayers(nodeArray);
      sugiyamaService.addFakeNodes(columns);
      sugiyamaService.minimizeCrossings(columns);

      return columns;
    };

    return sugiyamaService;
  }]);