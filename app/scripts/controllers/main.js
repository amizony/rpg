"use strict";

/**
 * @ngdoc function
 * @name rpgApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the rpgApp
**/


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

  function move(direction) {
    /**
     * Responding to event and requesting the character's movement.
     * Movement happens if there is no wall, and if the character can move.
     * After each move the map may need to be re-centered, and a monster can be
     * encoutered (launching then a fight).
     *
     * @param {array} direction of movement, as [moveX, moveY].
    **/
    var newCell = [CharServ.getPosition()[0] + direction[0], CharServ.getPosition()[1] + direction[1]];
    if ( !MapServ.isWall(newCell) ) {
      PixiServ.moveChar(direction)
      .then(function() {
        CharServ.updatePosition(direction);
        PixiServ.mapScroll();
      })
      .then(function() {
        var encounter = true;
        if (encounter) {
          setAdversary();
          launchFight();
        }
      });
    }
  }

  function setAdversary() {
    /**
     * Set the difficulty of the encounter depending of the player's level.
     * Monsters should not be too strong at the begining
     * but can later on be stronger than the player.
    **/
    var charLevel = CharServ.getAllDatas().stats.level;
    // level from 1 to player's level * 1.33
    var level = _.random(1, charLevel + _.floor(charLevel / 3));
    // difficulty from -2 to player's level / 3
    var difficulty = _.random(_.floor(charLevel / 3)) - 2;

    console.log("");
    console.log("");
    console.log("You encounter a level " + level + " monster with difficulty " + difficulty + ".");
    AdversariesDB.defineAdversary(level, difficulty);
  }

  function launchFight() {
    /**
     * Launch the fight and take action depending on the outcome.
    **/
    var victory = FightEngine.fight();

    if (victory) {
      var exp = AdversariesDB.getStats().xpReward;
      console.log("You got " + exp + " XP!");
      CharServ.getXP(exp);
    } else {
      CharServ.dying();
    }
  }


  /**
   * Events - key bindings.
  **/

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
