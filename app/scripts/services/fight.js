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
    var messages = CharServ.getXP($scope.mob.xpReward);
    addMessages(messages, "reward");

    if (_.random(7) === 0) {
      CharServ.gainItem("Resurection Stone");
      addMessages("You gain a Resurection Stone.", "reward");
    }
  }

  function addMessages(messages, type, opt) {
    _.forIn(messages, function(value) {
      $scope.messages.push({
        text: value,
        type: type,
        dmg: opt
      });
    });
  }

  /**
   * Recursive function computing all actions of one round, and compiling in
   * $scope.messages for the rendering in the combatLog.
   * The fight ends when the life of someone reaches 0.
   *
   * @return {boolean} true if the player won the fight, false otherwise.
   */
  function fightRound(fighters) {
    var playerDamages, mobDamages;

    $scope.roundNumber += 1;
    addMessages("Round " + $scope.roundNumber, "newRound");

    // regain 1 mana pro round
    CharServ.manaRegen();

    var playerAtt = fighters.player.attack();

    if (playerAtt.result === "criticalSuccess") {
      // critical success hits automatically with improved damages
      playerDamages = (fighters.player.rollDamages() + fighters.player.attribute.strength) * fighters.player.weapon.critical[1];
      fighters.mob.takeDamages(playerDamages);

      addMessages("You attack: " + playerAtt.roll + "   -- CRITICAL HIT!", "attack");
      addMessages("You hit the enemy and inflict " + playerDamages + " damages.", "damagesToMob", playerDamages);
    }

    if (playerAtt.result === "criticalFailure") {
      // critical failure misses always and cause bad outcome
      playerDamages = 2;
      fighters.player.takeDamages(playerDamages);

      addMessages("You attack: " + playerAtt.roll + "   -- CRITICAL FAILURE!", "attack");
      addMessages("You hit yourself for " + 2 + " damages.", "damagesToPlayer", playerDamages);
    }

    if (playerAtt.result === "success") {
      // do some damages if the attack hit
      playerDamages = fighters.player.rollDamages() + fighters.player.attribute.strength;
      fighters.mob.takeDamages(playerDamages);

      addMessages("You attack: " + playerAtt.roll + "    vs enemy defence: " + fighters.mob.stats.defence + " -- Hit", "attack");
      addMessages("You hit the enemy and inflict " + playerDamages + " damages.", "damagesToMob", playerDamages);
    }

    if (playerAtt.result === "failure") {
      // nothing happens
      addMessages("You attack: " + playerAtt.roll + "    vs enemy defence: " + fighters.mob.stats.defence + " -- Miss", "attack");
    }

    if (fighters.player.stats.life < 1) {
      // fight ends if the player dies
      addMessages("You fall to the ground, critically wounded.", "playerDeath");
      return false;
    }

    if (fighters.mob.stats.life < 1) {
      // fight ends if the monster dies
      addMessages("The enemy dies.", "mobDeath");
      return true;
    }


    var mobAtt = fighters.mob.attack();

    if (mobAtt.result === "criticalSuccess") {
      // critical hits automatically
      mobDamages = (fighters.mob.rollDamages() + fighters.mob.attribute.strength) * fighters.mob.weapon.critical[1];
      fighters.player.takeDamages(mobDamages);

      addMessages("The enemy attacks: " + mobAtt.roll + "   -- CRITICAL HIT!", "attack");
      addMessages("You are hit and receive " + mobDamages + " damages.", "damagesToPlayer", mobDamages);
    }

    if (mobAtt.result === "criticalFailure") {
      // critical failure misses always and cause bad outcome
      mobDamages = 2;
      fighters.mob.takeDamages(mobDamages);

      addMessages("The enemy attacks: " + mobAtt.roll + "   -- CRITICAL FAILURE!", "attack");
      addMessages("The enemy wounds himself for " + mobDamages + " damages.", "damagesToMob", mobDamages);
    }

    if (mobAtt.result === "success") {
      // do some damages if the attack hit
      mobDamages = fighters.mob.rollDamages() + fighters.mob.attribute.strength;
      fighters.player.takeDamages(mobDamages);

      addMessages("The enemy attacks: " + mobAtt.roll + "    vs your defence: " + fighters.player.stats.defence + " -- Hit", "attack");
      addMessages("You are hit and receive " + mobDamages + " damages.", "damagesToPlayer", mobDamages);
    }

    if (mobAtt.result === "failure") {
      // nothing happens
      addMessages("The enemy attacks: " + mobAtt.roll + "    vs your defence: " + fighters.player.stats.defence + " -- Miss", "attack");
    }

    if (fighters.player.stats.life < 1) {
      // fight ends if the player dies
      addMessages("You fall to the ground, critically wounded.", "playerDeath");
      return false;
    }

    if (fighters.mob.stats.life < 1) {
      // fight ends if the monster dies
      addMessages("The enemy dies.", "mobDeath");
      return true;
    }

    return fightRound(fighters);
  }


  return {
    /**
     * Launch the fight and take action depending on the outcome.
     * And then initiate the rendering of the fight.
     */
    fight: function() {

      $scope.roundNumber = 0;
      $scope.messages = [];

      var fighters = {
        player: new Fighter(_.extend({}, CharServ.getAllDatas())),
        mob: new Fighter(_.extend({}, AdversariesDB.getStats()))
      };

      fighters.player.target = fighters.mob;
      fighters.mob.target = fighters.player;

      InterfaceDraw.openCombatLog(_.extend({}, CharServ.getAllDatas()), _.extend({}, AdversariesDB.getStats()));


      var victory = fightRound(fighters);

      if (victory) {
        addMessages("Victory!", "endFight");
        gainReward();
      } else {
        addMessages("Defeat!", "endFight");
        var messages = CharServ.die();
        addMessages(messages, "reward");
      }

      addMessages("", "End");

      InterfaceDraw.renderFight($scope.messages);
    }
  };




}]);
