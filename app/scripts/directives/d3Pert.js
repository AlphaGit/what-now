angular.module('whatNowApp')
  .directive('d3Pert', ['$window', 'd3Service', 'dependencyResolutionService',
  function ($window, d3Service, dependencyResolutionService) {
    'use strict';

    var svg;
    var taskPositions;

    function recalculateTasksPositions (taskLayers) {
      taskPositions = {};
      var x = 0;
      var y = 0;

      angular.forEach(taskLayers, function (layer) {
        x += 50;

        angular.forEach(layer, function (task) {
          y += 50;

          taskPositions[task.id] = { x: x, y: y };
        });

        y = 0;
      });
    }

    function drawLayer (layer) {
      var groups = svg.selectAll('g')
        .data(layer, function (d) { return d.id; })
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
          r: 5
        });

      /*var labels = */
      groups.append('text')
        .text(function(d) { return d.name; })
        .attr({
          fill: 'black',
          'alignment-baseline': 'middle',
          'text-anchor': 'middle',
          y: -20
        });
    }

    function link ($scope, element) {
      svg = d3Service.select(element[0]).append('svg');

      svg.attr('height', 500)
         .attr('width', '100%');

      $scope.$watchCollection('taskList', redraw);
    }

    function redraw (taskList) {
      var layeredTasks = dependencyResolutionService.arrangeInLayers(taskList);
      recalculateTasksPositions(layeredTasks);

      svg.selectAll('*').remove();

      angular.forEach(layeredTasks, function (layer) {
        drawLayer(layer);
      });
    }

    return {
      restrict: 'EA',
      scope: {
        taskList: '='
      },
      link: link
    };
  }]);