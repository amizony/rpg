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
    $scope.leftPanelBackground = new PIXI.Sprite($scope.texture.leftPanelBackground);
    $scope.leftPanel.addChild($scope.leftPanelBackground);

    var buttons = [
      {name: "Character", open: characterMenu},
      {name: "Equipment", open: equipmentMenu},
      {name: "Inventory", open: inventoryMenu},
      {name: "Spells",    open: spellsMenu},
      {name: "Help",      open: helpMenu}
    ];

    $scope.menuItems = [];
    for (var i = 0; i < buttons.length; i++) {
      $scope.menuItems.push(createMenuButton(buttons[i]));
      $scope.menuItems[i].position.y = 10 + i*55;
      $scope.leftPanel.addChild($scope.menuItems[i]);
    }

    $scope.overlayWindow = new PIXI.Container();
    $scope.overlayWindow.position.x = 160;
    $scope.overlayWindow.renderable = false;
    $scope.interface.addChild($scope.overlayWindow);

    $scope.overlayBackground = new PIXI.Sprite($scope.texture.overlayBackground);
    $scope.overlayWindow.addChild($scope.overlayBackground);
  }

  /**
   * Draw an interactive button,
   * when clicked, it opens the corresponding menu.
   * The menus are all drawn in the same container (overlayWindow).
   *
   * @param {hash} name: the button's name,
   *               open: the function drawing the content of the menu when he is open
   * @return {pixi.container} the button we just create.
   */
  function createMenuButton(obj) {
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
          if (!$scope.overlayWindow.renderable || $scope.menuTitle._text !== obj.name) {
            $scope.overlayWindow.renderable = true;
            destroyMenu();
            obj.open();
          } else {
            $scope.overlayWindow.renderable = false;
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
    $scope.overlayWindow.removeChildren();
    $scope.menuTitle = undefined;
    $scope.overlayBackground = new PIXI.Sprite($scope.texture.overlayBackground);
    $scope.overlayWindow.addChild($scope.overlayBackground);
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
    $scope.overlayWindow.addChild(char);

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

    var i = 30;
    _.forIn(datas.inventory, function(value, key) {
      if (value.quantity > 0) {
        createItem(key, value.quantity, value.usable, i);
        i += 30;
      }
    });
  }

  function createItem(name, quantity, usable, position) {
    var style = {};

    var clickable = new PIXI.Container();
    var button = new PIXI.Sprite($scope.texture.empty);
    clickable.addChild(button);
    clickable.position.x = 45;
    clickable.position.y = 50 + position;
    clickable.buttonMode = true;
    clickable.interactive = true;

    var textHover;

    if (usable) {
      textHover = createText("Click to use item", [350, 50 + position], {});
      clickable.on("click", function() {
        console.log("You use an item, but nothing is happening (not implemented).");
      });
    } else {
      textHover = createText("Not usable", [350, 50 + position], {});
    }
    textHover.renderable = false;
      clickable
        .on("mouseover", function() {
          textHover.renderable = true;
        })
        .on("mouseout", function() {
          textHover. renderable = false;
        });

      createText("- " + quantity + " " + name, [40, 50 + position], style);
      $scope.overlayWindow.addChild(clickable);
  }

  /**
   * Draw the content of the spells page.
   */
  function spellsMenu() {
    $scope.menuTitle = createText("Spells", [20, 10]);
    createText("Not yet implemented", [50, 80], {});
  }

  /**
   * Draw the equiped objects of the character.
   */
  function equipmentMenu() {
    $scope.menuTitle = createText("Equipment", [20, 10]);

    var datas = CharServ.getAllDatas();

    // draw weapon
    createText("Weapon", [220, 80]);
    createText("[image]", [80, 180]);
    createText(datas.weapon.name, [330, 150], {});
    if (datas.weapon.enhancement === 0) {
      createText("damages: " + datas.weapon.damages, [330, 180], {});
    } else {
      createText("damages: " + datas.weapon.damages + " + " + datas.weapon.enhancement, [330, 180], {});
    }
    createText("crit: " + datas.weapon.critical[0] + "-20  x" + datas.weapon.critical[1], [330,210], {});

    // draw armor
    createText("Armor", [220, 340]);
    createText("[image]", [80, 410]);
    createText(datas.armor.name, [330, 410], {});
    var def = datas.armor.defence + datas.armor.enhancement;
    createText("armor: " + def, [330, 440], {});
  }

  /**
   * Draw the content of the help page.
   */
  function helpMenu() {
    $scope.menuTitle = createText("Help", [20, 10]);
    createText("Sorry you can't count on anyone's help for now", [50, 80], {font: 'bold 20px Arial'});
  }

  /**
   * Draw the title, the two fighters and their life.
   *
   * @param {hash} player: stats relative to the player - only life and mana are useful yet.
   * @param {hash} mob: stats relative to the mob - only life and level are useful yet.
   */
  function drawFighters() {
    $scope.menuTitle = createText("Mario   -- VS --   Monster (level " + $scope.mob.stats.level + ")", [30, 10]);

    $scope.playerSprite = new PIXI.Sprite($scope.texture.char);
    $scope.playerSprite.scale.set(0.28);
    $scope.playerSprite.position.x = 80;
    $scope.playerSprite.position.y = 70;
    $scope.overlayWindow.addChild($scope.playerSprite);

    $scope.playerLife = createText("life " + $scope.player.stats.life + " / " + $scope.player.stats.lifeMax, [80, 250], $scope.style.playerLife);
    $scope.playerMana = createText("mana " + $scope.player.stats.mana + " / " + $scope.player.stats.manaMax, [80, 280], $scope.style.playerMana);

    $scope.mobSprite = new PIXI.Sprite($scope.texture.monster);
    $scope.mobSprite.position.x = 340;
    $scope.mobSprite.position.y = 70;
    $scope.overlayWindow.addChild($scope.mobSprite);
    $scope.mobLife = createText("life " + $scope.mob.stats.life + " / " + $scope.mob.stats.lifeMax, [360, 250], $scope.style.mobLife);
  }

  /**
   * Display a Pixi Text in the active menu window.
   *
   * @param {string} text: the text we want to display.
   * @param {array} position: the location inside the overlayWindow to display it, as [x, y].
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
    $scope.overlayWindow.addChild(newText);

    return newText;
  }

  var combatLog = {
    /**
     * Refresh the display for a new round.
     *
     * @param {hash} message as: {text: the message to display,
     *                            type: style to use}
     */
    newRound: function(message) {
      destroyMenu();
      drawFighters();
      $scope.position = [200, 330];
      createText(message.text, $scope.position, $scope.style[message.type]);
      $scope.position[1] += 20;
    },

    /**
     * Display the message for an attack, and maybe adding an animation later
     *
     * @param {hash} message as: {text: the message to display,
     *                            type: style to use}
     */
    attack: function(message) {
      $scope.position[0] = 40;
      $scope.position[1] += 30;
      createText(message.text, $scope.position, $scope.style[message.type]);
    },

    /**
     * Display the message when the player takes damages and update his life.
     *
     * @param {hash} message as: {text: the message to display,
     *                            type: style to use
     *                            dmg: damages taken}
     */
    damagesToPlayer: function(message) {
      $scope.player.stats.life -= message.dmg;
      $scope.playerLife.renderable = false;
      $scope.playerLife = createText("life " + $scope.player.stats.life + " / " + $scope.player.stats.lifeMax, [80, 250], $scope.style.playerLife);
      $scope.position[1] += 20;
      createText(message.text, $scope.position, $scope.style[message.type]);
    },

    /**
     * Display the message when the mob takes damages and update his life.
     *
     * @param {hash} message as: {text: the message to display,
     *                            type: style to use
     *                            dmg: damages taken}
     */
    damagesToMob: function(message) {
      $scope.mob.stats.life -= message.dmg;
      $scope.mobLife.renderable = false;
      $scope.mobLife = createText("life " + $scope.mob.stats.life + " / " + $scope.mob.stats.lifeMax, [360, 250], $scope.style.mobLife);
      $scope.position[1] += 20;
      createText(message.text, $scope.position, $scope.style[message.type]);
    },

    /**
     * Display the message when the player is awarded XP or an item.
     *
     * @param {hash} message as: {text: the message to display,
     *                            type: style to use
     *                            dmg: damages taken}
     */
    reward: function(message) {
      $scope.position[0] = 40;
      $scope.position[1] += 20;
      createText(message.text, $scope.position, $scope.style[message.type]);
    },

    /**
     * Display the message when the player dies and remove his sprite.
     *
     * @param {hash} message as: {text: the message to display,
     *                            type: style to use}
     */
    playerDeath: function(message) {
      $scope.playerSprite.renderable = false;
      $scope.playerLife.renderable = false;
      $scope.playerMana.renderable = false;
      $scope.position[1] += 20;
      createText(message.text, $scope.position, $scope.style[message.type]);
    },

    /**
     * Display the message when the mob dies and remove his sprite.
     *
     * @param {hash} message as: {text: the message to display,
     *                            type: style to use}
     */
    mobDeath: function(message) {
      $scope.mobSprite.renderable = false;
      $scope.mobLife.renderable = false;
      $scope.position[1] += 20;
      createText(message.text, $scope.position, $scope.style[message.type]);
    },

    /**
     * Display the Defeat or victory message at the end of the fight.
     *
     * @param {hash} message as: {text: the message to display,
     *                            type: style to use}
     */
    endFight: function(message) {
      $scope.position[0] = 200;
      $scope.position[1] += 40;
      createText(message.text, $scope.position, $scope.style[message.type]);
      $scope.position[1] += 30;
    }
  };

  /**
   * Recursive function to display all messages with the appropriate method.
   * Display the messages with a 1 second interval, and close the combat log
   * at the end of all the messages.
   *
   * @param {array} messages: array of hashs describing all actions that happended, as:
   *                         {text: message to display,
   *                          type: method (and style) to use to display it,
   *                          dmg: [optional] damages done during the action}
   */
  function computeMessage(messages) {
    if (messages[0].type !== "End") {
      combatLog[messages[0].type](messages[0]);

      messages.shift();
      window.setTimeout(function() {
        computeMessage(messages);
      }, 1000);

    } else {
      window.setTimeout(function() {
        $scope.overlayWindow.renderable = false;
        destroyMenu();
      }, 1500);
    }
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

      $scope.leftPanel = new PIXI.Graphics();
      $scope.interface.addChild($scope.leftPanel);

      // init textures
      $scope.texture = {
        button: PIXI.Texture.fromImage("images/button.png"),
        buttonHover: PIXI.Texture.fromImage("images/buttonhover.png"),
        overlayBackground: PIXI.Texture.fromImage("images/menubackground.png"),
        leftPanelBackground: PIXI.Texture.fromImage("images/leftbackground.png"),
        char: PIXI.Texture.fromImage("images/SuaRQmP.png"),
        monster: PIXI.Texture.fromImage("images/Typhon_Monster.png"),
        empty: PIXI.Texture.fromImage("images/empty.png")
      };

      // init styles for messages in the combat log
      $scope.style = {
        newRound: {
          font : 'bold italic 36px Arial',
          fill : '#F7EDCA',
          stroke : '#4a1850',
          strokeThickness : 5
        },
        endFight: {
          font : 'bold italic 36px Arial',
          fill : '#F7EDCA',
          stroke : '#4a1850',
          strokeThickness : 5
        },
        reward: {font: 'bold 16px Arial'},
        playerLife: {font: 'bold 30px Arial'},
        playerMana: {font: 'bold 30px Arial'},
        mobLife: {font: 'bold 30px Arial'},
        damagesToMob: {font: 'bold 16px Arial'},
        damagesToPlayer: {font: 'bold 16px Arial'},
        playerDeath: {font: 'bold 16px Arial'},
        mobDeath: {font: 'bold 16px Arial'},
        attack: {font: 'bold 16px Arial'}
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
      $scope.overlayWindow.renderable = true;

      $scope.player = player;
      $scope.mob = mob;

      drawFighters();
    },

    /**
     * call the recursive function displaying all the messages
     *
     * @param {array} messages: array of hashs describing all actions that happended, as:
     *                         {text: message to display,
     *                          type: method (and style) to use to display it,
     *                          dmg: [optional] damages done during the action}
     */
    renderFight: function(messages) {
      computeMessage(messages);
    }
  };
}]);
