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
         $scope.map = data.map;
      });
    },
    reflect: function() {
      var reflectionX = _.random(1) === 1;
      var reflectionY = _.random(1) === 1;

      if (reflectionX) {
        for (var i = 0; i < $scope.map.length; i++) {
          $scope.map[i] = $scope.map[i].reverse();
        }
      }
      if (reflectionY) {
        var temp = $scope.map;
        var j = $scope.map.length - 1;
        for (var i = 0; i < $scope.map.length; i++) {
          $scope.map[i] = temp[j];
          j -= 1;
        }
      }
    },
    create: function() {
      PixiServ.newMap($scope.map);
    },
    isWall: function(x, y) {
      for (var i = 0; i < $scope.map.length; i++) {
        if (i === y) {
          for (var j = 0; j < $scope.map[i].length; j++) {
            if (j === x) {
              return ($scope.map[i][j] === 0);
            }
          }
        }
      }
    }
  };
}]);
