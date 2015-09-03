"use strict";

/**
 * @ngdoc function
 * @name rpgApp.service:CharCreation
 * @description
 * Service taking care of character creation (display and stats init).
 */

angular.module("rpgApp").service("CharCreation", function () {

  var $scope = {};

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


  // own display

  // choose a class

  // roll attributes (and reroll them at a price)

  // choose a sprite

  //choose a name

 // stater items depending on class or can be choosen

 return {
  create: function (dfd) {
    $scope.creationPage = new PIXI.Container();

    var newText = new PIXI.Text("Character Creation Page, wait 3s to continue", {});
    newText.position.x = 100;
    newText.position.y = 200;
    $scope.creationPage.addChild(newText);


    var result;

    // async char creation
    window.setTimeout(function() {
      result = window.confirm("Continue?");
    }, 3000);

    // validating the char when done and proceed to the game (will be a button)
    var int = window.setInterval(function() {
      if (result) {
        defineBaseChar();
        dfd.resolve();
        clearInterval(int);
      }
    }, 100);

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
