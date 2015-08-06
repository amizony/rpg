"use strict";

/**
 * @ngdoc function
 * @name rpgApp.service:AdversariesDB
 * @description
 * #AdversariesDB
 * Service of the rpgApp
**/

angular.module("rpgApp").service("AdversariesDB", ["CharServ", function (CharServ) {

  var $scope = {};

  $scope.stats = {
    level: 1,
    xpReward: 100,
    lifeMax: 10,
    life: this.lifeMax,
    manaMax: 5,
    mana: this.manaMax,
    hitBonus: this.level,
    defence: 10
  };

  return {
    getStats: function() {
      return $scope.stats;
    },
    defineAdversary: function(level, difficulty) {
      $scope.stats = {
        level: Math.max(1, level),
        xpReward: this.level * 100,
        lifeMax: this.level * (6 + difficulty),
        life: this.lifeMax,
        manaMax: this.level * (2 + difficulty),
        mana: this.manaMax,
        hitBonus: this.level + difficulty,
        defence: 10 + 2 * difficulty
      };
    }
  };


}]);
