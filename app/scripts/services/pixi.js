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

    $scope.menuWindow = new PIXI.Container();
    $scope.menuWindow.position.x = 150;
    $scope.menuWindow.renderable = false;
    $scope.menu.addChild($scope.menuWindow);

    $scope.menuBackground = new PIXI.Sprite($scope.texture.menuBackground);
    $scope.menuWindow.addChild($scope.menuBackground);
    $scope.activeMenu = new PIXI.Container();
    $scope.menuWindow.addChild($scope.activeMenu);
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
        openMenu(name);
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
    if (($scope.dungeon.position.x === 150) && ($scope.character.position.x > 16 * 32)) {
      dir[0] -= 4.6875;
    } else if (($scope.dungeon.position.x === 0) && ($scope.character.position.x < 6 * 32)) {
      dir[0] += 4.6875;
    }
    if (($scope.dungeon.position.y === 0) && ($scope.character.position.y > 12 * 32)) {
      dir[1] -= 3;
    } else if (($scope.dungeon.position.y === -96) && ($scope.character.position.y < 6 * 32)) {
      dir[1] += 3;
    }
    if ((dir[0] !== 0) || (dir[1] !== 0)) {
      moveMap(dir);
    }
  }

  function moveMap(dir) {
    setAnimationInterval(function() {
      $scope.dungeon.position.x += dir[0];
      $scope.dungeon.position.y += dir[1];
    }, 20, 32);
  }

  function makeOneAnimation(fn) {
    if (!$scope.animating && !$scope.menuWindow.renderable) {
      $scope.animating = true;
      fn();
      return true;
    } else {
      return false;
    }
  }

  function setAnimationInterval(animationFn, interval, iteration) {
    return makeOneAnimation(function() {
      $scope.intervalCount = 0;

      $scope.intervalID = window.setInterval(function() {
        animationFn();
        $scope.intervalCount += 1;

        if ($scope.intervalCount >= iteration) {
          clearInterval($scope.intervalID);
          $scope.animating = false;
        }
      }, interval);
    });
  }

  function openMenu(menu) {
    if (!$scope.menuWindow.renderable || $scope.menuTitle._text !== menu) {
      $scope.menuWindow.renderable = true;
      destroyMenu();
      switch (menu) {
        case "Character":
          characterMenu(menu);
          break;
        case "Inventory":
          inventoryMenu(menu);
          break;
        case "Spells":
          spellsMenu(menu);
          break;
        case "Quests":
          questsMenu(menu);
          break;
        case "Help":
          helpMenu(menu);
          break;
        default:
          console.log("Unknown menu");
      }
    } else {
      $scope.menuWindow.renderable = false;
      destroyMenu();
    }
  }

  function destroyMenu() {
    $scope.activeMenu.removeChildren();
  }

  function characterMenu(title) {
    $scope.menuTitle = new PIXI.Text(title);
    $scope.menuTitle.position.x = 20;
    $scope.menuTitle.position.y = 15;
    $scope.activeMenu.addChild($scope.menuTitle);
  }

  function inventoryMenu(title) {
    $scope.menuTitle = new PIXI.Text(title);
    $scope.menuTitle.position.x = 20;
    $scope.menuTitle.position.y = 15;
    $scope.activeMenu.addChild($scope.menuTitle);
  }

  function spellsMenu(title) {
    $scope.menuTitle = new PIXI.Text(title);
    $scope.menuTitle.position.x = 20;
    $scope.menuTitle.position.y = 15;
    $scope.activeMenu.addChild($scope.menuTitle);
  }

  function questsMenu(title) {
    $scope.menuTitle = new PIXI.Text(title);
    $scope.menuTitle.position.x = 20;
    $scope.menuTitle.position.y = 15;
    $scope.activeMenu.addChild($scope.menuTitle);
  }

  function helpMenu(title) {
    $scope.menuTitle = new PIXI.Text(title);
    $scope.menuTitle.position.x = 20;
    $scope.menuTitle.position.y = 15;
    $scope.activeMenu.addChild($scope.menuTitle);
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
        buttonHover: PIXI.Texture.fromImage("images/buttonhover.png"),
        menuBackground: PIXI.Texture.fromImage("images/menubackground.png")
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
      window.setInterval(mapScroll, 1000);
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
      return setAnimationInterval(function() {
        $scope.character.position.x += moveX * 2;
        $scope.character.position.y += moveY * 2;
      }, 10, 16);
    },
    render: function() {
      $scope.renderer.render($scope.stage);
    }
  };
});
