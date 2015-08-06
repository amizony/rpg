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

  return {
    getStats: function() {
      return $scope.stats;
    },
    defineAdversary: function(level, difficulty) {
      $scope.stats = {
        level: Math.max(1, level),
        damages: "1d8"
      };
      $scope.stats.xpReward = $scope.stats.level * 100;
      $scope.stats.lifeMax = $scope.stats.level * (6 + difficulty);
      $scope.stats.life = $scope.stats.lifeMax;
      $scope.stats.manaMax = $scope.stats.level * (2 + difficulty);
      $scope.stats.mana = $scope.stats.manaMax;
      $scope.stats.hitBonus = $scope.stats.level + difficulty;
      $scope.stats.defence = 10 + 2 * difficulty;
    }
  };


}]);
