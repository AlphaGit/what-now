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

    function recalculateTasksPositions (taskGrid) {
      nodePositions = {};
      var x = 30;
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
        angular.forEach(node.next, function (nextNode) {
          var arrowOrigin = nodePositions[node.graphingId];
          var arrowDestiny = nodePositions[nextNode.graphingId];

          var x2 = arrowDestiny.x;
          var y2 = arrowDestiny.y;
          var nextNodeIsFake = sugiyamaService.isFakeNode(nextNode);

          if (!nextNodeIsFake) {
            if (arrowOrigin.y > arrowDestiny.y) { // line is pointing upward
              y2 = y2 + 7;
              x2 = x2 - 8;
            } else if (arrowOrigin.y < arrowDestiny.y) { // arrow is pointing downward
              y2 = y2 - 7;
              x2 = x2 - 8;
            } else { // arrow is horizontal
              x2 = x2 - 10; // 10 less pixels to account for circle radius
            }
          }

          svg.append('line')
            .attr('x1', arrowOrigin.x)
            .attr('y1', arrowOrigin.y)
            .attr('x2', x2)
            .attr('y2', y2)
            .attr('stroke-width', 2)
            .attr('stroke', 'black')
            .attr('marker-end', nextNodeIsFake ? '' : 'url(#arrow)');
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
          'stroke-width': function (d) { return d.isSelected ? 1 : 0; }
        })
        .style('fill', function(d) {
          return d.isSelected ? 'yellow' : 'black';
        })
        .on('click', function(task) {
          scope.$apply(function() {
            scope.onTaskClicked(task);
          });
        });

      /*var labels = */
      groups.append('text')
        .each(function(d) {
          var el = d3Service.select(this);
          var chunks = textSizingService.breakInChunks(d.name, 100);
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

      $scope.$watch(function() {
        return $scope.taskList.map(function(task) {
          return {
            name: task.name,
            nextCount: task.next.length,
            previousCount: task.previous.length,
            isComplete: task.isComplete
          };
        });
      }, redraw, true);
    }

    function restartDrawing(svg) {
      svg.selectAll('*').remove();
      svg.append('defs')
        .append('marker')
        .attr('id', 'arrow')
        .attr('viewBox', '0 0 10 10')
        .attr('refX', 0)
        .attr('refY', 5)
        .attr('markerUnits', 'strokeWidth')
        .attr('markerWidth', 4)
        .attr('markerHeight', 3)
        .attr('orient', 'auto')
        .append('svg:path')
        .attr('d', 'M 0 0 L 10 5 L 0 10 z');
    }

    function indicateSuggestedTasks(taskList) {
      taskList = taskList.filter(function(task) {
        return task.isSuggested;
      });

      taskList.forEach(function(task) {
        var position = nodePositions[task.graphingId];

        svg.append('line')
          .attr('x1', position.x - 15)
          .attr('y1', position.y - 15)
          .attr('x2', position.x - 10)
          .attr('y2', position.y - 10)
          .attr('stroke-width', 3)
          .attr('stroke', 'black')
          .attr('marker-end', 'url(#arrow)');
      });
    }

    function redraw () {
      var taskList = scope.taskList;
      var taskGrid = sugiyamaService.getDrawingStructure(taskList);
      var newTaskList = flattenGrid(taskGrid);

      restartDrawing(svg);

      // ids needed to recalculate positions and create graphing structure
      ensureIds(newTaskList);

      // same objects, will also change the newTaskList elements
      recalculateTasksPositions(taskGrid);

      drawTasks(newTaskList);
      indicateSuggestedTasks(newTaskList);
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
