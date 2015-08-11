"use strict";

/**
 * @ngdoc function
 * @name rpgApp.controller:MainCtrl
 * @description
 * Main controller of the game.
 */


angular.module("rpgApp").controller("MainCtrl", ["$scope", "CharServ", "MapServ", "PixiServ", "FightEngine", "AdversariesDB", function ($scope, CharServ, MapServ, PixiServ, FightEngine, AdversariesDB) {

  initialisation();

  function initialisation() {
    MapServ.load().then(MapServ.reflect)
    .then(CharServ.create)
    .then(function() { PixiServ.init(MapServ.getMap(), CharServ.getPosition()); })
    .then(PixiServ.mapScroll)
    .then(animate)
    .then(startFpsCount);
  }

  function startFpsCount() {
    $scope.frames = 0;
    $scope.fps = 0;
    window.setInterval(function() {
      $scope.$apply(function() {
        $scope.fps = $scope.frames;
      });
      $scope.frames = 0;
    }, 1000);
  }

  function animate() {
    $scope.frames += 1;
    PixiServ.render();
    requestAnimationFrame(animate);
  }

  /**
   * Responding to event and requesting the character's movement.
   * Movement happens if there is no wall, and if the character can move.
   * After each move the map may need to be re-centered, and a monster may be
   * encoutered (thus launching a fight).
   *
   * @param {array} direction: adjustment of position to apply, as [+x, +y].
   */
  function move(direction) {
    var newCell = [CharServ.getPosition()[0] + direction[0], CharServ.getPosition()[1] + direction[1]];
    if ( !MapServ.isWall(newCell) ) {
      PixiServ.moveChar(direction)
      .then(function() {
        CharServ.updatePosition(direction);
        PixiServ.mapScroll();
      })
      .then(function() {
        if ((CharServ.getPosition()[0] === 18) && (CharServ.getPosition()[1] === 14)) {
          AdversariesDB.setBoss(CharServ.getAllDatas().stats.level);
          FightEngine.fight();
        } else {
          var encounter = true;
          if (encounter) {
            AdversariesDB.defineAdversary(CharServ.getAllDatas().stats.level);
            FightEngine.fight();
          } else {
            CharServ.manaRegen();
            CharServ.lifeRegen();
          }
        }
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
