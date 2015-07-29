"use strict";

/**
 * @ngdoc function
 * @name rpgApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the rpgApp
**/


angular.module("rpgApp").controller("MainCtrl", ["$scope", "CharServ", "MapServ", "PixiServ", function ($scope, CharServ, MapServ, PixiServ) {

  PixiServ.init();

  MapServ.load().then(function() {return MapServ.reflect();})
  .then(function() {return MapServ.create();})
  .then(function() {return CharServ.create();})
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

  window.addEventListener("keydown", function(event) {
    // left key
    if (event.keyCode === 37) {
      CharServ.move([-1,0]);
    }
    // up key
    if (event.keyCode === 38) {
      CharServ.move([0,-1]);
    }
    // right key
    if (event.keyCode === 39) {
      CharServ.move([1,0]);
    }
    // down key
    if (event.keyCode === 40) {
      CharServ.move([0,1]);
    }
  });

}]);
