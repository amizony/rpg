"use strict";

/**
 * @ngdoc function
 * @name rpgApp.service:MapServ
 * @description
 * #MapServ
 * Service of the rpgApp
**/

angular.module("rpgApp").service("MapServ", function () {

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
      var temp = [];
      for (var i = 0; i < $scope.map.length; i++) {
        temp.push($scope.map[i]);
      }
      if (reflectionY) {
        var j = $scope.map.length - 1;
        for (var i = 0; i < $scope.map.length; i++) {
          $scope.map[i] = temp[j];
          j -= 1;
        }
      }
    },

    /**
     * Check whether a specific cell is a wall (unpathable by characters).
     *
     * @param {array} cell Cell coordinates, as [x, y].
     * @return {boolean} true if the cell is wall, false otherwise.
     */
    isWall: function(cell) {
      // The map is stored row-wise (y-axis first).
      return $scope.map[cell[1]][cell[0]] === 0;
    },

    getMap: function() {
      return $scope.map;
    }
  };
});
