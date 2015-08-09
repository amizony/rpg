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
    /**
     * Calculate the random damages from a weapon done by an attack
     *
     * @param {string} as 'integer'd'integer' (1d8 , 3d12, 6d4), the first integer is the number of dices and the second the faces' number.
     * @return {integer} damages done.
    **/
    var nb = string.slice(0, string.indexOf("d"));
    var dice = string.slice(string.indexOf("d") + 1, string.length);
    var damages = 0;

    for (var i = 0; i < nb; i++) {
      damages += _.random(1, dice);
    }

    return damages;
  }

  function rollAttack() {
    /**
     * @return {integer} attack roll bewteen 1 and 20.
    **/
    return _.random(1,20);
  }

  function doesHit(attack, defence) {
    /**
     * Determine if an attack hit or miss.
     *
     * @param {integer} the total attack (attack roll + hit bonuses) of the attacker.
     * @param {integer} the total defence of the defender.
     * @return {boolean} true if the attack hit the target.
    **/
    return attack > defence;
  }

  function fightRound() {
    /**
     * Reccursive function  computing all action of one round.
     * The fight ends when the life of someone reaches 0.
     *
     * @return {boolean} true if the player won the fight.
    **/

    // player action
    console.log("-------- fight round --------");
    var playerAtt = rollAttack() + $scope.player.stats.hitBonus;
    console.log("player att: " + playerAtt + "    vs def: " + $scope.mob.defence);

    if (doesHit(playerAtt, $scope.mob.defence)) {
      var playerDmg = rollDamages($scope.player.weapon.damages) + $scope.player.attribute.strength;
      console.log("you do: " + playerDmg + " damages");
      $scope.mob.life -= playerDmg;
    }


    if ($scope.mob.life < 1) {
      console.log("--------  end fight  --------");
      console.log("you killed the monster");
      return true;
    }

    // mob action
    var mobAtt = rollAttack() + $scope.mob.hitBonus;
    console.log("mob att: " + mobAtt + "    vs def: " + $scope.player.stats.defence);

    if (doesHit(mobAtt, $scope.player.stats.defence)) {
      var mobDmg = rollDamages($scope.mob.damages) + 2;
      console.log("you recieve: " + mobDmg + " damages");
      $scope.player.stats.life -= mobDmg;
    }
    
    if ($scope.player.stats.life < 1) {
      console.log("--------  end fight  --------");
      console.log("you were killed");
      return false;
    }

    console.log("your life: " + $scope.player.stats.life + "/" + $scope.player.stats.lifeMax);
    console.log("mob's life: " + $scope.mob.life + "/" + $scope.mob.lifeMax);
    return fightRound();
  }


  return {
    fight: function() {
      /**
       * Launch the turn based engine.
       *
       * @return {boolean} true the player won the fight.
      **/
      $scope.player = CharServ.getAllDatas();
      $scope.mob = AdversariesDB.getStats();
      var victory = fightRound();

      return victory;
    }
  };




}]);
