"use strict";

function DiceRoller(options) {
  // Default options and mechanics for the 1d20 strategy.
  //
  // May be overriden with an options hash provided as an argument to the dice
  // roller.
  var opts = _.extend({
    difficulty: 10
  }, options);
  var _strategy = function() {
    return _.random(1, 20);
  };
  var _criticalMax = 20;
  var _criticalMin = 1;

  return {
    /**
     * Set a specific rolling strategy.
     *
     * The default strategy is 1d20.
     */
    set strategy(strategyFn) {
      _strategy = strategyFn;
    },

    /**
     * Set a specific critical max threshold.
     *
     * The default threshold is 20 (max value for 1d20).
     */
    set criticalMax(threshold) {
      _criticalMax = threshold;
    },

    /**
     * Set a specific critical min threshold.
     *
     * The default threshold is 1 (min value for 1d20).
     */
    set criticalMin(threshold) {
      _criticalMin = threshold;
    },

    /**
     * Let's roll! Hopefully a good one.
     *
     * Access the value property of the roll to get the result.
     *
     * @param {object} stats: any custom stats used for computations
     * @return {object} describes the roll
     */
    roll: function(stats) {
      //this.value = _strategy();
      // HAHA! Let's do only crits for now!!!
      this.value = 20;
      return {
        value: this.value,
        isSuccess: this.isSuccess(stats.difficulty),
        isCritical: this.isCriticalSuccess(stats.criticalMax) || this.isCriticalFailure(stats.criticalMin)
      }
    },

    /**
     * Determine whether the roll is to be considered a success or a failure.
     *
     * @param {integer} difficulty: the score to beat to be successful.
     * @return {boolean} true if the action succeed, false otherwise.
     */
    isSuccess: function(difficulty) {
      return this.value > (difficulty || opts.difficulty);
    },

    /**
     * Determine if an action is a critical success.
     * Happens on a 20 - or lower with some weapons.
     *
     * @param {integer} threshold: custom value to overcome to trigger a critical success.
     * @return {boolean} true if the action is a critical success, false otherwise.
     */
    isCriticalSuccess: function(threshold) {
      return this.value >= (threshold || _criticalMax);
    },

    /**
     * Determine if an action is a critical failure.
     * Happens on a 1.
     *
     * @return {boolean} true if the action is a critical failure, false otherwise.
     */
    isCriticalFailure: function() {
      return this.value === _criticalMin;
    }
  }
}

/**
 * @ngdoc function
 * @name rpgApp.service:Fighter
 * @description
 * Represents an entity taking part in a fight.
 */

function Fighter(fighter) {
  var _target = null;

  function onAttackSucceded(roll) {
    // Monsters should have a weapon and attributes, like any fighters.
    var damages = (rollDamages(fighter.weapon.damages) + fighter.attribute.strength);
    if (roll.isCritical) {
      damages *= fighter.weapon.critical[1];
    }
    _target.life -= damages;
    return damages;
  };

  function onAttackFailed(roll) {
    var damages = 0;
    if (roll.isCritical) {
      damages = -2
    }
    fighter.stats.life -= damages;
    return damages;
  };

  /**
   * Compute a random amount of damages, taking the fighter's weapon into
   * account.
   *
   * @param {string} weaponDamage: weapon's possible damages, as 'integer'd'integer' (1d8 , 3d12, 6d4);
   *                               the first integer is the number of dices and the second the dices' faces' number.
   * @return {integer} damages output.
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

  return {
    get target() {
      return _target;
    },

    set target(target) {
      _target = target;
    },

    /**
     * Lands an attack on the fighter's target.
     */
    attack: function() {
      // Looks like a promise API here… roll (pending) -> [success|failure]
      var damages = null,
          stats = {
            criticalMax: fighter.weapon.critical[0]
          },
          roll = (new DiceRoller()).roll(stats);

      if (roll.isSuccess) {
        damages = onAttackSucceded(roll);
      } else {
        damages = onAttackFailed(roll);
      }

      return _.extend(roll, {
        damages: damages
      });
    }
  }
}

angular.module("rpgApp").value("Fighter", Fighter);
