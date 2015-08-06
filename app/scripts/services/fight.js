"use strict";

/**
 * @ngdoc function
 * @name rpgApp.service:FightEngine
 * @description
 * #FightEngine
 * Service of the rpgApp
**/

angular.module("rpgApp").service("FightEngine", ["CharServ", "AdversariesDB", function (CharServ, AdversariesDB) {

  var $scope = {};

  function rollDamages(string) {
    var nb = string.slice(0, string.indexOf("d"));
    var dice = string.slice(string.indexOf("d") + 1, string.length);
    var damages = 0;

    for (var i = 0; i < nb; i++) {
      damages += _.random(1, dice);
    }

    return damages;
  }

  function rollAttack() {
    return _.random(1,20);
  }

  function isDodged(attack, defence) {
    return attack <= defence;
  }

  function fightRound() {
    // player action
    console.log("-----fight round-----")
    var playerAtt = rollAttack() + $scope.player.stats.hitBonus;
    console.log("player att: " + playerAtt + "    vs def: " + $scope.mob.defence);
    if (!isDodged(playerAtt, $scope.mob.defence)) {
      var playerDmg = rollDamages($scope.player.weapon.damages) + $scope.player.attribute.strength;
      console.log("you do: " + playerDmg + " damages");
      $scope.mob.life -= playerDmg;
    }
    if ($scope.mob.life < 1) {
      console.log("you killed the monster");
      return true;
    }
    // mob action
    var mobAtt = rollAttack() + $scope.mob.hitBonus;
    console.log("mob att: " + mobAtt + "    vs def: " + $scope.player.stats.defence);
    if (!isDodged(mobAtt, $scope.player.stats.defence)) {
      var mobDmg = rollDamages($scope.mob.damages) + 2;
      console.log("you recieve: " + mobDmg + " damages");
      $scope.player.stats.life -= mobDmg;
    }
    if ($scope.player.stats.life < 1) {
      console.log("you were killed");
      return false;
    }

    console.log("your life: " + $scope.player.stats.life + "/" + $scope.player.stats.lifeMax);
    console.log("mob's life: " + $scope.mob.life + "/" + $scope.mob.lifeMax);
    return fightRound();
  }


  return {
    fight: function() {
      $scope.player = CharServ.getAllDatas();
      $scope.mob = AdversariesDB.getStats();
      console.log($scope.player.stats.life);
      // do stuff
      var victory = fightRound();
      //var victory = (_.random(3) > 0);
      return victory;
    }
  };




}]);
