"use strict";

/**
 * @ngdoc function
 * @name rpgApp.service:FightEngine
 * @description
 * Turn-based fight engine.
**/

angular.module("rpgApp").service("FightEngine", ["CharServ", "AdversariesDB", function (CharServ, AdversariesDB) {

  var $scope = {};

  function rollDamages(weaponDamage) {
    /**
     * Calculate the random damages from a weapon done by an attack
     *
     * @param {string} weaponDamage: damages possibilities of weapon, as 'integer'd'integer' (1d8 , 3d12, 6d4)
     *                               the first integer is the number of dices and the second the dices' faces' number.
     * @return {integer} damages done.
    **/
    var nb = weaponDamage.slice(0, weaponDamage.indexOf("d"));
    var dice = weaponDamage.slice(weaponDamage.indexOf("d") + 1, weaponDamage.length);
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
     * @param {integer} attack: the total attack (attack roll + hit bonuses) of the attacker.
     * @param {integer} defence: the total defence of the defender.
     * @return {boolean} true if the attack hit the target, false otherwise.
    **/
    return attack > defence;
  }

  function fightRound() {
    /**
     * Reccursive function  computing all action of one round.
     * The fight ends when the life of someone reaches 0.
     *
     * @return {boolean} true if the player won the fight, false otherwise.
    **/

    console.log("-------- fight round --------");

    // player actions

    // attack roll
    var playerAtt = rollAttack() + $scope.player.stats.hitBonus;
    console.log("player att: " + playerAtt + "    vs def: " + $scope.mob.defence);

    if (doesHit(playerAtt, $scope.mob.defence)) {
      // do some damages if the attack hit
      var playerDmg = rollDamages($scope.player.weapon.damages) + $scope.player.attribute.strength;
      console.log("you do: " + playerDmg + " damages");
      $scope.mob.life -= playerDmg;
    }


    if ($scope.mob.life < 1) {
      // fight ends if the monster dies
      console.log("--------  end fight  --------");
      console.log("you killed the monster");
      return true;
    }

    // mob actions

    // attack roll
    var mobAtt = rollAttack() + $scope.mob.hitBonus;
    console.log("mob att: " + mobAtt + "    vs def: " + $scope.player.stats.defence);

    if (doesHit(mobAtt, $scope.player.stats.defence)) {
      // do some damages if the attack hit
      var mobDmg = rollDamages($scope.mob.damages) + 2;
      console.log("you recieve: " + mobDmg + " damages");
      $scope.player.stats.life -= mobDmg;
    }

    if ($scope.player.stats.life < 1) {
      // fight ends if the player dies
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
       * @return {boolean} true the player won the fight, false otherwise.
      **/
      $scope.player = CharServ.getAllDatas();
      $scope.mob = AdversariesDB.getStats();
      var victory = fightRound();

      return victory;
    }
  };




}]);
