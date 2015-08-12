"use strict";

/**
 * @ngdoc function
 * @name rpgApp.service:FightEngine
 * @description
 * Turn-based fight engine.
 */

angular.module("rpgApp").service("FightEngine", ["CharServ", "AdversariesDB", "InterfaceDraw", function (CharServ, AdversariesDB, InterfaceDraw) {

  var $scope = {};

  /**
   * Calculate the random damages from a weapon done by an attack
   *
   * @param {string} weaponDamage: damages possibilities of weapon, as 'integer'd'integer' (1d8 , 3d12, 6d4)
   *                               the first integer is the number of dices and the second the dices' faces' number.
   * @return {integer} damages done.
   */
  function rollDamages(weaponDamage) {
    var nb = weaponDamage.slice(0, weaponDamage.indexOf("d"));
    var dice = weaponDamage.slice(weaponDamage.indexOf("d") + 1, weaponDamage.length);
    var damages = 0;

    for (var i = 0; i < nb; i++) {
      damages += _.random(1, dice);
    }

    return damages;
  }

  /**
   * @return {integer} action roll bewteen 1 and 20.
   */
  function actionRoll() {
    return _.random(1,20);
  }

  /**
   * Determine if an action is a success or a failure.
   *
   * @param {integer} roll: the total attack (attack roll + hit bonuses) of the attacker.
   * @param {integer} difficulty: the score to beat to be successful.
   * @return {boolean} true if the action succeed, false otherwise.
   */
  function isSuccess(roll, difficulty) {
    return roll > difficulty;
  }

  /**
   * Determine if an action is a critical success.
   * Happens on a 20 - or lower with some weapons.
   *
   * @param {integer} roll: the unmodified action's roll.
   * @param {integer} criticalRate: [optional] the score to reach for a critical.
   * @return {boolean} true if the action is a critical success, false otherwise.
   */
  function isCriticalSuccess(roll, criticalRate) {
    if (_.isUndefined(criticalRate)) {
      criticalRate = 20;
    }
    return roll >= criticalRate;
  }

  /**
   * Determine if an action is a critical failure.
   * Happens on a 1.
   *
   * @param {integer} roll: the unmodified action's roll.
   * @return {boolean} true if the action is a critical failure, false otherwise.
   */
  function isCriticalFailure(roll) {
    return roll === 1;
  }

  /**
   * Give a reward to the player when he wins a fight.
   * XP is always awarded and a random item may be awarded.
   */
  function gainReward() {
    var exp = $scope.mob.xpReward;
    console.log("You got " + exp + " XP!");
    CharServ.getXP(exp);

    if (_.random(7) === 0) {
      console.log("You gain a Resurection Stone.");
      CharServ.gainItem("Resurection Stone");
    }
  }

  /**
   * Recursive function computing all actions of one round.
   * The fight ends when the life of someone reaches 0.
   *
   * @return {boolean} true if the player won the fight, false otherwise.
   */
  function fightRound() {
    console.log("-------- fight round --------");
    // regain 1 mana pro round
    CharServ.manaRegen();


    $scope.messages = ["", "OK " + _.random(5)];
    // player actions

    // attack roll
    var playerAtt = actionRoll();

    if (isCriticalSuccess(playerAtt, $scope.player.weapon.critical[0])) {
      // critical success hits automatically with improved damages
      console.log("You landed a critical hit!");
      var playerCritDmg = (rollDamages($scope.player.weapon.damages) + $scope.player.attribute.strength) * $scope.player.weapon.critical[1];
      console.log("you do: " + playerCritDmg + " damages");
      $scope.mob.life -= playerCritDmg;

    } else if (isCriticalFailure(playerAtt)) {
      // critical failure misses always and cause bad outcome
      console.log("You slip and wound yourself.");
      console.log("you recieve: " + 2 + " damages");
      $scope.player.stats.life -= 2;

    } else {
      playerAtt += $scope.player.stats.hitBonus;
      console.log("player att: " + playerAtt + "    vs def: " + $scope.mob.defence);

      if (isSuccess(playerAtt, $scope.mob.defence)) {
        // do some damages if the attack hit
        var playerDmg = rollDamages($scope.player.weapon.damages) + $scope.player.attribute.strength;
        console.log("you do: " + playerDmg + " damages");
        $scope.mob.life -= playerDmg;
      }
    }

    if ($scope.mob.life < 1) {
      // fight ends if the monster dies
      console.log("--------  end fight  --------");
      console.log("you killed the monster");
      renderRound();
      return true;
    }

    // mob actions

    // attack roll
    var mobAtt = actionRoll();
    if (isCriticalSuccess(mobAtt)) {
      // critical hits automatically
      console.log("You recieve a critical hit!");
      var mobCritDmg = rollDamages($scope.mob.damages) * 2;
      console.log("you recieve: " + mobCritDmg + " damages");
      $scope.player.stats.life -= mobCritDmg;

    } else if (isCriticalFailure(mobAtt)) {
      // critical failure misses always and cause bad outcome
      console.log("The monster wounds himself.");
      console.log("He recieve: " + 2 + " damages");
      $scope.mob.life -= 2;

    } else {
      mobAtt += $scope.mob.hitBonus;
      console.log("mob att: " + mobAtt + "    vs def: " + $scope.player.stats.defence);

      if (isSuccess(mobAtt, $scope.player.stats.defence)) {
        // do some damages if the attack hit
        var mobDmg = rollDamages($scope.mob.damages) + 2;
        console.log("you recieve: " + mobDmg + " damages");
        $scope.player.stats.life -= mobDmg;
      }
    }

    if ($scope.player.stats.life < 1) {
      // fight ends if the player dies
      console.log("--------  end fight  --------");
      console.log("you were killed");
      renderRound();
      return false;
    }

    console.log("your life: " + $scope.player.stats.life + "/" + $scope.player.stats.lifeMax + "   your mana: " + $scope.player.stats.mana + "/" + $scope.player.stats.manaMax);
    console.log("mob's life: " + $scope.mob.life + "/" + $scope.mob.lifeMax);

    renderRound();
    return fightRound();
  }

  /**
   * Send the information to display into the combat log.
   * Each round is displayed with a 1 second interval.
   */
  function renderRound() {
    var roundNumberTemp = $scope.roundNumber;
    var messagesTemp = $scope.messages;
    var playerTemp = {};
    var mobTemp = {};
    playerTemp = _.extend(playerTemp, $scope.player.stats);
    mobTemp = _.extend(mobTemp, $scope.mob);
    window.setTimeout(function() {
      InterfaceDraw.renderFight(messagesTemp, playerTemp, mobTemp, roundNumberTemp);
    }, $scope.roundNumber * 1000);
    $scope.roundNumber += 1;
  }


  return {
    /**
     * Launch the fight and take action depending on the outcome.
     */
    fight: function() {
      $scope.player = CharServ.getAllDatas();
      $scope.mob = AdversariesDB.getStats();

      InterfaceDraw.openCombatLog($scope.player.stats, $scope.mob);
      $scope.roundNumber = 1;

      var victory = fightRound();

      if (victory) {
        gainReward();
      } else {
        CharServ.die();
      }
      window.setTimeout(function() {
        InterfaceDraw.closeCombatLog($scope.messages, $scope.mob);
      }, $scope.roundNumber * 1000);
    }
  };




}]);
