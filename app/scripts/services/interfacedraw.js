"use strict";

/**
 * @ngdoc function
 * @name rpgApp.service:InterfaceDraw
 * @description
 * #InterfaceDraw
 * Service of the rpgApp
**/

angular.module("rpgApp").service("InterfaceDraw", ["CharServ", function (CharServ) {

  var $scope = {};

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
    $scope.interface.addChild($scope.menuWindow);

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


  return {
    getInterface: function() {
      return $scope.interface;
    },
    init: function() {
      $scope.interface = new PIXI.Container();

      $scope.menuList = new PIXI.Graphics();
      $scope.interface.addChild($scope.menuList);

      //init textures
      $scope.texture = {
        button: PIXI.Texture.fromImage("images/button.png"),
        buttonHover: PIXI.Texture.fromImage("images/buttonhover.png"),
        menuBackground: PIXI.Texture.fromImage("images/menubackground.png")
      };

      createMenu();

      return $scope.interface;
    },

  };

}]);
