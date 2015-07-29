"use strict";

/**
 * @ngdoc function
 * @name rpgApp.service:PixiServ
 * @description
 * #PixiServ
 * Service of the rpgApp
**/

angular.module("rpgApp").service("PixiServ", function () {

  var $scope = {};

  $scope.stage = new PIXI.Container();
  $scope.stage.interactive = true;

  $scope.menu = new PIXI.Container();
  $scope.dungeon = new PIXI.Container();
  $scope.dungeon.position.x = 150;
  $scope.stage.addChild($scope.dungeon);
  $scope.stage.addChild($scope.menu);

  $scope.menuList = new PIXI.Graphics();
  $scope.menu.addChild($scope.menuList);


  $scope.renderer = PIXI.autoDetectRenderer(800, 608, { view:document.getElementById("game-canvas"), backgroundColor : 0x1099bb });

  $scope.texture = {
    ground: PIXI.Texture.fromImage("images/ground.png"),
    wall: PIXI.Texture.fromImage("images/wall.png"),
    char: PIXI.Texture.fromImage("images/SuaRQmP.png")
  };

  createMenu();

  function createSquare(posX, posY, texture) {
    var square = new PIXI.Sprite(texture);
    square.anchor.set(0.5);
    square.scale.set(0.125);
    square.position.x = posX;
    square.position.y = posY;
    $scope.map.addChild(square);
  }

  function createMenu() {
    $scope.menuList.lineStyle(2, 0x0000FF, 1);
    $scope.menuList.beginFill(0xFF0000);
    $scope.menuList.drawRect(0, 0, 150, 608);
    $scope.menuList.drawRect(150, 508, 650, 100);
    $scope.menuList.endFill();
  }

  /*function convertCoordPx(x, y) {
    return [x * 32 + 16, y * 32 + 16];
  }

  function convertPxCoord(x, y) {
    return [(x - 16) / 32, (y - 16) / 32];
  }*/

  return {
    newChar: function(posX, posY) {
      $scope.character = new PIXI.Sprite($scope.texture.char);
      $scope.character.anchor.set(0.5);
      $scope.character.scale.set(0.05);
      $scope.character.position.x = posX * 32 + 16;
      $scope.character.position.y = posY * 32 + 16;
      $scope.dungeon.addChild($scope.character);
    },
    newMap: function(mapData) {
      $scope.map = new PIXI.Container();
      $scope.dungeon.addChild($scope.map);
      var posX = -16;
      var posY = -16;

      for (var i = 0; i < mapData.length; i++) {
        posY += 32;
        posX = -16;
        for (var j = 0; j < mapData[i].length; j++) {
          posX += 32;
          if (mapData[i][j] === 0) {
            createSquare(posX, posY, $scope.texture.wall);
          } else {
            createSquare(posX, posY, $scope.texture.ground);
          }
        }
      }
    },
    moveChar: function(moveX, moveY) {
      $scope.character.position.x += moveX * 32;
      $scope.character.position.y += moveY * 32;
    },
    render: function() {
      $scope.renderer.render($scope.stage);
    }
  };
});
