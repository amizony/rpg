"use strict";

/**
 * @ngdoc function
 * @name rpgApp.service:GameDraw
 * @description
 * #GameDraw
 * Service of the rpgApp
**/

angular.module("rpgApp").service("GameDraw", function () {

  var $scope = {};

  function createSquare(position, texture) {
    /**
     * Draw a cell of the map
     *
     * @param {array} position in px of the cell.
     * @param {pixi.texture} texture to use for the cell.
    **/
    var square = new PIXI.Sprite(texture);
    square.scale.set(0.125);
    square.position.x = position[0];
    square.position.y = position[1];
    $scope.map.addChild(square);
  }

  function createMap(mapData) {
    /**
     * Draw the map.
     * Each cell has a size of 32*32 px.
     *
     * @param {array} map to draw, stored as pseudo-matrix.
    **/
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

  function createChar(position) {
    /**
     * Draw the character.
     * He is drawn in the middle of its cell.
     *
     * @param {array} coordinates of the character, as [x, y].
    **/
    $scope.character = new PIXI.Sprite($scope.texture.char);
    $scope.character.anchor.set(0.5);
    $scope.character.scale.set(0.05);
    $scope.character.position.x = position[0] * 32 + 16;
    $scope.character.position.y = position[1] * 32 + 16;
    $scope.dungeon.addChild($scope.character);
  }

  return {
    getGame: function() {
      /**
       * @return {pixi.container} game container to be rendered.
      **/
      return $scope.dungeon;
    },
    getCharPosition: function() {
      /**
       * @return {array} position in px of the character, as [x, y].
      **/
      return [$scope.character.position.x, $scope.character.position.y];
    },
    init: function(mapData, charPosition) {
      /**
       * @param {array} map to draw, stored as pseudo-matrix
       * @param {array} coordinates of the character, as [x, y].
       * @return {pixi.container} game container.
      **/
      $scope.dungeon = new PIXI.Container();
      $scope.dungeon.position.x = 150;
      //init textures
      $scope.texture = {
        ground: PIXI.Texture.fromImage("images/ground.png"),
        wall: PIXI.Texture.fromImage("images/wall.png"),
        char: PIXI.Texture.fromImage("images/SuaRQmP.png")
      };
      createMap(mapData);
      createChar(charPosition);

      return $scope.dungeon;
    },
    moveChar: function(direction) {
      /**
       * Definition of the animation for moving the character.
       * By iterating 32 times, the coordinates are transformed in a position in px.
       *
       * @param {array} adjustment of position to apply, as [+x, +y].
       * @return {array} fn: elementary function for the animation
       *                 interval: time (in ms) between two movement
       *                 iteration: number of iteration to repeat
      **/
      var fn = function() {
        $scope.character.position.x += direction[0];
        $scope.character.position.y += direction[1];
      };
      var interval = 5;
      var iteration = 32;
      return [fn, interval, iteration];
    },
    moveMap: function(direction) {
      /**
       * Definition of the animation for moving the map.
       * By iterating 32 times, the coordinates are transformed in a position in px.
       *
       * @param {array} adjustment of position to apply, as [+x, +y].
       * @return {array} fn: elementary function for the animation
       *                 interval: time (in ms) between two movement
       *                 iteration: number of iteration to repeat
      **/
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
