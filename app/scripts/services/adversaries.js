"use strict";

/**
 * @ngdoc function
 * @name rpgApp.service:AdversariesDB
 * @description
 * Service generating an adversary for each fight depending of the player's level.
 * Adversary are meant to be weak at the beginning and may (depending of randomisation)
 * be stronger than the player as he gains levels.
 */

angular.module("rpgApp").service("AdversariesDB", function () {

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
    $scope.stats = {
      xpReward: $scope.level * (100 + 20 * $scope.difficulty),
      lifeMax: $scope.level * (6 + _.random(2) * $scope.difficulty),
      manaMax: $scope.level * (2 + _.random(2) * $scope.difficulty),
      hitBonus: $scope.level + _.random(2) * $scope.difficulty,
      defence: 10 + _.random(2) * $scope.difficulty,
      damages: "1d8"
    };
    $scope.stats.life = $scope.stats.lifeMax;
    $scope.stats.mana = $scope.stats.manaMax;
  }


  return {
    getStats: function() {
      return $scope.stats;
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

      console.log("");
      console.log("");
      console.log("You encounter a level " + $scope.level + " monster with difficulty " + $scope.difficulty + ".");
    }
  };


});
