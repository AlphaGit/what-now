'use strict';

describe('Node model', function() {
  it('should be defined', function() {
    expect(Node).toBeDefined();
  });

  describe('#constructor', function() {
    it('should initialize fields when created', function() {
      var myData = { myData: true };
      var node = new Node(myData);

      expect(node.next).toBeDefined();
      expect(node.next.length).toBe(0);

      expect(node.previous).toBeDefined();
      expect(node.previous.length).toBe(0);

      expect(node.data).toBe(myData);
    });
  });

  describe('#addNext', function() {
    it('should be defined for instances', function() {
      var node = new Node();
      expect(node.addNext).toBeDefined();
    });

    it('should add a node to the list of next nodes', function() {
      var node1 = new Node();
      var node2 = new Node();

      node1.addNext(node2);

      expect(node1.next.length).toBe(1);
      expect(node1.next[0]).toBe(node2);
    });

    it('should allow only nodes to be added as next nodes', function() {
      var node = new Node();

      var addingNotANode = function() {
        node.addNext({ something: false });
      };

      expect(addingNotANode).toThrow();
    });

    it('should not add a same node as next twice', function() {
      var node1 = new Node();
      var node2 = new Node();

      node1.addNext(node2);
      node1.addNext(node2);

      expect(node1.next.length).toBe(1);
      expect(node1.next[0]).toBe(node2);
    });

    it('should add the next node as the previous for the original one', function() {
      var node1 = new Node();
      var node2 = new Node();

      node1.addNext(node2);

      expect(node2.previous.length).toBe(1);
      expect(node2.previous[0]).toBe(node1);
    });
  });

  describe('#addPrevious', function() {
    it('should be defined for instances', function() {
      var node = new Node();
      expect(node.addPrevious).toBeDefined();
    });

    it('should add a node to the list of next nodes', function() {
      var node1 = new Node();
      var node2 = new Node();

      node1.addPrevious(node2);

      expect(node1.previous.length).toBe(1);
      expect(node1.previous[0]).toBe(node2);
    });

    it('should allow only nodes to be added as next nodes', function() {
      var node = new Node();

      var addingNotANode = function() {
        node.addPrevious({ something: false });
      };

      expect(addingNotANode).toThrow();
    });

    it('should not add a same node as next twice', function() {
      var node1 = new Node();
      var node2 = new Node();

      node1.addPrevious(node2);
      node1.addPrevious(node2);

      expect(node1.previous.length).toBe(1);
      expect(node1.previous[0]).toBe(node2);
    });

    it('should add the previous node as the next` for the original one', function() {
      var node1 = new Node();
      var node2 = new Node();

      node1.addPrevious(node2);

      expect(node2.next.length).toBe(1);
      expect(node2.next[0]).toBe(node1);
    });
  });

  describe('#removeNext', function() {
    it('should be defined', function() {
      var node = new Node();
      expect(node.removeNext).toBeDefined();
    });

    it('should remove a node from the list of next nodes', function() {
      var node1 = new Node(1);
      var node2 = new Node(2);

      node1.addNext(node2);

      node1.removeNext(node2);

      expect(node1.next.length).toBe(0);
    });

    it('should update the list of previous nodes from the passed node', function() {
      var node1 = new Node(1);
      var node2 = new Node(2);

      node1.addNext(node2);
      node1.removeNext(node2);

      expect(node2.previous.length).toBe(0);
    });

    it('should not throw if the nodes where not connected', function() {
      var node1 = new Node(1);
      var node2 = new Node(2);

      var remove = function() {
        node1.removeNext(node2);
      };

      expect(remove).not.toThrow();
    });
  });

  describe('#toString', function() {
    it('should provide the node type and data', function() {
      var node = new Node('some data');
      var nodeString = node.toString();

      expect(nodeString.indexOf('Node') > -1).toBe(true);
      expect(nodeString.indexOf(node.data) > -1).toBe(true);
    });
  });
});