"use strict";

/**
 * @ngdoc function
 * @name rpgApp.service:ItemsDB
 * @description
 * Service holding a data base of all items (weapons, armors and others).
 */

angular.module("rpgApp").service("ItemsDB", function () {

  var weapons = {
    1: {
      name: "dagger",
      damages: "1d4",
      critical: [19, 2]
    },
    2: {
      name: "Rapier",
      damages: "1d6",
      critical: [18, 2]
    },
    3: {
      name: "Sword",
      damages: "1d8",
      critical: [19, 2]
    },
    4: {
      name: "Bastard Sword",
      damages: "1d10",
      critical: [19, 2]
    },
    5: {
      name: "Twohanded Sword",
      damages: "2d6",
      critical: [19, 2]
    },
    6: {
      name: "Mace",
      damages: "1d6",
      critical: [20, 2]
    },
    7: {
      name: "Warhammer",
      damages: "1d8",
      critical: [20, 3]
    },
    8: {
      name: "Heavy Flail",
      damages: "1d10",
      critical: [19, 2]
    },
    9: {
      name: "Hand Axe",
      damages: "1d6",
      critical: [20, 3]
    },
    10: {
      name: "Battle Axe",
      damages: "1d8",
      critical: [20, 3]
    },
    11: {
      name: "Halleberd",
      damages: "1d10",
      critical: [20, 3]
    },
    12: {
      name: "Great Axe",
      damages: "1d12",
      critical: [20, 3]
    },
    13: {
      name: "Scythe",
      damages: "2d4",
      critical: [20, 4]
    }
  };

  var armors = {};
  var potions = {};
  var rares = {};

  /**
   * Double the critical range: 20 -> 19; 19 -> 17; 18 -> 15.
   *
   * @param {integer} critical: the threshold for a critical hit (20, 19 or 18).
   * @return {integer} the new threshold for landing a critical hit.
   */
  function sharpen(critical) {
    return 2 * critical - 21;
  }

  /**
   * Add one dice to the weapon damages.
   *
   * @param {string} damages: damages possibilities of weapon, as 'integer'd'integer' (1d8 , 3d12, 6d4)
   *                          the first integer is the number of dices and the second the dices' faces' number.
   * @return {string} the new damages for the weapon
   */
  function increaseDamages(damages) {
    var diceNumber = _.slice(damages, 0, 1) + 1;
    return diceNumber + _.slice(damages, 1);
  }

  return {
    /**
     * @return {hash} a random weapon from the list with some improvments to give to the player.
     */
    randomWeapon: function() {
      var weapon = weapons[_.random(weapon.length)];

      if (_.random(3) === 0) {
        weapon.critical[0] = sharpen(weapon.critical[0]);
        weapon.name = "Sharp" + weapon.name;
      }

      if (_.random(3) === 0) {
        weapon.damages = increaseDamages(weapon.damages);
        weapon.name += " of Brutality";
      }

      // enhancement between 0 and 3
      weapon.enhancement = _.max([_.floor(_.random(13) / 3) - 1, 0]);
      if (weapon.enhancement > 0) {
        weapon.name += " + " + weapon.enhancement
      }

      return weapon;
    },

    /**
     * @return {hash} a random armor from the list to give the player.
     */
    randomArmor: function() {

    },

    /**
     * @return {hash} a random potion from the list to give the player.
     */
    randomPotion: function() {

    },

    /**
     * @return {hash} a random rare item from the list to give the player.
     */
    randomRare: function() {

    },

    /**
     * @param {string} name: potion we want to use.
     * @return {function} effect of the potion.
     */
    usePotion: function(name) {

    }
  };
});
