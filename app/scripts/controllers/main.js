"use strict";

/**
 * @ngdoc function
 * @name rpgApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the rpgApp
**/


angular.module("rpgApp").controller("MainCtrl", ["$scope", "CharServ", "MapServ", "PixiServ", "FightEngine", "AdversariesDB", function ($scope, CharServ, MapServ, PixiServ, FightEngine, AdversariesDB) {

  MapServ.load().then(function() {return MapServ.reflect();})
  .then(function() { return CharServ.create(); })
  .then(function() { return PixiServ.init(MapServ.getMap(), CharServ.getPosition()); })
  .then(function() { PixiServ.mapScroll(); })
  .then(function() { return animate(); });

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
      PixiServ.moveChar(direction)
      .then(function() {
        CharServ.updatePosition(direction);
        // One *may* need to shift the map after the character has moved.
        PixiServ.mapScroll();
      })
      .then(function() {
        var encounter = _.random(5);
        if (encounter === 0) {
          console.log("You encounter a monster!");
          launchFight();
        }
      });
    }
  }

  function launchFight() {
    var difficulty = _.random(3);
    var level = _.random(-3,3);
    AdversariesDB.defineAdversary(CharServ.getAllDatas().stats.level + level, difficulty);
    window.setTimeout(function() {
      var victory = FightEngine.fight();
      if (victory) {
        console.log("You win the fight \\o/");
      } else {
        console.log("You loose the fight :-(");
      }
    }, 1000);
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
