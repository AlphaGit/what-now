angular.module('whatNowApp')
  .directive('d3Pert', ['$window', 'd3Service', 'sugiyamaService', 'textSizingService',
  function ($window, d3Service, sugiyamaService, textSizingService) {
    'use strict';

    var svg;
    var nodePositions;
    var scope;

    function ensureIds (taskList) {
      var graphingId = 1;

      taskList.forEach(function(task) {
        task.graphingId = graphingId++;
      });
    }

    function getDrawingStructure (taskList) {
      var taskNodeHash = {};

      // created nodes
      var nodes = taskList.map(function (task) {
        var node = sugiyamaService.createNode(task);
        taskNodeHash[task.id] = node;
        return node;
      });

      // connect nodes
      nodes.forEach(function (node) {
        node.data.dependsOn.forEach(function (taskDependedUpon) {
          sugiyamaService.connectNodes(taskNodeHash[taskDependedUpon.id], node);
        });
      });

      return sugiyamaService.getDrawingStructure(nodes);
    }

    function recalculateTasksPositions (taskGrid) {
      nodePositions = {};
      var x = 20;
      var y = 30;

      angular.forEach(taskGrid, function (row) {
        angular.forEach(row, function (node) {
          nodePositions[node.graphingId] = { x: x, y: y };
          y += 90;
        });

        x += 100;
        y = 30;
      });
    }

    function flattenGrid(taskGrid) {
      // see http://stackoverflow.com/a/10865042/147507
      var flattenedArray = [];
      return flattenedArray.concat.apply(flattenedArray, taskGrid);
    }

    function drawDependencies (nodeList) {
      angular.forEach(nodeList, function (node) {
        angular.forEach(node.nextNodes, function (nextNode) {
          var arrowOrigin = nodePositions[node.graphingId];
          var arrowDestiny = nodePositions[nextNode.graphingId];

          svg.append('line')
            .attr('x1', arrowOrigin.x)
            .attr('y1', arrowOrigin.y)
            .attr('x2', arrowDestiny.x)
            .attr('y2', arrowDestiny.y)
            .attr('stroke-width', 2)
            .attr('stroke', 'black');
        });
      });
    }

    function drawTasks (taskList) {
      var groups = svg.selectAll('g')
        .data(taskList, function (d) {
          return d.graphingId;
        })
        .enter()
        .append('g')
        .attr('transform', function(d) {
          var x = nodePositions[d.graphingId].x;
          var y = nodePositions[d.graphingId].y;
          return 'translate(' + x + ', ' + y + ')';
        });

      /*var circles = */
      groups.append('circle')
        .attr({
          cx: 0,
          cy: 0,
          r: function(d) { return sugiyamaService.isFakeNode(d) ? 0 : 5; },
          stroke: 'black',
          'stroke-width': function (d) { return d.data.isSelected ? 1 : 0; }
        })
        .style('fill', function(d) {
          return d.data.isSelected ? 'yellow' : 'black';
        })
        .on('click', function(task) {
          scope.$apply(function() {
            scope.onTaskClicked(task);
          });
        });

      /*var labels = */
      groups.append('text')
        .each(function(d) {
          var task = d.data;
          var el = d3Service.select(this);
          var chunks = textSizingService.breakInChunks(task.name, 100);
          var y = 20;
          chunks.forEach(function (chunk) {
            el.append('tspan')
              .text(chunk)
              .attr({
                y: y,
                x: 0
              });
            y += 14;
          });
        })
        .attr({
          fill: 'black',
          'alignment-baseline': 'middle',
          'text-anchor': 'middle',
          y: -20
        });
    }

    function link ($scope, element) {
      scope = $scope;
      svg = d3Service.select(element[0]).append('svg');

      svg.attr('height', 300)
         .attr('width', '100%');

      $scope.$watch('taskList', redraw, true);
    }

    function redraw (taskList) {
      var taskGrid = getDrawingStructure(taskList);
      var newTaskList = flattenGrid(taskGrid);

      svg.selectAll('*').remove();

      // ids needed to recalculate positions and create graphing structure
      ensureIds(newTaskList);

      // same objects, will also change the newTaskList elements
      recalculateTasksPositions(taskGrid);

      drawTasks(newTaskList);
      drawDependencies(newTaskList);
    }

    return {
      restrict: 'EA',
      scope: {
        taskList: '=',
        onTaskClicked: '='
      },
      link: link
    };
  }]);