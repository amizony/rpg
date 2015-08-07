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
        xpReward: level * (100 + 20 * difficulty),
        lifeMax: level * (6 + _.random(2) * difficulty),
        manaMax: level * (2 + _.random(2) * difficulty),
        hitBonus: level + _.random(2) * difficulty,
        defence: 10 + _.random(2) * difficulty,
        damages: "1d8"
      };
      $scope.stats.life = $scope.stats.lifeMax;
      $scope.stats.mana = $scope.stats.manaMax;
    }
  };


});
