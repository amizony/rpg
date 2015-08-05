"use strict";

/**
 * @ngdoc function
 * @name rpgApp.service:CharServ
 * @description
 * #CharServ
 * Service of the rpgApp
**/

angular.module("rpgApp").service("CharServ", ["MapServ", function (MapServ) {

  var $scope = {};
  $scope.position = {
    x: 0,
    y: 0
  };

  function randPos() {
    var posX = _.random(1,23);
    var posY = _.random(1,17);
    while (MapServ.isWall([posX, posY])) {
      posX = _.random(1,23);
      posY = _.random(1,17);
    }
    return [posX, posY];
  }


  return {
    create: function() {
      var position = randPos();
      $scope.position.x = position[0];
      $scope.position.y = position[1];
      // and other char inits
    },
    getPosition: function() {
      return [$scope.position.x, $scope.position.y];
    },
    updatePosition: function(direction) {
      $scope.position.x += direction[0];
      $scope.position.y += direction[1];
      console.log("New hero location: " + $scope.position.x + ", " + $scope.position.y);
    },
    getAllDatas: function() {
      return {};
    }
  };

}]);
