"use strict";

/**
 * @ngdoc function
 * @name rpgApp.service:FightEngine
 * @description
 * Turn-based fight engine.
 */

angular.module("rpgApp").service("FightEngine", ["CharServ", "AdversariesServ", "InterfaceDraw", "ItemsDB", function (CharServ, AdversariesServ, InterfaceDraw, ItemsDB) {

  var $scope = {};

  /**
   * Give a reward to the player when he wins a fight.
   * XP is always awarded and a random item may be awarded.
   *
   * @param {integer} xp: amount of experience points for killing this enemy.
   */
  function gainReward(xp) {
    var messages = CharServ.getXP(xp);
    addMessages(messages, "reward");

    if (_.random(7) === 0) {
      var rare = ItemsDB.randomRare();
      CharServ.gainItem(rare);
      addMessages(["You gain a " + rare.name + "."], "reward");
    }

    if(_.random(2) === 0) {
      var potion = ItemsDB.randomPotion();
      CharServ.gainItem(potion);
      addMessages(["You gain a " + potion.name + "."], "reward");
    }

    if (_.random(2) === 0) {
      var weapon = ItemsDB.randomWeapon();
      addMessages(["You find a new Weapon: " + weapon.name], "weaponReward", weapon);
    }

    if (_.random(2) === 0) {
      var armor = ItemsDB.randomArmor();
      addMessages(["You find a new Armor: " + armor.name], "armorReward", armor);
    }
  }

  /**
   * Push messages in $scope.messages with the right keys.
   *
   * @param {array} messages: an array of strings containing the messages.
   * @param {string} type: information about the way the message will be displayed.
   * @param {integer} opt: [optional] extra data to the message, used fo the damages done with the action or item rewarded.
   */
  function addMessages(messages, type, opt) {
    _.forIn(messages, function(value) {
      $scope.messages.push({
        text: value,
        type: type,
        opt: opt
      });
    });
  }

  /**
   * Recursive function computing all actions of one round, and compiling in
   * $scope.messages for the rendering in the combatLog.
   * The fight ends when the life of someone reaches 0.
   *
   * @param {hash} fighters: the participants of the fight.
   * @return {boolean} true if the player won the fight, false otherwise.
   */
  function fightRound(fighters) {
    var playerDamages, mobDamages;

    $scope.roundNumber += 1;
    addMessages(["Round " + $scope.roundNumber], "newRound");

    // regain 1 mana pro round
    CharServ.manaRegen();

    var playerAtt = fighters.player.attack();

    if (playerAtt.result === "criticalSuccess") {
      // critical success hits automatically with improved damages
      playerDamages = (fighters.player.rollDamages() + fighters.player.attribute.strength) * fighters.player.weapon.critical[1];
      fighters.mob.takeDamages(playerDamages);

      addMessages(["You attack: " + playerAtt.roll + "   -- CRITICAL HIT!"], "attack");
      addMessages(["You hit the enemy and inflict " + playerDamages + " damages."], "damagesToMob", playerDamages);
    }

    if (playerAtt.result === "criticalFailure") {
      // critical failure misses always and cause bad outcome
      playerDamages = 2;
      fighters.player.takeDamages(playerDamages);

      addMessages(["You attack: " + playerAtt.roll + "   -- CRITICAL FAILURE!"], "attack");
      addMessages(["You hit yourself for " + playerDamages + " damages."], "damagesToPlayer", playerDamages);
    }

    if (playerAtt.result === "success") {
      // do some damages if the attack hit
      playerDamages = fighters.player.rollDamages() + fighters.player.attribute.strength;
      fighters.mob.takeDamages(playerDamages);

      addMessages(["You attack: " + playerAtt.roll + "    vs enemy defence: " + fighters.mob.stats.defence + " -- Hit"], "attack");
      addMessages(["You hit the enemy and inflict " + playerDamages + " damages."], "damagesToMob", playerDamages);
    }

    if (playerAtt.result === "failure") {
      // nothing happens
      addMessages(["You attack: " + playerAtt.roll + "    vs enemy defence: " + fighters.mob.stats.defence + " -- Miss"], "attack");
    }

    if (fighters.player.stats.life < 1) {
      // fight ends if the player dies
      addMessages(["You fall to the ground, critically wounded."], "playerDeath");
      return false;
    }

    if (fighters.mob.stats.life < 1) {
      // fight ends if the monster dies
      addMessages(["The enemy dies."], "mobDeath");
      return true;
    }


    var mobAtt = fighters.mob.attack();

    if (mobAtt.result === "criticalSuccess") {
      // critical hits automatically
      mobDamages = (fighters.mob.rollDamages() + fighters.mob.attribute.strength) * fighters.mob.weapon.critical[1];
      fighters.player.takeDamages(mobDamages);

      addMessages(["The enemy attacks: " + mobAtt.roll + "   -- CRITICAL HIT!"], "attack");
      addMessages(["You are hit and receive " + mobDamages + " damages."], "damagesToPlayer", mobDamages);
    }

    if (mobAtt.result === "criticalFailure") {
      // critical failure misses always and cause bad outcome
      mobDamages = 2;
      fighters.mob.takeDamages(mobDamages);

      addMessages(["The enemy attacks: " + mobAtt.roll + "   -- CRITICAL FAILURE!"], "attack");
      addMessages(["The enemy wounds himself for " + mobDamages + " damages."], "damagesToMob", mobDamages);
    }

    if (mobAtt.result === "success") {
      // do some damages if the attack hit
      mobDamages = fighters.mob.rollDamages() + fighters.mob.attribute.strength;
      fighters.player.takeDamages(mobDamages);

      addMessages(["The enemy attacks: " + mobAtt.roll + "    vs your defence: " + fighters.player.stats.defence + " -- Hit"], "attack");
      addMessages(["You are hit and receive " + mobDamages + " damages."], "damagesToPlayer", mobDamages);
    }

    if (mobAtt.result === "failure") {
      // nothing happens
      addMessages(["The enemy attacks: " + mobAtt.roll + "    vs your defence: " + fighters.player.stats.defence + " -- Miss"], "attack");
    }

    if (fighters.player.stats.life < 1) {
      // fight ends if the player dies
      addMessages(["You fall to the ground, critically wounded."], "playerDeath");
      return false;
    }

    if (fighters.mob.stats.life < 1) {
      // fight ends if the monster dies
      addMessages(["The enemy dies."], "mobDeath");
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
        player: new Fighter(CharServ.getAllDatas()),
        mob: new Fighter(AdversariesServ.getStats())
      };

      fighters.player.target = fighters.mob;
      fighters.mob.target = fighters.player;

      InterfaceDraw.openCombatLog(CharServ.getAllDatas(), AdversariesServ.getStats());


      var victory = fightRound(fighters);

      if (victory) {
        addMessages(["Victory!"], "endFight");
        gainReward(fighters.mob.stats.xpReward);
        CharServ.takeDamages(CharServ.getAllDatas().stats.life - fighters.player.stats.life);
      } else {
        addMessages(["Defeat!"], "endFight");
        var messages = CharServ.die();
        addMessages(messages, "reward");
      }

      addMessages(["END"], "End");

      InterfaceDraw.renderFight($scope.messages);
    }
  };




}]);
