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

    var buttonsNames = ["Character", "Inventory", "Spells", "Quests", "Help"];
    $scope.menuItems = [];
    for (var i = 0; i < buttonsNames.length; i++) {
      $scope.menuItems.push(createMenuItem(buttonsNames[i]));
      $scope.menuItems[i].position.y = 10 + i*55;
      $scope.menuList.addChild($scope.menuItems[i]);
    }
  }

  function createMenuItem(name) {
    var item = new PIXI.Container();
    var button = new PIXI.Sprite($scope.texture.button);
    button.scale.set(0.70);
    button.position.x = 5;
    item.buttonMode = true;
    item.interactive = true;

    item
      .on("mouseover", function() {
        button.texture = $scope.texture.buttonHover;
      })
      .on("mouseout", function() {
        button.texture = $scope.texture.button;
      })
      .on("click", function() {
        console.log("click on " + name + " noticed");
      });

    var text = new PIXI.Text(name);
    text.x = 15;
    text.y = 10;

    item.addChild(button);
    item.addChild(text);

    return item;
  }

  function mapScroll() {
    var dir = [0,0];
    if (true) {
      dir[0] += 0;
    } else if (true) {
      dir[0] -= 0;
    }
    if (true) {
      dir[1] += 0;
    } else if (true) {
      dir[1] -= 0;
    }
    moveMap(dir);
  }

  function moveMap(dir) {
    $scope.dungeon.position.x += dir[0];
    $scope.dungeon.position.y += dir[1];
  }

  /*function convertCoordPx(x, y) {
    return [x * 32 + 16, y * 32 + 16];
  }

  function convertPxCoord(x, y) {
    return [(x - 16) / 32, (y - 16) / 32];
  }*/

  return {
    init: function() {
      // init rendering
      $scope.renderer = PIXI.autoDetectRenderer(800, 608, { view:document.getElementById("game-canvas"), backgroundColor : 0x1099bb });

      // init display containers
      $scope.stage = new PIXI.Container();
      $scope.stage.interactive = true;

      $scope.menu = new PIXI.Container();
      $scope.dungeon = new PIXI.Container();
      $scope.dungeon.position.x = 150;
      $scope.stage.addChild($scope.dungeon);
      $scope.stage.addChild($scope.menu);

      $scope.menuList = new PIXI.Graphics();
      $scope.menu.addChild($scope.menuList);

      //init textures
      $scope.texture = {
        ground: PIXI.Texture.fromImage("images/ground.png"),
        wall: PIXI.Texture.fromImage("images/wall.png"),
        char: PIXI.Texture.fromImage("images/SuaRQmP.png"),
        button: PIXI.Texture.fromImage("images/button.png"),
        buttonHover: PIXI.Texture.fromImage("images/buttonhover.png")
      };

      //draw menu
      createMenu();
    },
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
      $scope.IDcount = 0;
      if (!$scope.ID) {
        $scope.ID = window.setInterval(function() {
          $scope.character.position.x += moveX * 2;
          $scope.character.position.y += moveY * 2;
          $scope.IDcount += 2;
          if ($scope.IDcount >= 32) {
            clearInterval($scope.ID);
            $scope.ID = null;
          }
        });
      }
    },
    moveEnded: function() {
      return $scope.ID;
    },
    render: function() {
      $scope.renderer.render($scope.stage);
    }
  };
});
