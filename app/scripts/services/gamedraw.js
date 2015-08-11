"use strict";

/**
 * @ngdoc function
 * @name rpgApp.service:GameDraw
 * @description
 * Service responsible for drawing the dungeon (map + character)
 * and providing the functions to animate them.
 */

angular.module("rpgApp").service("GameDraw", function () {

  var $scope = {};

  /**
   * Draw a cell of the map.
   *
   * @param {array} position: cell's position in px.
   * @param {pixi.texture} texture: a wall or ground texture.
   */
  function createSquare(position, texture) {
    var square = new PIXI.Sprite(texture);
    square.scale.set(0.125);
    square.position.x = position[0];
    square.position.y = position[1];
    $scope.map.addChild(square);
  }

  /**
   * Draw the map.
   * Each cell has a size of 32*32 px.
   *
   * @param {array} mapData: the map to render, stored as pseudo-matrix.
   */
  function createMap(mapData) {
    $scope.map = new PIXI.Container();
    $scope.dungeon.addChild($scope.map);

    // store the position in px of the next cell
    var position = [0, 0];
    for (var i = 0; i < mapData.length; i++) {
      position[0] = 0;
      for (var j = 0; j < mapData[i].length; j++) {
        if (mapData[i][j] === 0) {
          createSquare(position, $scope.texture.wall);
        } else {
          createSquare(position, $scope.texture.ground);
        }
        position[0] += 32;
      }
      position[1] += 32;
    }
  }

  /**
   * Draw the character.
   * He is drawn in the middle of its cell.
   *
   * @param {array} position: coordinates of the character, as [x, y].
   */
  function createChar(position) {
    $scope.character = new PIXI.Sprite($scope.texture.char);
    $scope.character.anchor.set(0.5);
    $scope.character.scale.set(0.05);
    $scope.character.position.x = position[0] * 32 + 16;
    $scope.character.position.y = position[1] * 32 + 16;
    $scope.dungeon.addChild($scope.character);
  }

  /**
   * Draw the boss.
   * He is drawn in the middle of its cell in the center of the map.
   */
  function CreateBoss() {
    $scope.boss = new PIXI.Sprite($scope.texture.boss);
    $scope.boss.anchor.set(0.5);
    $scope.boss.scale.set(0.05);
    $scope.boss.position.x = 18 * 32 + 16;
    $scope.boss.position.y = 14 * 32 + 16;
    $scope.dungeon.addChild($scope.boss);
  }

  return {
    /**
     * @return {pixi.container} game container to be rendered.
     */
    getGame: function() {
      return $scope.dungeon;
    },

    /**
     * @return {array} position in px of the character, as [x, y].
     */
    getCharPosition: function() {
      return [$scope.character.position.x, $scope.character.position.y];
    },

    /**
     * @param {array} mapData: the map to render, stored as pseudo-matrix.
     * @param {array} position: coordinates of the character, as [x, y].
     * @return {pixi.container} game container.
     */
    init: function(mapData, charPosition) {
      $scope.dungeon = new PIXI.Container();
      $scope.dungeon.position.x = 160;
      //init textures
      $scope.texture = {
        ground: PIXI.Texture.fromImage("images/ground.png"),
        wall: PIXI.Texture.fromImage("images/wall.png"),
        char: PIXI.Texture.fromImage("images/SuaRQmP.png"),
        boss: PIXI.Texture.fromImage("images/SuaRQmP-invert.png")
      };
      createMap(mapData);
      CreateBoss();
      createChar(charPosition);

      return $scope.dungeon;
    },

    /**
     * Definition of the animation for moving the character.
     * By iterating 32 times, the coordinates are transformed in a position in px.
     *
     * @param {array} direction: adjustment of position to apply, as [+x, +y].
     * @return {array} fn: elementary function for the animation
     *                 interval: time (in ms) between two steps.
     *                 iteration: number of steps in the animation.
     */
    moveChar: function(direction) {
      var fn = function() {
        $scope.character.position.x += direction[0];
        $scope.character.position.y += direction[1];
      };
      var interval = 5;
      var iteration = 32;
      return [fn, interval, iteration];
    },

    /**
     * Definition of the animation for moving the map.
     * By iterating 32 times, the coordinates are transformed in a position in px.
     *
     * @param {array} adjustment of position to apply, as [+x, +y].
     * @return {array} fn: elementary function for the animation
     *                 interval: time (in ms) between two steps.
     *                 iteration: number of steps in the animation.
     */
    moveMap: function(direction) {
      var fn = function() {
        $scope.dungeon.position.x += direction[0];
        $scope.dungeon.position.y += direction[1];
      };
      var interval = 20;
      var iteration = 32;
      return [fn, interval, iteration];
    }
  };

});
