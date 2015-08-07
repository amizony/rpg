"use strict";

/**
 * @ngdoc function
 * @name rpgApp.service:AdversariesDB
 * @description
 * #AdversariesDB
 * Service of the rpgApp
**/

angular.module("rpgApp").service("AdversariesDB", function () {

  var $scope = {};

  return {
    getStats: function() {
      return $scope.stats;
    },
    defineAdversary: function(level, difficulty) {
      $scope.stats = {
        level: level,
        xpReward: level * 100,
        lifeMax: level * (6 + difficulty),
        life: level * (6 + difficulty),
        manaMax: level * (2 + difficulty),
        mana: level * (2 + difficulty),
        hitBonus: level + difficulty,
        defence: 10 + difficulty,
        damages: "1d8"
      };
    }
  };


});
