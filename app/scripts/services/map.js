"use strict";

/**
 * @ngdoc function
 * @name rpgApp.service:MapServ
 * @description
 * Service containing the map.
 */

angular.module("rpgApp").service("MapServ", function () {

  var $scope = {};

  return {
    /**
     * Load the map from a JSON file.
     *
     * @return {promise} fulfilled when the map is loaded.
     */
    load: function() {
      return $.getJSON("resources/map.json", function(data) {
        $scope.map = data.map;
      });
    },

    /**
     * Apply a vertical or horizontal reflection to the map
     * to provide 4 differents layouts from the same file.
     */
    reflect: function() {
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

    /**
     * Check whether a specific cell is a wall.
     *
     * @param {array} cell: coordinates of cell to test, as [x, y].
     * @return {boolean} true if the cell is a wall or outside range, false otherwise.
     */
    isWall: function(cell) {
      if ((cell[0] >= $scope.map[0].length) || (cell[1] >= $scope.map.length)) {
        return true;
      } else {
        // The map is stored row-wise (y-axis first).
        return $scope.map[cell[1]][cell[0]] === 0;
      }
    },
    getMap: function() {
      return $scope.map;
    }
  };
});
