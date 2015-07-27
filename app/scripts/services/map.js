"use strict";

/**
 * @ngdoc function
 * @name rpgApp.service:MapServ
 * @description
 * #MapServ
 * Service of the rpgApp
**/

angular.module("rpgApp").service("MapServ", ["PixiServ", function (PixiServ) {

  var $scope = {};

  return {
    load: function() {
      return $.getJSON("resources/map.json", function(data) {
         $scope.map = data;
      });
    },
    reflect: function() {
      var reflectionX = _.random(1) === 1;
      var reflectionY = _.random(1) === 1;

      if (reflectionX) {
        for (var line in $scope.map) {
          $scope.map[line] = $scope.map[line].reverse();
        }
      }
      if (reflectionY) {
        var temp = [];
        for (var line in $scope.map) {
          temp.push($scope.map[line]);
        }
        for (var line in $scope.map) {
          $scope.map[line] = temp.pop();
        }
      }
    },
    create: function() {
      PixiServ.newMap($scope.map);
    },
    isWall: function(x, y) {
      var count = 0;
      for (var line in $scope.map) {
        if (count === y) {
          for (var i = 0; i < $scope.map[line].length; i++) {
            if (i === x) {
              return ($scope.map[line][i] === 0);
            }
          }
        }
        count += 1;
      }
    }
  };
}]);
