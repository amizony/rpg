"use strict";

/**
 * @ngdoc function
 * @name rpgApp.service:FightEngine
 * @description
 * Turn-based fight engine.
 */

angular.module("rpgApp").service("FightEngine", [
  "CharServ", "AdversariesDB", "InterfaceDraw", "Fighter",
  function (CharServ, AdversariesDB, InterfaceDraw, Fighter) {

  var $scope = {};

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
  function fightRound(opponents) {
    $scope.roundNumber += 1;
    $scope.messages.push({
      text: "Round " + $scope.roundNumber,
      type: "newRound"
    });

    // regain 1 mana pro round
    CharServ.manaRegen();

    var player = opponents.player;
    var mob = opponents.mob;

    // 1st: player attacks!
    var attackFromPlayer = player.attack();
    // Let's do that the synchronous way (not using promises), by inspecting
    // the return value from attack():

    console.log(attackFromPlayer);
    if (attackFromPlayer.isSuccess) {
      if (attackFromPlayer.isCritical) {
        // All the message handling could be "extracted" in functions within
        // that same module, just to keep fightRound() as short as possible.
        // For instance: handleCriticalSuccess(), handleSuccess(), etc.
        // One would need to pass the attackFromPlayer object as argument, though.
        $scope.messages.push({
          text: "You attack: " + attackFromPlayer.value + "   -- CRITICAL HIT!",
          type: "attack"
        });
        $scope.messages.push({
          text: "You hit the enemy and inflict " + attackFromPlayer.damages + " damages.",
          type: "damagesToMob",
          dmg: attackFromPlayer.damages
        });
      } else {
        // TODO
      }
    } else if (attackFromPlayer.isFailure) {
      if (attackFromPlayer.isCritical) {
        // TODO
      } else {
        // TODO
      }
    }

    // 2nd: mob attacks!
    //mob.attack();

    // TODO: add the recursion final conditions back (return statements).




    // --- Commented, kept for reference ---------------------------------------

    //if (isCriticalSuccess(playerAtt, $scope.player.weapon.critical[0])) {
      //// critical success hits automatically with improved damages
      //playerAtt += $scope.player.stats.hitBonus;
      //var playerCritDmg = (rollDamages($scope.player.weapon.damages) + $scope.player.attribute.strength) * $scope.player.weapon.critical[1];
      //$scope.mob.life -= playerCritDmg;

      //$scope.messages.push({
        //text: "You attack: " + playerAtt + "   -- CRITICAL HIT!",
        //type: "attack"
      //});

      //$scope.messages.push({
        //text: "You hit the enemy and inflict " + playerCritDmg + " damages.",
        //type: "damagesToMob",
        //dmg: playerCritDmg
      //});

    //} else if (isCriticalFailure(playerAtt)) {
      //// critical failure misses always and cause bad outcome
      //playerAtt += $scope.player.stats.hitBonus;
      //$scope.player.stats.life -= 2;

      //$scope.messages.push({
        //text: "You attack: " + playerAtt + "   -- CRITICAL FAILURE!",
        //type: "attack"
      //});

      //$scope.messages.push({
        //text: "You hit yourself for " + 2 + " damages.",
        //type: "damagesToPlayer",
        //dmg: 2
      //});
    //} else {
      //playerAtt += $scope.player.stats.hitBonus;

      //if (isSuccess(playerAtt, $scope.mob.defence)) {
        //// do some damages if the attack hit
        //var playerDmg = rollDamages($scope.player.weapon.damages) + $scope.player.attribute.strength;
        //$scope.mob.life -= playerDmg;
        //$scope.messages.push({
          //text: "You attack: " + playerAtt + "    vs enemy defence: " + $scope.mob.defence + " -- Hit",
          //type: "attack"
        //});

        //$scope.messages.push({
          //text: "You hit the enemy and inflict " + playerDmg + " damages.",
          //type: "damagesToMob",
          //dmg: playerDmg
        //});
      //} else {
        //$scope.messages.push({
          //text: "You attack: " + playerAtt + "    vs enemy defence: " + $scope.mob.defence + " -- Miss",
          //type: "attack"
        //});
      //}
    //}

    //if ($scope.mob.life < 1) {
      //// fight ends if the monster dies
      //$scope.messages.push({
        //text: "The enemy dies.",
        //type: "mobDeath"
      //});
      //return true;
    //}

    //// mob actions

    //// attack roll
    //var mobAtt = actionRoll();
    //if (isCriticalSuccess(mobAtt)) {
      //// critical hits automatically
      //mobAtt += $scope.mob.hitBonus;
      //var mobCritDmg = rollDamages($scope.mob.damages) * 2;
      //$scope.player.stats.life -= mobCritDmg;

      //$scope.messages.push({
        //text: "The enemy attacks: " + mobAtt + "   -- CRITICAL HIT!",
        //type: "attack"
      //});

      //$scope.messages.push({
        //text: "You are hit and receive " + mobCritDmg + " damages.",
        //type: "damagesToPlayer",
        //dmg: mobCritDmg
      //});

    //} else if (isCriticalFailure(mobAtt)) {
      //// critical failure misses always and cause bad outcome
      //mobAtt += $scope.mob.hitBonus;
      //$scope.mob.life -= 2;

      //$scope.messages.push({
        //text: "The enemy attacks: " + mobAtt + "   -- CRITICAL FAILURE!",
        //type: "attack"
      //});

      //$scope.messages.push({
        //text: "The enemy wounds himself for " + 2 + " damages.",
        //type: "damagesToMob",
        //dmg: 2
      //});
    //} else {
      //mobAtt += $scope.mob.hitBonus;

      //if (isSuccess(mobAtt, $scope.player.stats.defence)) {
        //// do some damages if the attack hit
        //var mobDmg = rollDamages($scope.mob.damages) + 2;
        //$scope.player.stats.life -= mobDmg;

        //$scope.messages.push({
          //text: "The enemy attacks: " + mobAtt + "    vs your defence: " + $scope.player.stats.defence + " -- Hit",
          //type: "attack"
        //});

        //$scope.messages.push({
          //text: "You are hit and receive " + mobDmg + " damages.",
          //type: "damagesToPlayer",
          //dmg: mobDmg
        //});
      //} else {
        //$scope.messages.push({
          //text: "The enemy attacks: " + mobAtt + "    vs your defence: " + $scope.player.stats.defence + " -- Miss",
          //type: "attack"
        //});
      //}
    //}

    //if ($scope.player.stats.life < 1) {
      //// fight ends if the player dies
      //$scope.messages.push({
        //text: "You fall to the ground, critically wounded.",
        //type: "playerDeath"
      //});
      //return false;
    //}

    //return fightRound(opponents);
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

      // A few hard-coded lines one could may get rid of: specifying opponents
      // and attacker-target bindings.
      //
      // That could be made dynamic, allowing for priority management, taunt
      // skills, etc.
      var opponents = {
        player: new Fighter($scope.player),
        mob: new Fighter($scope.mob)
      };
      opponents.player.target = opponents.mob;
      opponents.mob.target = opponents.player;

      // Fight (& victory) is seen from the player perspective. Let's begin!
      var victory = fightRound(opponents);

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
