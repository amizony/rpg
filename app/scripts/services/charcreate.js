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
  var classes = {
    barbarian: {
      name: "Barbarian",
      desc: "A brutal fighter",
      lifePerLevel: 12,
      weightBonus: 0,
      hitBonus: 2,
      hitMultiplier: 1.2,
      defenceBonus: -2,
      criticalDamagesBonus: 0
    },
    warrior: {
      name: "Warrior",
      desc: "A defensive fighter",
      lifePerLevel: 10,
      weightBonus: 20,
      hitBonus: 0,
      hitMultiplier: 1,
      defenceBonus: 2,
      criticalDamagesBonus: 0
    },
    rogue: {
      name: "Rogue",
      desc: "An offensive fighter ",
      lifePerLevel: 8,
      weightBonus: 0,
      hitBonus: 5,
      hitMultiplier: 1,
      defenceBonus: 0,
    criticalDamagesBonus: 10
    }
  };

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
  function createClassButton(cl, position) {
    var charClass = new PIXI.Container();
    charClass.position.x = position[0];
    charClass.position.y = position[1];

    var buttonContainer = new PIXI.Container();
    buttonContainer.buttonMode = true;
    buttonContainer.interactive = true;

    var button = new PIXI.Sprite($scope.texture.button);
    button.scale.set(0.70);

    var classDescription = new PIXI.Text(cl.desc);
    classDescription.position.x = 5;
    classDescription.position.y = 100;
    classDescription.renderable = false;

    $scope.charSprites[cl.name] = new PIXI.Sprite($scope.texture[cl.name.toLocaleLowerCase()]);
    $scope.charSprites[cl.name].position.x = -25;
    $scope.charSprites[cl.name].position.y = 50;
    $scope.charSprites[cl.name].scale.set(1.5);
    $scope.charSprites[cl.name].renderable = false;


    buttonContainer
      .on("mouseover", function() {
        button.texture = $scope.texture.buttonHover;
        if (!$scope.charSprites[cl.name].renderable) {
          classDescription.renderable = true;
        }
      })
      .on("mouseout", function() {
        button.texture = $scope.texture.button;
        classDescription.renderable = false;
      })
      .on("click", function() {
        _.forIn($scope.charSprites, function(value) {
          value.renderable = false;
        });
        $scope.charSprites[cl.name].renderable = true;
        classDescription.renderable = false;
        $scope.class = cl.name.toLocaleLowerCase();
      });

    var className = new PIXI.Text(cl.name);
    className.position.x = 20;
    className.position.y = 10;

    buttonContainer.addChild(button);
    buttonContainer.addChild(className);
    charClass.addChild(classDescription);
    charClass.addChild($scope.charSprites[cl.name]);
    charClass.addChild(buttonContainer);

    $scope.creationPage.addChild(charClass);
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
    $scope.char.stats = {
      name: "Carlisle"
    };

    $scope.char.classStats = classes[$scope.class];
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

    $scope.char.inventory = [
      {
        name: "Resurection Stone",
        quantity: $scope.stones,
        usable: false
      },
    ];
  }

  function createDisplay(dfd) {
    createText("Create a new Character ", [180, 0]);
    $scope.charSprites = {};
    createClassButton(classes.barbarian, [80, 70]);
    createClassButton(classes.warrior, [320, 70]);
    createClassButton(classes.rogue, [580, 70]);

    var posX = 150;
    var posY = 350;
    var i = 30;
    var attributeDisplay = [];
    $scope.char.attribute = {
      strength: randAttribute(),
      dexterity: randAttribute(),
      endurance: randAttribute(),
      //intelligence: randAttribute(),
      //wisdom: randAttribute()
    };
    $scope.stones = 5;

    createText("Attributes", [posX, posY], {});
    _.forIn($scope.char.attribute, function(value, key) {
      attributeDisplay.push(createText(key + ": " + value, [posX + 10, posY + i], {}));
      i += 30;
    });

    var rerollLeft = createText("(" + $scope.stones + " left)", [660, 385], {font: "bold 16px Arial"});

    invisibleButton("Reroll attributes?", [430, 380], function() {
      if ($scope.stones > 0) {
        $scope.stones -= 1;

        _.forIn(attributeDisplay, function(value) {
          value.renderable = false;
        });
        rerollLeft.renderable = false;

        $scope.char.attribute = {
          strength: randAttribute(),
          dexterity: randAttribute(),
          endurance: randAttribute(),
          //intelligence: randAttribute(),
          //wisdom: randAttribute()
        };

        i = 30;
        _.forIn($scope.char.attribute, function(value, key) {
          attributeDisplay.push(createText(key + ": " + value, [posX + 10, posY + i], {}));
          i += 30;
        });
        rerollLeft = createText("(" + $scope.stones + " left)", [660, 385], {font: "bold 16px Arial"});
      }
    });

    invisibleButton("Create Character", [300, 550], function() {
      if ($scope.class !== "new") {
        defineBaseChar();
        dfd.resolve();
      }
    });

  }


 return {
  init: function (dfd) {
    $scope.creationPage = new PIXI.Container();

    // init textures
    $scope.texture = {
      button: PIXI.Texture.fromImage("images/button.png"),
      buttonHover: PIXI.Texture.fromImage("images/buttonhover.png"),
      empty: PIXI.Texture.fromImage("images/empty.png"),
      rogue: PIXI.Texture.fromImage("images/player.png"),
      barbarian: PIXI.Texture.fromImage("images/player.png"),
      warrior: PIXI.Texture.fromImage("images/player.png")
    };

    $scope.char = {};
    $scope.class = "new";
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
