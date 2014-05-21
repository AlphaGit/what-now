angular.module('whatNowApp')
  .directive('d3Pert', ['$window', 'd3Service', 'sugiyamaService', 'textSizingService',
  function ($window, d3Service, sugiyamaService, textSizingService) {
    'use strict';

    var svg;
    var taskPositions;
    var scope;

    function recalculateTasksPositions (taskList) {
      var nodeHash = {};

      // created nodes
      var nodes = taskList.map(function (task) {
        var node = sugiyamaService.createNode(task);
        nodeHash[task.id] = node;
        return node;
      });

      // connect nodes
      nodes.forEach(function (node) {
        node.data.dependsOn.forEach(function (taskDependedUpon) {
          sugiyamaService.connectNodes(nodeHash[taskDependedUpon.id], node);
        });
      });

      var columns = sugiyamaService.getDrawingStructure(nodes);

      taskPositions = {};
      var x = 0;
      var y = 0;

      angular.forEach(columns, function (row) {
        x += 100;

        angular.forEach(row, function (node) {
          y += 90;

          taskPositions[node.data.id] = { x: x, y: y };
        });

        y = 0;
      });
    }

    function drawDependencies (taskList) {
      angular.forEach(taskList, function (dependentTask) {
        angular.forEach(dependentTask.dependsOn, function (taskDependedUpon) {
          var arrowOrigin = taskPositions[taskDependedUpon.id];
          var arrowDestiny = taskPositions[dependentTask.id];

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
        .data(taskList, function (d) { return d.id; })
        .enter()
        .append('g')
        .attr('transform', function(d) {
          var x = taskPositions[d.id].x;
          var y = taskPositions[d.id].y;
          return 'translate(' + x + ', ' + y + ')';
        });

      /*var circles = */
      groups.append('circle')
        .attr({
          cx: 0,
          cy: 0,
          r: 5,
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

      $scope.$watch('taskList', redraw, true);
    }

    function redraw (taskList) {
      recalculateTasksPositions(taskList);

      svg.selectAll('*').remove();

      drawTasks(taskList);
      drawDependencies(taskList);
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