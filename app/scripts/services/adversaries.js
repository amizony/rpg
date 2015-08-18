"use strict";

/**
 * @ngdoc function
 * @name rpgApp.service:AdversariesServ
 * @description
 * Service generating an adversary for each fight depending of the player's level.
 * Adversary are meant to be weak at the beginning and may (depending of randomisation)
 * be stronger than the player as he gains levels.
 */

angular.module("rpgApp").service("AdversariesServ", function () {

  var $scope = {};

  /**
   * Generate a random level between 1 and the player's level,
   * then for each 4 player's level, the adversary has one more level.
   * The level is the overall power of the adversary.
   *
   * @param {integer} charLevel: player's level.
   */
  function setLevel(charLevel) {
    $scope.level = _.random(1, charLevel) + _.floor(charLevel / 4);
  }

  /**
   * Set a random difficulty for the encounter depending of the player's level.
   * The difficulty is a small power adjustment of the adversary.
   *
   * @param {integer} charLevel: player's level.
   */
  function setDifficulty(charLevel) {
    $scope.difficulty = _.random(-1, _.floor(charLevel / 3)) - 1;

  }

  /**
   * Set the stats depending on the level and difficulty.
   *
   * @param {integer} charLevel: player's level.
   */
  function setStats() {
    $scope.attribute = {
      strength: _.random(0,2),
      dexterity: _.random(0,2),
      endurance: _.random(0,2),
      intelligence: _.random(0,2),
      wisdom: _.random(0,2)
    };
    $scope.stats = {
      level: $scope.level,
      xpReward: $scope.level * (100 + 20 * $scope.difficulty)
    };
    $scope.stats.lifeMax = $scope.stats.level * (6 + $scope.attribute.endurance + _.random(2) * $scope.difficulty);
    $scope.stats.life = $scope.stats.lifeMax;
    $scope.stats.manaMax = $scope.stats.level * (2 + $scope.attribute.wisdom + _.random(2) * $scope.difficulty);
    $scope.stats.mana = $scope.stats.manaMax;

    $scope.weapon = {
      name: "Rusty sword",
      damages: "1d6",
      critical: [19, 2],
      enhancement: 0
    };

    $scope.armor = {
      name: "Leather Armor",
      defence: 2,
      enhancement: 0
    };

    $scope.stats.hitBonus = $scope.stats.level + $scope.attribute.strength + $scope.weapon.enhancement + _.random(2) * $scope.difficulty;

    $scope.stats.defence = 10 + _.floor($scope.stats.level / 2) + $scope.attribute.dexterity + $scope.armor.defence + $scope.armor.enhancement + _.random(2) * $scope.difficulty;

  }


  return {
    getStats: function() {
      return {
        stats: _.extend({}, $scope.stats),
        attribute: $scope.attribute,
        weapon: $scope.weapon,
        armor: $scope.armor,
        spells: $scope.spells,
        inventory: $scope.inventory,
      };
    },

    /**
     * Create a new adversary with a power depending on the player's level.
     *
     * @param {integer} charLevel: player's level.
     */
    defineAdversary: function(charLevel) {
      setLevel(charLevel);
      setDifficulty(charLevel);
      setStats();

      console.log("You encounter a level " + $scope.level + " monster with difficulty " + $scope.difficulty + ".");
    },

    /**
     * Create the final Boss.
     *
     * @param {integer} charLevel: player's level.
     */
    setBoss: function(charLevel) {
      $scope.level = 30;
      $scope.difficulty = _.floor(charLevel / 5);
      setStats();
      $scope.stats.damages = "2d8";

      console.log("You encounter a boss (level " + $scope.level + ", difficulty " + $scope.difficulty + ")");
    }
  };


});
