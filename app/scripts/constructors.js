"use strict";

function DiceRoller(options) {

  var opts = _.extend({
    difficulty: 50,
    bonus: 0,
    criticalThreshold: 20
  }, options);

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


function Fighter(fighter) {
  var self = fighter;

  var _target = null;

  var options = {
    difficulty: _target.stats.defence,
    bonus: self.stats.defence,
    criticalThreshold: self.weapon.critical[0]
  };
  var diceRoll = new DiceRoller(options);

  return {
    get target() {
      return _target;
    },

    set target(target) {
      _target = target;
    },

    attack: function() {
      return diceRoll();
    },

    rollDamages: function() {
      var nb = self.weapon.damages.slice(0, self.weapon.damages.indexOf("d"));
      var dice = self.weapon.damages.slice(self.weapondamages.indexOf("d") + 1, self.weapon.damages.length);
      var damages = 0;

      for (var i = 0; i < nb; i++) {
        damages += _.random(1, dice);
      }

      return damages;
    },

    takeDamages: function(damages) {
      self.stats.life -= damages;
    }
  };
}
