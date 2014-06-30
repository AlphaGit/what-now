'use strict';

describe('sugiyamaService', function() {
  var sugiyama;
  beforeEach(function() {
    module('whatNowApp');

    inject(function(sugiyamaService) {
      sugiyama = sugiyamaService;
    });
  });

  describe('#areAllPresent', function() {
    it('should be defined', function() {
      expect(sugiyama.areAllPresent).toBeDefined();
    });

    it('should return true if there is nothing to check (edge case)', function() {
      expect(sugiyama.areAllPresent([], [])).toBe(true);
    });

    it('should return false if the nodes are not present (empty list)', function() {
      var node1 = new Node(1);

      expect(sugiyama.areAllPresent([], [node1])).toBe(false);
    });

    it('should return false if the nodes are not present (items in list)', function() {
      var node1 = new Node(1);
      var node2 = new Node(2);

      expect(sugiyama.areAllPresent([node2], [node1])).toBe(false);
    });

    it('should return true if all nodes are present', function() {
      var node1 = new Node(1);
      var node2 = new Node(2);

      expect(sugiyama.areAllPresent([node1, node2], [node1, node2])).toBe(true);
    });

    it('should return false if only part of them are present', function() {
      var node1 = new Node(1);
      var node2 = new Node(2);

      expect(sugiyama.areAllPresent([node1], [node1, node2])).toBe(false);
    });
  }); //#areAllPresent

  describe('#isAnyPresent', function() {
    it('should be defined', function() {
      expect(sugiyama.isAnyPresent).toBeDefined();
    });

    it('should return false for an empty list', function() {
      var node = new Node(1);

      expect(sugiyama.isAnyPresent([], node.next)).toBe(false);
    });

    it('should return true if the nodes are present in the list', function() {
      var node1 = new Node(1);
      var node2 = new Node(2);

      expect(sugiyama.isAnyPresent([node2, node1], [node2, node1])).toBe(true);
    });

    it('should return false if the nodes are not present in the list', function() {
      var node1 = new Node(1);
      var node2 = new Node(2);
      var node3 = new Node(3);

      expect(sugiyama.isAnyPresent([node3], [node1, node2])).toBe(false);
    });

    it('should return true if at least one node is present in the list', function() {
      var node1 = new Node(1);
      var node2 = new Node(2);
      var node3 = new Node(3);

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
      var node1 = new Node(1);
      var node2 = new Node(2);
      var node3 = new Node(3);

      node1.addNext(node2);
      node1.addNext(node3);
      node2.addNext(node3);
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
      var node = new Node(1);

      var diagram = sugiyama.getDrawingStructure([node]);

      expect(diagram.length).toBe(1);
      expect(diagram[0].length).toBe(1);
    });

    it('should graph dependencies in columns', function() {
      var node1 = new Node(1);
      var node2 = new Node(2);

      node1.addNext(node2);
      var diagram = sugiyama.getDrawingStructure([node1, node2]);

      expect(diagram.length).toBe(2);
      expect(diagram[0].length).toBe(1);
      expect(diagram[0][0].data).toBe(node1.data);
      expect(diagram[1].length).toBe(1);
      expect(diagram[1][0].data).toBe(node2.data);
    });

    it('should reorganize several crossings in a single layer', function() {
      // a1 ------\--- b ------/-- c      a1 --\--- b ---/-- c
      //       /---\----------/       =>        \-- d   /
      // a2 --/     \----d                a2 ----------/
      //
      // a1, a2 independent
      // (b depends on a1)
      // (c depends on b and a2)
      // (d depends on a1)

      var a1 = new Node('a1');
      var a2 = new Node('a2');
      var b = new Node('b');
      var c = new Node('c');
      var d = new Node('d');

      a1.addNext(b);
      a1.addNext(d);
      b.addNext(c);
      a2.addNext(c);
      
      var grid = sugiyama.getDrawingStructure([a1, a2, b, c, d]);
      expect(grid[0].length).toBe(2);
      expect(grid[0][0].data).toBe(a2.data);
      expect(grid[0][1].data).toBe(a1.data);

      expect(grid[1].length).toBe(3);
      expect(sugiyama.isFakeNode(grid[1][0])).toBe(true);
      expect(grid[1][1].data).toBe(d.data);
      expect(grid[1][2].data).toBe(b.data);

      expect(grid[2].length).toBe(1);
      expect(grid[2][0].data).toBe(c.data);
    });

    it('should not modify the relationships of the original nodes', function() {
      var node1 = new Node('1');
      var node2 = new Node('2');
      var node3 = new Node('3');

      node1.addNext(node2);
      node1.addNext(node3);
      node2.addNext(node3);

      sugiyama.getDrawingStructure([node1, node2, node3]);

      expect(node1.next.length).toBe(2);
      expect(node1.next[0].data).toBe('2');
      expect(node1.next[1].data).toBe('3');
      expect(node2.next.length).toBe(1);
      expect(node2.next[0].data).toBe('3');
    });

    it('should include a reference to the original nodes of the graph', function() {
      var node1 = new Node(1);
      var node2 = new Node(2);
      var node3 = new Node(3);

      var grid = sugiyama.getDrawingStructure([node1, node2, node3]);

      expect(grid[0][0]).not.toBe(node1);
      expect(grid[0][1]).not.toBe(node2);
      expect(grid[0][2]).not.toBe(node3);

      expect(grid[0][2].originalNode).toBe(node1);
      expect(grid[0][1].originalNode).toBe(node2);
      expect(grid[0][0].originalNode).toBe(node3);
    });
  }); // #getDrawingStructure

  describe('#insertFakeNodeBeforeNext', function() {
    it('has to be defined', function() {
      expect(sugiyama.insertFakeNodeBeforeNext).toBeDefined();
    });

    it('should insert a fake node in the provided list', function() {
      var node1 = new Node(1);
      var node2 = new Node(2);
      node1.addNext(node2);
      var list = [];

      sugiyama.insertFakeNodeBeforeNext(list, node1, node2);

      expect(list.length).toBe(1);
      expect(sugiyama.isFakeNode(list[0])).toBe(true);
    });

    it('should bypass all next nodes with the fake node', function() {
      var node1 = new Node(1);
      var node2 = new Node(2);
      var node3 = new Node(3);

      node1.addNext(node2);
      node1.addNext(node3);

      var list = [];
      sugiyama.insertFakeNodeBeforeNext(list, node1, node2);
      sugiyama.insertFakeNodeBeforeNext(list, node1, node3);

      expect(node1.next.length).toBe(2);
      expect(sugiyama.isFakeNode(node1.next[0])).toBe(true);
      expect(sugiyama.isFakeNode(node1.next[1])).toBe(true);
      expect(node1.next[0].next.length).toBe(1);
      expect(node1.next[1].next.length).toBe(1);
      expect(node1.next[0].next[0] === node2 && node1.next[1].next[0] === node3 ||
        node1.next[0].next[0] === node3 && node1.next[1].next[0] === node2).toBe(true);
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

      var node1 = new Node(1);
      var node2 = new Node(2);
      var node3 = new Node(3);
      var node4 = new Node(4);

      node1.addNext(node4);
      node3.addNext(node2);

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

      var node1 = new Node(1);
      var node2 = new Node(2);
      var node3 = new Node(3);
      var node4 = new Node(4);

      node1.addNext(node2);
      node3.addNext(node4);

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

      var node1 = new Node(1);
      var node2 = new Node(2);
      var node3 = new Node(3);
      var node4 = new Node(4);
      var node5 = new Node(5);
      var node6 = new Node(6);
      var node7 = new Node(7);

      node1.addNext(node7);
      node4.addNext(node5);
      node5.addNext(node6);
      node7.addNext(node3);

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

      var node1 = new Node(1);
      var node2 = new Node(2);
      var node3 = new Node(3);
      var node4 = new Node(4);
      var node5 = new Node(5);
      var node6 = new Node(6);

      node1.addNext(node5);
      node5.addNext(node6);
      node4.addNext(node2);
      node2.addNext(node3);

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

      var node1 = new Node(1);
      var node2 = new Node(2);
      var node3 = new Node(3);
      var node4 = new Node(4);
      var node5 = new Node(5);
      var node6 = new Node(6);

      node1.addNext(node5);
      node4.addNext(node2);
      node2.addNext(node3);
      node5.addNext(node6);

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

      var node1 = new Node(1);
      var node2 = new Node(2);
      var node3 = new Node(3);
      var node4 = new Node(4);

      node1.addNext(node2);
      node2.addNext(node3);
      node4.addNext(node3);

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

      var node1 = new Node(1);
      var node2 = new Node(2);
      var node3 = new Node(3);
      var node4 = new Node(4);

      node1.addNext(node2);
      node2.addNext(node3);
      node4.addNext(node2);
      node4.addNext(node3);

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

      var node1 = new Node(1);
      var node2 = new Node(2);

      node1.addNext(node2);

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

      var node1 = new Node(1);
      var node2 = new Node(2);
      var node3 = new Node(3);
      var node4 = new Node(4);
      var node5 = new Node(5);

      node1.addNext(node3);
      node1.addNext(node4);
      node1.addNext(node5);
      node2.addNext(node3);
      node3.addNext(node4);
      node4.addNext(node5);

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

      var node1 = new Node(1);
      var node2 = new Node(2);

      node1.addNext(node2);

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