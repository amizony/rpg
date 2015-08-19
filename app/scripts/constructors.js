"use strict";

/**
 * Constructor generating a new diceroller with specified options.
 *
 * @param {hash} options: definition of the dice roller we want to create, as:
 *                        {criticalThreshold: the score to reach (with D20) for a critical success,
 *                         bonus: amout to add to the roll for determining success or failure,
 *                         difficulty: score to reach (with the bonus) to have a success}
 * @return {function} the function that will make this rolls.
 */
function DiceRoller(options) {

  var opts = _.extend({
    criticalThreshold: 20,
    bonus: 0,
    difficulty: 50
  }, options);

  /**
   * @return {hash} result of the roll as: {roll: the total roll, D20 + bonus,
   *                                        result: the outcome as (critical)success or (critical)failure}
   */
  function diceRoll() {
    var roll = _.random(1, 20);
    var result;

    if (roll >= opts.criticalThreshold) {
      result = "criticalSuccess";
    } else if (roll === 1) {
      result = "criticalFailure";
    } else if (roll + opts.bonus > opts.difficulty) {
      result = "success";
    } else {
      result = "failure";
    }

    return {
      roll: roll + opts.bonus,
      result: result
    };
  }

  return diceRoll;
}

/**
 * Fighter Class.
 *
 * @param {hash} fighter: characteristics of the fighter (stats, attribute, weapon, armor).
 * @return {hash} API of the class.
 */
function Fighter(fighter) {
  var self = fighter;

  var _target = null;

  var options = {
    bonus: self.stats.hitBonus,
    criticalThreshold: self.weapon.critical[0]
  };
  var diceRoller;

  return {
    stats: self.stats,
    weapon: self.weapon,
    attribute: self.attribute,

    /**
     * Return current target.
     */
    get target() {
      return _target;
    },
    /**
     * Define current target, and generate a new diceroller to attack it.
     */
    set target(target) {
      _target = target;
      options.difficulty = target.stats.defence;
      diceRoller = new DiceRoller(options);
    },

    /**
     * Make an attack roll against the target.
     *
     * @return {hash} the result of the attack as: {roll: the attack roll,
     *                                              result: outcome of the attack (critical)success or (critical)failure}
     */
    attack: function() {
      return diceRoller();
    },

    /**
     * Calculate the random damages from the weapon held.
     *
     * @param {string} weaponDamage: damages possibilities of weapon, as 'integer'd'integer' (1d8 , 3d12, 6d4)
     *                               the first integer is the number of dices and the second the dices' faces' number.
     * @return {integer} damages done.
     */
    rollDamages: function() {
      var nb = self.weapon.damages.slice(0, self.weapon.damages.indexOf("d"));
      var dice = self.weapon.damages.slice(self.weapon.damages.indexOf("d") + 1, self.weapon.damages.length);
      var damages = 0;

      for (var i = 0; i < nb; i++) {
        damages += _.random(1, dice);
      }

      return damages;
    },

    /**
     * Reduce the life when taking damages.
     *
     * @param {integer} damages: amout of damages taken.
     */
    takeDamages: function(damages) {
      self.stats.life -= damages;
    }
  };
}
