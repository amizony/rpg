"use strict";

/**
 * @ngdoc function
 * @name rpgApp.service:CharCreation
 * @description
 * Service taking care of character creation (display and stats init).
 */

angular.module("rpgApp").service("CharCreation", function () {
  // own display
  // choose a class
  // roll attributes (and reroll them at a price)
  // choose a sprite?
  // choose a name?
  // starter items depending on class

  var $scope = {};

  /**
   * Display a Pixi Text.
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
    $scope.creationPage.addChild(newText);

    return newText;
  }

  /**
   * Display an invisible button.
   *
   * @param {string} text: the button's name.
   * @param {array} position: the location inside the overlayWindow to display it, as [x, y].
   * @param {function} callback: function to execute when the button is clicked.
   */
  function invisibleButton(text, position, callback) {
    var clickable = new PIXI.Container();
    var button = new PIXI.Sprite($scope.texture.empty);
    clickable.addChild(button);
    clickable.position.x = position[0] - 30;
    clickable.position.y = position[1];
    clickable.buttonMode = true;
    clickable.interactive = true;
    createText(text, position, {});

    clickable.on("click", callback);
    $scope.creationPage.addChild(clickable);
  }

  /**
   * Create a button for choosing the character class.
   */
  function createClassButton(text, position) {
    var newText = new PIXI.Text(text, {});
    newText.position.x = position[0];
    newText.position.y = position[1];
    $scope.creationPage.addChild(newText);
  }

  /**
   * Randomize attribute with a non-linear repartition
   *
   * @return {integer} attribute, between 0 and 4.
   */
  function randAttribute() {
    var dice1 = _.random(0, 2);
    var dice2 = _.random(0, 2);
    var attribute = dice1 + dice2;
    return attribute;
  }

  function defineBaseChar() {
    $scope.char = {};
    $scope.char.attribute = {
      strength: randAttribute(),
      dexterity: randAttribute(),
      endurance: randAttribute(),
      //intelligence: randAttribute(),
      //wisdom: randAttribute()
    };

    $scope.char.stats = {
      name: "Carlisle"
    };

    $scope.char.weapon = {
      name: "Rusty Sword",
      damages: "1d6",
      hitBonus: 1,
      critical: [19, 2],
      enhancement: 0
    };

    $scope.char.armor = {
      name: "Worn Leather Armor",
      weight: 10,
      defence: 1,
      enhancement: 0
    };
  }

  function createDisplay(dfd) {
    createText("Create a new Character ", [180, 0]);
    createClassButton("Barbarian", [100, 70]);
    createClassButton("Warrior", [350, 70]);
    createClassButton("Rogue", [600, 70]);

    var posX = 150;
    var posY = 350;
    var i = 30;
    var attributes = {
      strength: randAttribute(),
      dexterity: randAttribute(),
      endurance: randAttribute(),
    };
    createText("Attributes", [posX, posY], {});
    _.forIn(attributes, function(value, key) {
      createText(key + ": " + value, [posX + 10, posY + i], {});
      i += 30;
    });

    invisibleButton("Reroll attributes?", [430, 380], function() {
      console.log("click noticed");
    });

    invisibleButton("Create Character", [300, 550], function() {
      defineBaseChar();
      dfd.resolve();
    });

  }


 return {
  init: function (dfd) {
    $scope.creationPage = new PIXI.Container();

    // init textures
    $scope.texture = {
      button: PIXI.Texture.fromImage("images/button.png"),
      buttonHover: PIXI.Texture.fromImage("images/buttonhover.png"),
      empty: PIXI.Texture.fromImage("images/empty.png")
    };

    createDisplay(dfd);

    return $scope.creationPage;
  },
  getDisplay: function() {
    return $scope.creationPage;
  },
  getChar: function() {
    return _.merge({}, $scope.char);
  }
 };
});
