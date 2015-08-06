"use strict";

/**
 * @ngdoc function
 * @name rpgApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the rpgApp
**/


angular.module("rpgApp").controller("MainCtrl", ["$scope", "CharServ", "MapServ", "PixiServ", function ($scope, CharServ, MapServ, PixiServ) {

  MapServ.load().then(function() {return MapServ.reflect();})
  .then(function() {return CharServ.create();})
  .then(function() {return PixiServ.init(MapServ.getMap(), CharServ.getPosition());})
  .then(function() {return window.setInterval(PixiServ.mapScroll, 1000);})
  .then(function() {return animate();});

  $scope.frames = 0;
  $scope.fps = 0;

  window.setInterval(function() {
    $scope.$apply(function() {
      $scope.fps = $scope.frames;
    });
    $scope.frames = 0;
  }, 1000);

  function animate() {
    $scope.frames += 1;
    PixiServ.render();
    requestAnimationFrame(animate);
  }

  function move(direction) {
    var newX = CharServ.getPosition()[0] + direction[0];
    var newY = CharServ.getPosition()[1] + direction[1];
    if ( !MapServ.isWall([newX, newY]) ) {
      PixiServ.moveChar(direction).then(function() {
        CharServ.updatePosition(direction);
      });
    }
  }

  /**
   * Events - key bindings.
   */
  window.addEventListener("keydown", function(event) {
    // left key
    if (event.keyCode === 37) {
      move([-1,0]);
    }
    // up key
    if (event.keyCode === 38) {
      move([0,-1]);
    }
    // right key
    if (event.keyCode === 39) {
      move([1,0]);
    }
    // down key
    if (event.keyCode === 40) {
      move([0,1]);
    }
  });

}]);
