"use strict";

/**
 * @ngdoc function
 * @name rpgApp.service:InterfaceDraw
 * @description
 * Service responsible for drawing the interface:
 *    - left panel containing buttons to open/close menus
 *    - bottom panel containing the combat log (not yet implemented)
 *    - overlay for displaying the menus
 */

angular.module("rpgApp").service("InterfaceDraw", ["CharServ", function (CharServ) {

  var $scope = {};

  /**
   * Draw the menu and the buttons.
   */
  function createMenu() {
    $scope.menuList.lineStyle(2, 0x0000FF, 1);
    $scope.menuList.beginFill(0xFF0000);
    $scope.menuList.drawRect(0, 0, 160, 600);
    $scope.menuList.drawRect(160, 512, 650, 100);
    $scope.menuList.endFill();

    var buttons = [
      {name: "Character", open: characterMenu},
      {name: "Inventory", open: inventoryMenu},
      {name: "Spells",    open: spellsMenu},
      {name: "Quests",    open: questsMenu},
      {name: "Help",      open: helpMenu}
    ];

    $scope.menuItems = [];
    for (var i = 0; i < buttons.length; i++) {
      $scope.menuItems.push(createMenuItem(buttons[i]));
      $scope.menuItems[i].position.y = 10 + i*55;
      $scope.menuList.addChild($scope.menuItems[i]);
    }

    $scope.menuWindow = new PIXI.Container();
    $scope.menuWindow.position.x = 160;
    $scope.menuWindow.renderable = false;
    $scope.interface.addChild($scope.menuWindow);

    $scope.menuBackground = new PIXI.Sprite($scope.texture.menuBackground);
    $scope.menuWindow.addChild($scope.menuBackground);
    $scope.activeMenu = new PIXI.Container();
    $scope.menuWindow.addChild($scope.activeMenu);
  }

  /**
   * Draw an interactive button;
   * when clicked, it opens the corresponding menu.
   * The menus are all drawn in the same container (activeMenu).
   *
   * @param {hash} name: the button's name,
   *               open: the function drawing the contnt of the menu when he is open
   * @return {pixi.container} the button we just create.
   */
  function createMenuItem(obj) {
    var item = new PIXI.Container();
    var button = new PIXI.Sprite($scope.texture.button);
    button.scale.set(0.70);
    button.position.x = 10;
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
        if (_.isUndefined($scope.menuTitle) || $scope.menuTitle._text.slice(0, 5) !== "Mario") {
          if (!$scope.menuWindow.renderable || $scope.menuTitle._text !== obj.name) {
            $scope.menuWindow.renderable = true;
            destroyMenu();
            obj.open();
          } else {
            $scope.menuWindow.renderable = false;
            destroyMenu();
          }
        }
      });

    var text = new PIXI.Text(obj.name);
    text.x = 20;
    text.y = 10;

    item.addChild(button);
    item.addChild(text);

    return item;
  }

  /**
   * Clear the content of the menu in order to draw a new one.
   */
  function destroyMenu() {
    $scope.activeMenu.removeChildren();
    $scope.menuTitle = undefined;
  }

  /**
   * Draw the content of the character page.
   */
  function characterMenu() {
    $scope.menuTitle = createText("Character", [20, 10]);

    var datas = CharServ.getAllDatas();
    var style = {};

    // name & picture
    createText("Super Mario", [50, 80], style);
    var char = new PIXI.Sprite($scope.texture.char);
    char.position.x = 30;
    char.position.y = 150;
    char.scale.set(0.4);
    $scope.activeMenu.addChild(char);

    // stats
    createText("Level " + datas.stats.level + "  (" + datas.stats.experience + " / " + datas.stats.level * 1000 + ")", [350, 100], style);
    createText("Life " + datas.stats.life + " / " + datas.stats.lifeMax, [350, 150], style);
    createText("Mana " + datas.stats.mana + " / " + datas.stats.manaMax, [350, 200], style);


    // Attributes
    var posX = 350;
    var posY = 250;
    var i = 30;
    createText("Attributes", [posX, posY], style);
    _.forIn(datas.attribute, function(value, key) {
      createText(key + ": " + value, [posX + 10, posY + i], style);
      i += 30;
    });

  }

  /**
   * Draw the content of the inventory page.
   */
  function inventoryMenu() {
    $scope.menuTitle = createText("Inventory", [20, 10]);

    var datas = CharServ.getAllDatas();
    var style = {};

    var i = 30;
    _.forIn(datas.inventory, function(value, key) {
      if (value.quantity > 0) {
        if (value.usable) {
          var clickable = new PIXI.Container();
          var button = new PIXI.Sprite($scope.texture.empty);
          clickable.addChild(button);
          clickable.position.x = 45;
          clickable.position.y = 50 + i;
          clickable.buttonMode = true;
          clickable.interactive = true;

          var textHover = createText("Click to use item", [350, 50 + i], style);
          textHover.renderable = false;

          clickable
            .on("mouseover", function() {
              textHover.renderable = true;
            })
            .on("mouseout", function() {
              textHover. renderable = false;
            })
            .on("click", function() {
              console.log("You use an item, but nothing is happening (not implemented).");
            });
          createText("- " + value.quantity + " " + key, [40, 50 + i], style);
          $scope.activeMenu.addChild(clickable);

        } else {
          createText("- " + value.quantity + " " + key, [40, 50 + i], style);
        }
        i += 30;
      }
    });
  }

  /**
   * Draw the content of the spells page.
   */
  function spellsMenu() {
    $scope.menuTitle = createText("Spells", [20, 10]);
  }

  /**
   * Draw the content of the quests page.
   */
  function questsMenu() {
    $scope.menuTitle = createText("Quests", [20, 10]);
  }

  /**
   * Draw the content of the help page.
   */
  function helpMenu() {
    $scope.menuTitle = createText("Help", [20, 10]);
  }

  /**
   * Draw the title, the two fighters and their life.
   *
   * @param {hash} player: stats relative to the player - only life and mana are useful yet.
   * @param {hash} mob: stats relative to the mob - only life and level are useful yet.
   */
  function drawFighters(player, mob) {
    $scope.menuTitle = createText("Mario   -- VS --   Monster (level " + mob.level + ")", [30, 10]);
    var style = {};

    var mario = new PIXI.Sprite($scope.texture.char);
    mario.scale.set(0.28);
    mario.position.x = 80;
    mario.position.y = 70;
    $scope.activeMenu.addChild(mario);
    createText("life " + player.life + " / " + player.lifeMax, [80, 250], style);
    createText("mana " + player.mana + " / " + player.manaMax, [80, 280], style);

    var hydre = new PIXI.Sprite($scope.texture.monster);
    hydre.position.x = 340;
    hydre.position.y = 70;
    $scope.activeMenu.addChild(hydre);
    createText("life " + mob.life + " / " + mob.lifeMax, [360, 250], style);
  }

  /**
   * Display a Pixi Text in the active menu window.
   *
   * @param {string} text: the text we want to display.
   * @param {array} position: the location inside $scope.activeMenu to display it, as [x, y].
   * @param {hash} style: [optional] a particular style to apply to the text.
   * @return {Pixi.Text} the Text we create.
   */
  function createText(text, position, style) {
    if (_.isUndefined(style)) {
      style = {
        font : 'bold italic 36px Arial',
        fill : '#F7EDCA',
        stroke : '#4a1850',
        strokeThickness : 5,
      };
    }
    var newText = new PIXI.Text(text, style);
    newText.position.x = position[0];
    newText.position.y = position[1];
    $scope.activeMenu.addChild(newText);

    return newText;
  }



  return {
    /**
     * @return {pixi.container} interface container to be rendered.
     */
    getInterface: function() {
      return $scope.interface;
    },

    /**
     * @return {pixi.container} interface container.
     */
    init: function() {
      $scope.interface = new PIXI.Container();

      $scope.menuList = new PIXI.Graphics();
      $scope.interface.addChild($scope.menuList);

      //init textures
      $scope.texture = {
        button: PIXI.Texture.fromImage("images/button.png"),
        buttonHover: PIXI.Texture.fromImage("images/buttonhover.png"),
        menuBackground: PIXI.Texture.fromImage("images/menubackground.png"),
        char: PIXI.Texture.fromImage("images/SuaRQmP.png"),
        monster: PIXI.Texture.fromImage("images/Typhon_Monster.png"),
        empty: PIXI.Texture.fromImage("images/empty.png")
      };

      createMenu();

      return $scope.interface;
    },

    /**
     * Open the combat log window and initialise it.
     *
     * @param {hash} player: stats relative to the player - only life and mana are useful yet.
     * @param {hash} mob: stats relative to the mob - only life and level are useful yet.
     */
    openCombatLog: function(player, mob) {
      destroyMenu();
      $scope.menuWindow.renderable = true;
      drawFighters(player, mob);
    },

    /**
     * Display the action of a fight round.
     *
     * @param {array} messages: array of strings describing all action that hapend
     * @param {hash} player: stats relative to the player - only life and mana are useful yet.
     * @param {hash} mob: stats relative to the mob - only life and level are useful yet.
     * @param {integer} round: number of the current round.
     */
    renderFight: function(messages, player, mob, round) {
      destroyMenu();
      drawFighters(player, mob);
      var style = {};
      var i = 20;
      createText("Fight Round " + round, [200, 330]);
      _.forIn(messages, function(value) {
        createText(value, [40, 360 + i], {font: 'bold 16px Arial'});
        i += 20;
      });
      $scope.playerLifeText = createText("life " + player.life + " / " + player.lifeMax, [80, 250], style);
      $scope.playerManaText = createText("mana " + player.mana + " / " + player.manaMax, [80, 280], style);
      $scope.mobLifeText = createText("life " + mob.life + " / " + mob.lifeMax, [360, 250], style);
    },

    /**
     * Display the outcome of the fight (rewards or death), and then close the combat log.
     *
     * @param {array} messages: array of string to display.
     * @param {hash} mob: stats relative to the mob - only level is useful yet.
     */
    closeCombatLog: function(messages, mob) {
      destroyMenu();
      $scope.menuTitle = createText("Mario   -- VS --   Monster (level " + mob.level + ")", [30, 10]);
      createText("Fight Ended ", [200, 330]);
      window.setTimeout(function() {
        $scope.menuWindow.renderable = false;
        destroyMenu();
      }, 2000);
    }
  };
}]);
