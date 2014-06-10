'use strict';

describe('sugiyamaService', function() {
  var sugiyama;
  beforeEach(function() {
    module('whatNowApp');

    inject(function(sugiyamaService) {
      sugiyama = sugiyamaService;
    });
  });

  describe('#createNode', function() {
    it('should be defined', function() {
      expect(sugiyama.createNode).toBeDefined();
    });

    it('should return a defined object', function() {
      expect(sugiyama.createNode()).toBeDefined();
    });

    it('should return an object that can retrieve the data back', function() {
      var data = { myData: 1 };
      expect(sugiyama.createNode(data).data).toBe(data);
    });

    it('should provide a node with no next nodes', function() {
      var node = sugiyama.createNode(1);
      expect(node.nextNodes.length).toBe(0);
      expect(node.previousNodes.length).toBe(0);
    });
  }); // #createNode

  describe('#connectNodes', function() {
    it('should be defined', function() {
      expect(sugiyama.connectNodes).toBeDefined();
    });

    it('should add a node to the list of next nodes', function() {
      var node1 = sugiyama.createNode(1);
      var node2 = sugiyama.createNode(2);
      sugiyama.connectNodes(node1, node2);

      expect(node1.nextNodes.length).toBe(1);
      expect(node1.nextNodes[0]).toBe(node2);
      expect(node2.nextNodes.length).toBe(0);
    });

    it('should add a node to the list of previous nodes', function() {
      var node1 = sugiyama.createNode(1);
      var node2 = sugiyama.createNode(2);
      sugiyama.connectNodes(node1, node2);

      expect(node2.previousNodes.length).toBe(1);
      expect(node2.previousNodes[0]).toBe(node1);
      expect(node1.previousNodes.length).toBe(0);
    });

    it('should not add a node twice to a list of next nodes', function() {
      var node1 = sugiyama.createNode(1);
      var node2 = sugiyama.createNode(2);
      sugiyama.connectNodes(node1, node2);
      sugiyama.connectNodes(node1, node2);

      expect(node1.nextNodes.length).toBe(1);
      expect(node1.nextNodes[0]).toBe(node2);
    });

    it('should not create bidirectional node connections', function() {
      var node1 = sugiyama.createNode(1);
      var node2 = sugiyama.createNode(2);
      sugiyama.connectNodes(node1, node2);

      expect(node2.nextNodes.length).toBe(0);
    });
  }); // #connectNodes

  describe('#disconnectNodes', function() {
    it('should be defined', function() {
      expect(sugiyama.disconnectNodes).toBeDefined();
    });

    it('should update the list of next nodes from the first node', function() {
      var node1 = sugiyama.createNode(1);
      var node2 = sugiyama.createNode(2);
      sugiyama.connectNodes(node1, node2);

      sugiyama.disconnectNodes(node1, node2);

      expect(node1.nextNodes.length).toBe(0);
    });

    it('should update the list of previous nodes from the second node', function() {
      var node1 = sugiyama.createNode(1);
      var node2 = sugiyama.createNode(2);
      sugiyama.createNode(node1, node2);

      sugiyama.disconnectNodes(node1, node2);

      expect(node2.previousNodes.length).toBe(0);
    });

    it('should not throw if the nodes were not connected', function() {
      var node1 = sugiyama.createNode(1);
      var node2 = sugiyama.createNode(2);

      var disconnect = function() {
        sugiyama.disconnectNodes(node1, node2);
      };

      expect(disconnect).not.toThrow();
    });
  }); // #disconnectNodes

  describe('#areAllPresent', function() {
    it('should be defined', function() {
      expect(sugiyama.areAllPresent).toBeDefined();
    });

    it('should return true if there is nothing to check (edge case)', function() {
      expect(sugiyama.areAllPresent([], [])).toBe(true);
    });

    it('should return false if the nodes are not present (empty list)', function() {
      var node1 = sugiyama.createNode(1);

      expect(sugiyama.areAllPresent([], [node1])).toBe(false);
    });

    it('should return false if the nodes are not present (items in list)', function() {
      var node1 = sugiyama.createNode(1);
      var node2 = sugiyama.createNode(2);

      expect(sugiyama.areAllPresent([node2], [node1])).toBe(false);
    });

    it('should return true if all nodes are present', function() {
      var node1 = sugiyama.createNode(1);
      var node2 = sugiyama.createNode(2);

      expect(sugiyama.areAllPresent([node1, node2], [node1, node2])).toBe(true);
    });

    it('should return false if only part of them are present', function() {
      var node1 = sugiyama.createNode(1);
      var node2 = sugiyama.createNode(2);

      expect(sugiyama.areAllPresent([node1], [node1, node2])).toBe(false);
    });
  }); //#areAllPresent

  describe('#isAnyPresent', function() {
    it('should be defined', function() {
      expect(sugiyama.isAnyPresent).toBeDefined();
    });

    it('should return false for an empty list', function() {
      var node = sugiyama.createNode(1);

      expect(sugiyama.isAnyPresent([], node.nextNodes)).toBe(false);
    });

    it('should return true if the nodes are present in the list', function() {
      var node1 = sugiyama.createNode(1);
      var node2 = sugiyama.createNode(2);

      expect(sugiyama.isAnyPresent([node2, node1], [node2, node1])).toBe(true);
    });

    it('should return false if the nodes are not present in the list', function() {
      var node1 = sugiyama.createNode(1);
      var node2 = sugiyama.createNode(2);
      var node3 = sugiyama.createNode(3);

      expect(sugiyama.isAnyPresent([node3], [node1, node2])).toBe(false);
    });

    it('should return true if at least one node is present in the list', function() {
      var node1 = sugiyama.createNode(1);
      var node2 = sugiyama.createNode(2);
      var node3 = sugiyama.createNode(3);

      expect(sugiyama.isAnyPresent([node1], [node1, node2, node3])).toBe(true);
    });
  }); //#isAnyPresent

  describe('#arrangeInLayers', function() {
    it('should be defined', function() {
      expect(sugiyama.arrangeInLayers).toBeDefined();
    });

    it('should return an empty array of layers if the passed node list is empty', function() {
      var layers = sugiyama.arrangeInLayers([]);
      expect(layers.length).toBe(0);
    });

    it('should return an empty array of layers if the passed node list is not passed', function() {
      var layers = sugiyama.arrangeInLayers();
      expect(layers.length).toBe(0);
    });

    it('should graph more than two layers of dependencies', function() {
      var node1 = sugiyama.createNode(1);
      var node2 = sugiyama.createNode(2);
      var node3 = sugiyama.createNode(3);

      sugiyama.connectNodes(node1, node2);
      sugiyama.connectNodes(node1, node3);
      sugiyama.connectNodes(node2, node3);
      // result: node1 -> node2 -> node3

      var layers = sugiyama.arrangeInLayers([node1, node2, node3]);

      expect(layers.length).toBe(3);

      // column 1 should only have node1
      expect(layers[0].length).toBe(1);
      expect(layers[0][0]).toBe(node1);

      // column 2 should only have node2
      expect(layers[1].length).toBe(1);
      expect(layers[1][0]).toBe(node2);

      // column 3 should only have node3
      expect(layers[2].length).toBe(1);
      expect(layers[2][0]).toBe(node3);
    });
  });

  describe('#getDrawingStructure', function() {
    it('should be defined', function() {
      expect(sugiyama.getDrawingStructure).toBeDefined();
    });

    it('should return an array of arrays', function() {
      var node = sugiyama.createNode(1);

      var diagram = sugiyama.getDrawingStructure([node]);

      expect(diagram.length).toBe(1);
      expect(diagram[0].length).toBe(1);
    });

    it('should graph dependencies in columns', function() {
      var node1 = sugiyama.createNode(1);
      var node2 = sugiyama.createNode(2);

      sugiyama.connectNodes(node1, node2);
      var diagram = sugiyama.getDrawingStructure([node1, node2]);

      expect(diagram.length).toBe(2);
      expect(diagram[0].length).toBe(1);
      expect(diagram[0][0]).toBe(node1);
      expect(diagram[1].length).toBe(1);
      expect(diagram[1][0]).toBe(node2);
    });

    /*it('should reorganize several crossings in a single layer', function() {
      // a1 ------\--- b ------/-- c
      //       /---\----------/
      // a2 --/     \----d
      // a1, a2 independent
      // (b depends on a1)
      // (c depends on b and a2)
      // (d depends on a1)

      var a1 = sugiyama.createNode('a1');
      var a2 = sugiyama.createNode('a2');
      var b = sugiyama.createNode('b');
      var c = sugiyama.createNode('c');
      var d = sugiyama.createNode('d');

      sugiyama.connectNodes(a1, b);
      sugiyama.connectNodes(a1, d);
      sugiyama.connectNodes(b, c);
      sugiyama.connectNodes(a2, c);
      
      var grid = sugiyama.getDrawingStructure([a1, a2, b, c, d]);
      expect(grid[0].length).toBe(2);
      expect(grid[0][0]).toBe(a2);
      expect(grid[0][1]).toBe(a1);

      expect(grid[1].length).toBe(2);
      expect(grid[1][0]).toBe(d);
      expect(grid[1][1]).toBe(b);

      expect(grid[2].length).toBe(1);
      expect(grid[2][0]).toBe(c);
    });*/
  }); // #getDrawingStructure

  describe('#hasNextNodes', function() {
    it('has to be defined', function() {
      expect(sugiyama.hasNextNodes).toBeDefined();
    });

    it('should return false for an unconnected node', function() {
      var node = sugiyama.createNode(1);

      expect(sugiyama.hasNextNodes(node)).toBe(false);
    });

    it('should return false for a node with no next nodes', function() {
      var node1 = sugiyama.createNode(1);
      var node2 = sugiyama.createNode(2);

      sugiyama.connectNodes(node1, node2);

      expect(sugiyama.hasNextNodes(node2)).toBe(false);
    });

    it('should return true for a node with next nodes', function() {
      var node1 = sugiyama.createNode(1);
      var node2 = sugiyama.createNode(2);
      
      sugiyama.connectNodes(node1, node2);

      expect(sugiyama.hasNextNodes(node1)).toBe(true);
    });
  }); // #hasNextNodes

  describe('#insertFakeNodeBeforeNext', function() {
    it('has to be defined', function() {
      expect(sugiyama.insertFakeNodeBeforeNext).toBeDefined();
    });

    it('should insert a fake node in the provided list', function() {
      var node1 = sugiyama.createNode(1);
      var node2 = sugiyama.createNode(2);
      sugiyama.connectNodes(node1, node2);
      var list = [];

      sugiyama.insertFakeNodeBeforeNext(list, node1, node2);

      expect(list.length).toBe(1);
      expect(sugiyama.isFakeNode(list[0])).toBe(true);
    });

    it('should bypass all next nodes with the fake node', function() {
      var node1 = sugiyama.createNode(1);
      var node2 = sugiyama.createNode(2);
      var node3 = sugiyama.createNode(3);

      sugiyama.connectNodes(node1, node2);
      sugiyama.connectNodes(node1, node3);

      var list = [];
      sugiyama.insertFakeNodeBeforeNext(list, node1, node2);
      sugiyama.insertFakeNodeBeforeNext(list, node1, node3);

      expect(node1.nextNodes.length).toBe(2);
      expect(sugiyama.isFakeNode(node1.nextNodes[0])).toBe(true);
      expect(sugiyama.isFakeNode(node1.nextNodes[1])).toBe(true);
      expect(node1.nextNodes[0].nextNodes.length).toBe(1);
      expect(node1.nextNodes[1].nextNodes.length).toBe(1);
      expect(node1.nextNodes[0].nextNodes[0] === node2 && node1.nextNodes[1].nextNodes[0] === node3 ||
        node1.nextNodes[0].nextNodes[0] === node3 && node1.nextNodes[1].nextNodes[0] === node2).toBe(true);
    });
  }); // #insertFakeNodeBeforeNext

  describe('#minimizeCrossings', function() {
    it('should be defined', function() {
      expect(sugiyama.minimizeCrossings).toBeDefined();
    });

    it('should minimize crossings in a simple graph', function() {
      // node1 --\ /-- node2       node1 ------- node4
      //          X            =>
      // node3 --/ \-- node4       node3 ------- node2

      var node1 = sugiyama.createNode(1);
      var node2 = sugiyama.createNode(2);
      var node3 = sugiyama.createNode(3);
      var node4 = sugiyama.createNode(4);

      sugiyama.connectNodes(node1, node4);
      sugiyama.connectNodes(node3, node2);

      var grid = [ [node1, node3], [node2, node4] ];

      sugiyama.minimizeCrossings(grid);

      expect(grid[0][0]).toBe(node1);
      expect(grid[0][1]).toBe(node3);
      expect(grid[1][0]).toBe(node4);
      expect(grid[1][1]).toBe(node2);
    });

    it('should not affect graphs without crossings', function() {
      // node1 ------- node2       node1 ------- node2
      //                       =>
      // node3 ------- node4       node3 ------- node4

      var node1 = sugiyama.createNode(1);
      var node2 = sugiyama.createNode(2);
      var node3 = sugiyama.createNode(3);
      var node4 = sugiyama.createNode(4);

      sugiyama.connectNodes(node1, node2);
      sugiyama.connectNodes(node3, node4);

      var grid = [ [node1, node3], [node2, node4] ];

      sugiyama.minimizeCrossings(grid);

      expect(grid[0][0]).toBe(node1);
      expect(grid[0][1]).toBe(node3);
      expect(grid[1][0]).toBe(node2);
      expect(grid[1][1]).toBe(node4);
    });

    it('should minimize crossings across the graph', function() {
      // node1 --\       node2       /-- node3      node1 --\     node2     /-- node3
      //          \                 /                        \             /
      // node4 ----\---- node5 ----/---- node6   => node4 --\ \-- node7 --/ /-- node6
      //            \             /                          \             /
      //             \-- node7 --/                            \-- node5 --/

      var node1 = sugiyama.createNode(1);
      var node2 = sugiyama.createNode(2);
      var node3 = sugiyama.createNode(3);
      var node4 = sugiyama.createNode(4);
      var node5 = sugiyama.createNode(5);
      var node6 = sugiyama.createNode(6);
      var node7 = sugiyama.createNode(7);

      sugiyama.connectNodes(node1, node7);
      sugiyama.connectNodes(node4, node5);
      sugiyama.connectNodes(node5, node6);
      sugiyama.connectNodes(node7, node3);

      var grid = [ [node1, node4], [node2, node5, node7], [node3, node6] ];

      sugiyama.minimizeCrossings(grid);

      expect(grid[0][0]).toBe(node1);
      expect(grid[0][1]).toBe(node4);
      expect(grid[1][0]).toBe(node2);
      expect(grid[1][1]).toBe(node7);
      expect(grid[1][2]).toBe(node5);
      expect(grid[2][0]).toBe(node3);
      expect(grid[2][1]).toBe(node6);
    });

    it('should minimize crossings sequentially', function() {
      // node1 --\ /-- node2 --- node3      node1 --- node5 --- node6
      //          X                     =>
      // node4 --/ \-- node5 --- node6      node4 --- node2 --- node3

      var node1 = sugiyama.createNode(1);
      var node2 = sugiyama.createNode(2);
      var node3 = sugiyama.createNode(3);
      var node4 = sugiyama.createNode(4);
      var node5 = sugiyama.createNode(5);
      var node6 = sugiyama.createNode(6);

      sugiyama.connectNodes(node1, node5);
      sugiyama.connectNodes(node5, node6);
      sugiyama.connectNodes(node4, node2);
      sugiyama.connectNodes(node2, node3);

      var grid = [ [node1, node4], [node2, node5], [node3, node6] ];

      sugiyama.minimizeCrossings(grid);

      expect(grid[0][0]).toBe(node1);
      expect(grid[0][1]).toBe(node4);
      expect(grid[1][0]).toBe(node5);
      expect(grid[1][1]).toBe(node2);
      expect(grid[2][0]).toBe(node6);
      expect(grid[2][1]).toBe(node3);
    });
  }); // #minimizeCrossings

  describe('#addFakeNodes', function() {
    it('has to be defined', function() {
      expect(sugiyama.addFakeNodes).toBeDefined();
    });

    it('should not affect the graph if there are no gaps', function() {
      // node1 --\ /-- node2 --- node3
      //          X
      // node4 --/ \-- node5 --- node6

      var node1 = sugiyama.createNode(1);
      var node2 = sugiyama.createNode(2);
      var node3 = sugiyama.createNode(3);
      var node4 = sugiyama.createNode(4);
      var node5 = sugiyama.createNode(5);
      var node6 = sugiyama.createNode(6);

      sugiyama.connectNodes(node1, node5);
      sugiyama.connectNodes(node4, node2);
      sugiyama.connectNodes(node2, node3);
      sugiyama.connectNodes(node5, node6);

      var grid = [ [node1, node4], [node2, node5], [node3, node6] ];

      sugiyama.addFakeNodes(grid);

      expect(grid[0][0]).toBe(node1);
      expect(grid[0][1]).toBe(node4);
      expect(grid[1][0]).toBe(node2);
      expect(grid[1][1]).toBe(node5);
      expect(grid[2][0]).toBe(node3);
      expect(grid[2][1]).toBe(node6);
    });

    it('should add fake nodes so that all connections are only one column wide (nodes without next in following column)', function() {
      // node1 --- node2 --/-- node3      node1 --- node2 ---/--- node3
      //                  /           =>                    /
      // node4 ----------/                node4 --- fake --/

      var node1 = sugiyama.createNode(1);
      var node2 = sugiyama.createNode(2);
      var node3 = sugiyama.createNode(3);
      var node4 = sugiyama.createNode(4);

      sugiyama.connectNodes(node1, node2);
      sugiyama.connectNodes(node2, node3);
      sugiyama.connectNodes(node4, node3);

      var grid = [ [node1, node4], [node2], [node3] ];

      sugiyama.addFakeNodes(grid);

      expect(grid[0][0]).toBe(node1);
      expect(grid[0][1]).toBe(node4);
      expect(grid[1][0]).toBe(node2);
      expect(sugiyama.isFakeNode(grid[1][1])).toBe(true);
      expect(grid[2][0]).toBe(node3);
    });

    it('should add fake nodes so that all connections are only one column wide (nodes with next in following column)', function() {
      // node1 ----/-- node2 --/-- node3      node1 ----/-- node2 ---/-- node3
      //          /           /           =>           /            /
      // node4 --/-----------/                node4 --/---- fake --/

      var node1 = sugiyama.createNode(1);
      var node2 = sugiyama.createNode(2);
      var node3 = sugiyama.createNode(3);
      var node4 = sugiyama.createNode(4);

      sugiyama.connectNodes(node1, node2);
      sugiyama.connectNodes(node2, node3);
      sugiyama.connectNodes(node4, node2);
      sugiyama.connectNodes(node4, node3);

      var grid = [ [node1, node4], [node2], [node3] ];

      sugiyama.addFakeNodes(grid);

      expect(grid[0][0]).toBe(node1);
      expect(grid[0][1]).toBe(node4);
      expect(grid[1][0]).toBe(node2);
      expect(sugiyama.isFakeNode(grid[1][1])).toBe(true);
      expect(grid[2][0]).toBe(node3);
    });

    it('should add fake nodes for each column with gaps', function() {
      // node1 --- (void) --- (void) --- (void) --- node2
      //
      //                        =>
      //
      // node1 --- (fake) --- (fake) --- (fake) --- node2

      var node1 = sugiyama.createNode(1);
      var node2 = sugiyama.createNode(2);

      sugiyama.connectNodes(node1, node2);

      var grid = [ [node1], [], [], [], [node2] ];

      sugiyama.addFakeNodes(grid);

      expect(grid[0][0]).toBe(node1);
      expect(sugiyama.isFakeNode(grid[1][0])).toBe(true);
      expect(sugiyama.isFakeNode(grid[2][0])).toBe(true);
      expect(sugiyama.isFakeNode(grid[3][0])).toBe(true);
      expect(grid[4][0]).toBe(node2);
    });

    it('should add fake nodes in all necessary layers', function() {
      //           /-------------------------\
      //          /                           \
      // node1 --X----------------/--> node4 --\--> node5
      //          \              /
      // node2 ----\--> node3 --/
      //
      //                      =>
      //
      //           /--> (fake) ------> (fake) --\
      //          /                              \
      // node1 --X----> (fake) ---/--> node4 -----\--> node5
      //          \              /
      // node2 ----\--> node3 --/

      var node1 = sugiyama.createNode(1);
      var node2 = sugiyama.createNode(2);
      var node3 = sugiyama.createNode(3);
      var node4 = sugiyama.createNode(4);
      var node5 = sugiyama.createNode(5);

      sugiyama.connectNodes(node1, node3);
      sugiyama.connectNodes(node1, node4);
      sugiyama.connectNodes(node1, node5);
      sugiyama.connectNodes(node2, node3);
      sugiyama.connectNodes(node3, node4);
      sugiyama.connectNodes(node4, node5);

      var grid = [[node1, node2], [node3], [node4], [node5]];

      sugiyama.addFakeNodes(grid);

      expect(grid[0].length).toBe(2);
      expect(grid[0][0]).toBe(node1);
      expect(grid[0][1]).toBe(node2);

      expect(grid[1].length).toBe(3);
      expect(grid[1][0]).toBe(node3);
      expect(sugiyama.isFakeNode(grid[1][1])).toBe(true);
      expect(sugiyama.isFakeNode(grid[1][2])).toBe(true);

      expect(grid[2].length).toBe(2);
      expect(grid[2][0]).toBe(node4);
      expect(sugiyama.isFakeNode(grid[2][1])).toBe(true);

      expect(grid[3].length).toBe(1);
      expect(grid[3][0]).toBe(node5);
    });
  }); // #addFakeNodes

  describe('#removeFakeNodes', function() {
    it('should be defined', function() {
      expect(sugiyama.removeFakeNodes).toBeDefined();
    });

    it('should remove fake nodes', function() {
      // node1 --- (void) --- (void) --- (void) --- node2
      //
      //                        =>
      //
      // node1 --- (fake) --- (fake) --- (fake) --- node2
      //
      //                        =>
      //
      // node1 --- (void) --- (void) --- (void) --- node2

      var node1 = sugiyama.createNode(1);
      var node2 = sugiyama.createNode(2);

      sugiyama.connectNodes(node1, node2);

      var grid = [ [node1], [], [], [], [node2] ];

      sugiyama.addFakeNodes(grid);
      sugiyama.removeFakeNodes(grid);

      expect(grid[0][0]).toBe(node1);
      expect(grid[1].length).toBe(0);
      expect(grid[2].length).toBe(0);
      expect(grid[3].length).toBe(0);
      expect(grid[4][0]).toBe(node2);

    });
  }); // #removeFakeNodes
});