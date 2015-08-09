"use strict";

/**
 * @ngdoc function
 * @name rpgApp.service:PixiServ
 * @description
 * #PixiServ
 * Service of the rpgApp
**/

angular.module("rpgApp").service("PixiServ", ["GameDraw","InterfaceDraw" , function (GameDraw, InterfaceDraw) {

  var $scope = {};


  function ensureSingleAnimation(animationFn, dfd) {
    /**
     * Launch an animation if the game is in a state allowing it :
     * no other animation running or game not in pause
     *
     * @param {function} a function implementing the animation.
     * @param {promise} resolved when the animation is over,
     *                  or rejected if the animation can't be launched.
    **/
    if (!$scope.animating && !$scope.interface.children[1].renderable) {
      $scope.animating = true;
      animationFn(function() { dfd.resolve(); });
    } else {
      dfd.reject();
    }
  }

  function animate(animationFn, interval, iteration) {
    /**
     * Animate something iteratively so it's smooth-looking, using a loop-like
     * animation function repeated a specific number of times at a specific rate.
     *
     * @param {function} animationFn A function implementing the animation.
     * @param {integer} interval Duration of each animation step.
     * @param {integer} iteration Number of steps in the animation.
     * @return {promise} resolved when the animation is over,
     *                   or rejected if the animation can't be launched.
    **/
    var dfd = $.Deferred();
    var animation = function(next) {
      /**
       * @param {function} used to resolve the promise when the animation is ended.
      **/
      $scope.intervalCount = 0;

      $scope.intervalID = window.setInterval(function() {
        animationFn();
        $scope.intervalCount += 1;

        if ($scope.intervalCount >= iteration) {
          clearInterval($scope.intervalID);
          $scope.animating = false;
          next();
        }
      }, interval);
    };
    ensureSingleAnimation(animation, dfd);
    return dfd.promise();
  }

  function moveMap(direction) {
    /**
     * Launch the move map animation.
     *
     * @param {array} adjustment of position (in number of cells) to apply to the map.
     * @return {promise} resolved when the animation is over,
     *                   or rejected if the animation can't be launched.
    **/
    var temp = GameDraw.moveMap(direction);
    return animate(temp[0], temp[1], temp[2]);
  }

  /*function convertCoordPx(x, y) {
    return [x * 32 + 16, y * 32 + 16];
  }

  function convertPxCoord(x, y) {
    return [(x - 16) / 32, (y - 16) / 32];
  }*/

  return {
    init: function(mapData, charPosition) {
      /**
       * Initialisations of pixi and containers,
       * drawing the interface, the map and the character.
       *
       * @param {array} map to draw, stored as pseudo-matrix
       * @param {array} coordinates of the character, as [x, y].
      **/
      // init rendering
      $scope.renderer = PIXI.autoDetectRenderer(800, 608, { view:document.getElementById("game-canvas"), backgroundColor : 0x1099bb });

      // init display containers
      $scope.stage = new PIXI.Container();
      $scope.stage.interactive = true;

      $scope.interface = InterfaceDraw.init();
      $scope.dungeon = GameDraw.init(mapData, charPosition);
      $scope.stage.addChild($scope.dungeon);
      $scope.stage.addChild($scope.interface);

    },
    moveChar: function(direction) {
      var temp = GameDraw.moveChar(direction);
      return animate(temp[0], temp[1], temp[2]);
    },
    render: function() {
      /**
       * Update the contents of the containers and render them.
      **/
      $scope.dungeon = GameDraw.getGame();
      $scope.interface = InterfaceDraw.getInterface();
      $scope.renderer.render($scope.stage);
    },
    mapScroll: function() {
      /**
       * Scrolling the map when the player is closing to the borders.
      **/
      var dir = [0,0];

      if (($scope.dungeon.position.x === 150) && (GameDraw.getCharPosition()[0] > 16 * 32)) {
        dir[0] -= 4.6875;
      } else if (($scope.dungeon.position.x === 0) && (GameDraw.getCharPosition()[0] < 6 * 32)) {
        dir[0] += 4.6875;
      }

      if (($scope.dungeon.position.y === 0) && (GameDraw.getCharPosition()[1] > 12 * 32)) {
        dir[1] -= 3;
      } else if (($scope.dungeon.position.y === -96) && (GameDraw.getCharPosition()[1] < 6 * 32)) {
        dir[1] += 3;
      }
      if ((dir[0] !== 0) || (dir[1] !== 0)) {
        moveMap(dir);
      }
    }
  };
}]);
