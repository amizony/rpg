"use strict";

/**
 * @ngdoc function
 * @name rpgApp.service:CharServ
 * @description
 * #CharServ
 * Service of the rpgApp
**/

angular.module("rpgApp").service("CharServ", ["MapServ", "PixiServ", function (MapServ, PixiServ) {

  var $scope = {};
  $scope.position = {
    x: 0,
    y: 0
  };

  function randPos() {
    var posX = _.random(1,23);
    var posY = _.random(1,17);
    while (MapServ.isWall(posX, posY)) {
      posX = _.random(1,23);
      posY = _.random(1,17);
    }
    return [posX, posY];
  }


  return {
    create: function() {
      var pos = randPos();
      PixiServ.newChar(pos[0], pos[1]);
      $scope.position.x = pos[0];
      $scope.position.y = pos[1];
    },
    move: function(dir) {
      if ( !MapServ.isWall($scope.position.x + dir[0], $scope.position.y + dir[1]) ) {
        var status = PixiServ.moveChar(dir[0], dir[1]);
        if (status) {
          $scope.position.x += dir[0];
          $scope.position.y += dir[1];
        }
      }
    }
  };

}]);
