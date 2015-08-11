"use strict";

/**
 * @ngdoc function
 * @name rpgApp.service:PixiServ
 * @description
 * Main service of Pixi, responsible for the rendering and managing the animations.
 */

angular.module("rpgApp").service("PixiServ", ["GameDraw","InterfaceDraw" , function (GameDraw, InterfaceDraw) {

  var $scope = {};

  /**
   * Launch an animation if the game is in a state allowing it :
   * no other animation running or game not in pause.
   *
   * @param {function} animationFn: a function implementing the animation.
   * @param {promise} dfd: a promise resolved when the animation is over,
   *                       or rejected if the animation can't be launched.
   */
  function ensureSingleAnimation(animationFn, dfd) {
    if (!$scope.animating && !$scope.interface.children[1].renderable) {
      $scope.animating = true;
      animationFn(function() { dfd.resolve(); });
    } else {
      dfd.reject();
    }
  }

  /**
   * Animate something iteratively so it's smooth-looking, using a loop-like
   * animation function repeated a specific number of times at a specific rate.
   *
   * @param {function} animationFn: a function implementing the animation.
   * @param {integer} interval: time (in ms) between two steps.
   * @param {integer} iteration: number of steps in the animation.
   * @return {promise} a promise resolved when the animation is over,
   *                   or rejected if the animation can't be launched.
   */
  function animate(animationFn, interval, iteration) {
    var dfd = $.Deferred();
    var animation = function(next) {
      // @param {function} next: used to resolve the promise when the animation is ended.
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

  /**
   * Launch the move map animation.
   *
   * @param {array} direction: adjustment of position (in number of cells) to apply to the map.
   * @return {promise} resolved when the animation is over,
   *                   or rejected if the animation can't be launched.
   */
  function moveMap(direction) {
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
    /**
     * Initialisations of pixi and containers,
     * drawing the interface, the map and the character.
     *
     * @param {array} mapData: map to draw, stored as pseudo-matrix.
     * @param {array} charPosition: coordinates of the character, as [x, y].
     */
    init: function(mapData, charPosition) {
      // init rendering
      $scope.renderer = PIXI.autoDetectRenderer(800, 600, { view:document.getElementById("game-canvas"), backgroundColor : 0x1099bb });

      // init display containers
      $scope.stage = new PIXI.Container();
      $scope.stage.interactive = true;

      $scope.interface = InterfaceDraw.init();
      $scope.dungeon = GameDraw.init(mapData, charPosition);
      $scope.stage.addChild($scope.dungeon);
      $scope.stage.addChild($scope.interface);
    },

    /**
     * Launch the move character animation.
     *
     * @param {array} direction: adjustment of position (in number of cells) to apply to the character.
     * @return {promise} resolved when the animation is over,
     *                   or rejected if the animation can't be launched.
     */
    moveChar: function(direction) {
      var temp = GameDraw.moveChar(direction);
      return animate(temp[0], temp[1], temp[2]);
    },

    /**
     * Update the contents of the containers and render them.
     */
    render: function() {
      $scope.dungeon = GameDraw.getGame();
      $scope.interface = InterfaceDraw.getInterface();
      $scope.renderer.render($scope.stage);
    },

    /**
     * Scrolling the map when the player is closing to the borders.
     */
    mapScroll: function() {
      var dir = [0,0];

      // horizontal scrolling
      // initial position: 160,
      // after scrolling: -384
      if (($scope.dungeon.position.x === 160) && (GameDraw.getCharPosition()[0] > 19 * 32)) {
        dir[0] -= 17;
      } else if (($scope.dungeon.position.x === -384) && (GameDraw.getCharPosition()[0] < 18 * 32)) {
        dir[0] += 17;
      }

      // vertical scrolling
      // initial position: 0,
      // after scrolling: -416
      if (($scope.dungeon.position.y === 0) && (GameDraw.getCharPosition()[1] > 15 * 32)) {
        dir[1] -= 13;
      } else if (($scope.dungeon.position.y === -416) && (GameDraw.getCharPosition()[1] < 14 * 32)) {
        dir[1] += 13;
      }
      if ((dir[0] !== 0) || (dir[1] !== 0)) {
        moveMap(dir);
      }
    }
  };
}]);
