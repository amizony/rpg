"use strict";

/**
 * @ngdoc function
 * @name rpgApp.service:MapServ
 * @description
 * Service containing the map.
**/

angular.module("rpgApp").service("MapServ", function () {

  var $scope = {};

  return {
    load: function() {
      /**
       * Load the map from a JSON file.
       *
       * @return {promise} fulfilled when the map is loaded.
      **/
      return $.getJSON("resources/map.json", function(data) {
        $scope.map = data.map;
      });
    },
    reflect: function() {
      /**
       * Apply a vertical or horizontal reflection to the map
       * to provide 4 differents layouts from the same file.
      **/
      var reflectionX = _.random(1) === 1;
      var reflectionY = _.random(1) === 1;

      if (reflectionX) {
        for (var i = 0; i < $scope.map.length; i++) {
          $scope.map[i] = $scope.map[i].reverse();
        }
      }
      if (reflectionY) {
        $scope.map = $scope.map.reverse();
      }
    },
    isWall: function(cell) {
      /**
       * Check whether a specific cell is a wall.
       *
       * @param {array} cell coordinates as [x, y].
       * @return {boolean} true if the cell is wall, false otherwise.
      **/
      // The map is stored row-wise (y-axis first).
      return $scope.map[cell[1]][cell[0]] === 0;
    },
    getMap: function() {
      return $scope.map;
    }
  };
});
