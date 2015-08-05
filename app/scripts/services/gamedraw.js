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
    var square = new PIXI.Sprite(texture);
    square.anchor.set(0.5);
    square.scale.set(0.125);
    square.position.x = position[0];
    square.position.y = position[1];
    $scope.map.addChild(square);
  }

  function createMap(mapData) {
    $scope.map = new PIXI.Container();
    $scope.dungeon.addChild($scope.map);
    var position = [-16,-16];
    for (var i = 0; i < mapData.length; i++) {
      position[1] += 32;
      position[0] = -16;
      for (var j = 0; j < mapData[i].length; j++) {
        position[0] += 32;
        if (mapData[i][j] === 0) {
          createSquare(position, $scope.texture.wall);
        } else {
          createSquare(position, $scope.texture.ground);
        }
      }
    }
  }

  function createChar(position) {
    $scope.character = new PIXI.Sprite($scope.texture.char);
    $scope.character.anchor.set(0.5);
    $scope.character.scale.set(0.05);
    $scope.character.position.x = position[0] * 32 + 16;
    $scope.character.position.y = position[1] * 32 + 16;
    $scope.dungeon.addChild($scope.character);
  }

  return {
    getGame: function() {
      return $scope.dungeon;
    },
    getCharPosition: function() {
      return [$scope.character.position.x, $scope.character.position.y];
    },
    init: function(mapData, charPosition) {
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
      function fn() {
        $scope.character.position.x += direction[0] * 2;
        $scope.character.position.y += direction[1] * 2;
      }
      return [fn, 10, 16];
    },
    moveMap: function(direction) {
      function fn() {
        $scope.dungeon.position.x += direction[0];
        $scope.dungeon.position.y += direction[1];
      }
      return [fn, 20, 32];
    }
  };

});
