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
    var message = CharServ.getXP($scope.mob.xpReward);
    _.forIn(message, function(value) {
      $scope.messages.push({
        text: value,
        type: "reward"
      });
    });

    if (_.random(7) === 0) {
      CharServ.gainItem("Resurection Stone");
      $scope.messages.push({
        text: "You gain a Resurection Stone.",
        type: "reward"
      });
    }
  }

  /**
   * Recursive function computing all actions of one round, and compiling in
   * $scope.messages for the rendering in the combatLog.
   * The fight ends when the life of someone reaches 0.
   *
   * @return {boolean} true if the player won the fight, false otherwise.
   */
  function fightRound() {
    $scope.roundNumber += 1;
    $scope.messages.push({
      text: "Round " + $scope.roundNumber,
      type: "newRound"
    });

    // regain 1 mana pro round
    CharServ.manaRegen();


    // player actions

    // attack roll
    var playerAtt = actionRoll();

    if (isCriticalSuccess(playerAtt, $scope.player.weapon.critical[0])) {
      // critical success hits automatically with improved damages
      playerAtt += $scope.player.stats.hitBonus;
      var playerCritDmg = (rollDamages($scope.player.weapon.damages) + $scope.player.attribute.strength) * $scope.player.weapon.critical[1];
      $scope.mob.life -= playerCritDmg;

      $scope.messages.push({
        text: "You attack: " + playerAtt + "   -- CRITICAL HIT!",
        type: "attack"
      });

      $scope.messages.push({
        text: "You hit the enemy and inflict " + playerCritDmg + " damages.",
        type: "damagesToMob",
        dmg: playerCritDmg
      });

    } else if (isCriticalFailure(playerAtt)) {
      // critical failure misses always and cause bad outcome
      playerAtt += $scope.player.stats.hitBonus;
      $scope.player.stats.life -= 2;

      $scope.messages.push({
        text: "You attack: " + playerAtt + "   -- CRITICAL FAILURE!",
        type: "attack"
      });

      $scope.messages.push({
        text: "You hit yourself for " + 2 + " damages.",
        type: "damagesToPlayer",
        dmg: 2
      });
    } else {
      playerAtt += $scope.player.stats.hitBonus;

      if (isSuccess(playerAtt, $scope.mob.defence)) {
        // do some damages if the attack hit
        var playerDmg = rollDamages($scope.player.weapon.damages) + $scope.player.attribute.strength;
        $scope.mob.life -= playerDmg;
        $scope.messages.push({
          text: "You attack: " + playerAtt + "    vs enemy defence: " + $scope.mob.defence + " -- Hit",
          type: "attack"
        });

        $scope.messages.push({
          text: "You hit the enemy and inflict " + playerDmg + " damages.",
          type: "damagesToMob",
          dmg: playerDmg
        });
      } else {
        $scope.messages.push({
          text: "You attack: " + playerAtt + "    vs enemy defence: " + $scope.mob.defence + " -- Miss",
          type: "attack"
        });
      }
    }

    if ($scope.mob.life < 1) {
      // fight ends if the monster dies
      $scope.messages.push({
        text: "The enemy dies.",
        type: "mobDeath"
      });
      return true;
    }

    // mob actions

    // attack roll
    var mobAtt = actionRoll();
    if (isCriticalSuccess(mobAtt)) {
      // critical hits automatically
      mobAtt += $scope.mob.hitBonus;
      var mobCritDmg = rollDamages($scope.mob.damages) * 2;
      $scope.player.stats.life -= mobCritDmg;

      $scope.messages.push({
        text: "The enemy attacks: " + mobAtt + "   -- CRITICAL HIT!",
        type: "attack"
      });

      $scope.messages.push({
        text: "You are hit and receive " + mobCritDmg + " damages.",
        type: "damagesToPlayer",
        dmg: mobCritDmg
      });

    } else if (isCriticalFailure(mobAtt)) {
      // critical failure misses always and cause bad outcome
      mobAtt += $scope.mob.hitBonus;
      $scope.mob.life -= 2;

      $scope.messages.push({
        text: "The enemy attacks: " + mobAtt + "   -- CRITICAL FAILURE!",
        type: "attack"
      });

      $scope.messages.push({
        text: "The enemy wounds himself for " + 2 + " damages.",
        type: "damagesToMob",
        dmg: 2
      });
    } else {
      mobAtt += $scope.mob.hitBonus;

      if (isSuccess(mobAtt, $scope.player.stats.defence)) {
        // do some damages if the attack hit
        var mobDmg = rollDamages($scope.mob.damages) + 2;
        $scope.player.stats.life -= mobDmg;

        $scope.messages.push({
          text: "The enemy attacks: " + mobAtt + "    vs your defence: " + $scope.player.stats.defence + " -- Hit",
          type: "attack"
        });

        $scope.messages.push({
          text: "You are hit and receive " + mobDmg + " damages.",
          type: "damagesToPlayer",
          dmg: mobDmg
        });
      } else {
        $scope.messages.push({
          text: "The enemy attacks: " + mobAtt + "    vs your defence: " + $scope.player.stats.defence + " -- Miss",
          type: "attack"
        });
      }
    }

    if ($scope.player.stats.life < 1) {
      // fight ends if the player dies
      $scope.messages.push({
        text: "You fall to the ground, critically wounded.",
        type: "playerDeath"
      });
      return false;
    }
    return fightRound();
  }


  return {
    /**
     * Launch the fight and take action depending on the outcome.
     * And then initiate the rendering of the fight.
     */
    fight: function() {
      $scope.player = CharServ.getAllDatas();
      $scope.mob = AdversariesDB.getStats();

      InterfaceDraw.openCombatLog(_.extend({}, $scope.player.stats), _.extend({}, $scope.mob));
      $scope.roundNumber = 0;
      $scope.messages = [];

      var victory = fightRound();

      if (victory) {
        $scope.messages.push({
          text: "Victory!",
          type: "endFight"
        });
        gainReward();
      } else {
        $scope.messages.push({
          text: "Defeat!",
          type: "endFight"
        });
        var message = CharServ.die();
        _.forIn(message, function(value) {
          $scope.messages.push({
            text: value,
            type: "reward"
          });
        });
      }

      $scope.messages.push({
        text: "",
        type: "End"
      });


      InterfaceDraw.renderFight($scope.messages);
    }
  };




}]);
