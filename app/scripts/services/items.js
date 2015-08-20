"use strict";

/**
 * @ngdoc function
 * @name rpgApp.service:ItemsDB
 * @description
 * Service holding a data base of all items (weapons, armors and others).
 */

angular.module("rpgApp").service("ItemsDB", function () {

  var weapons = [
    {
      name: "dagger",
      damages: "1d4",
      critical: [19, 2]
    },
    {
      name: "Rapier",
      damages: "1d6",
      critical: [18, 2]
    },
    {
      name: "Sword",
      damages: "1d8",
      critical: [19, 2]
    },
    {
      name: "Bastard Sword",
      damages: "1d10",
      critical: [19, 2]
    },
    {
      name: "Two-handed Sword",
      damages: "2d6",
      critical: [19, 2]
    },
    {
      name: "Mace",
      damages: "1d6",
      critical: [20, 2]
    },
    {
      name: "Warhammer",
      damages: "1d8",
      critical: [20, 3]
    },
    {
      name: "Heavy Flail",
      damages: "1d10",
      critical: [19, 2]
    },
    {
      name: "Hand Axe",
      damages: "1d6",
      critical: [20, 3]
    },
    {
      name: "Battle Axe",
      damages: "1d8",
      critical: [20, 3]
    },
    {
      name: "Halleberd",
      damages: "1d10",
      critical: [20, 3]
    },
    {
      name: "Great Axe",
      damages: "1d12",
      critical: [20, 3]
    },
    {
      name: "Scythe",
      damages: "2d4",
      critical: [20, 4]
    }
  ];

  var armors = [
    {
      name: "Padded Armor",
      defence: 1
    },
    {
      name: "Leather Armor",
      defence: 2
    },
    {
      name: "Hide Armor",
      defence: 3
    },
    {
      name: "Scale Mail",
      defence: 4
    },
    {
      name: "Chain Mail",
      defence: 5
    },
    {
      name: "Splint Mail",
      defence: 6
    },
    {
      name: "Half Plate",
      defence: 7
    },
    {
      name: "Full Plate",
      defence: 8
    },
  ];



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
   * @return {string} the new damages for the weapon.
   */
  function increaseDamages(damages) {
    var diceNumber = parseInt(damages.slice(0, 1)) + 1;
    return diceNumber + damages.slice(1);
  }

  /**
   * Reduce the defence provided by an armor.
   * Half and full plate decreased by 2, the others by 1.
   *
   * @param {integer} defence: protection provided by one armor.
   * @return {integer} the new defence for the armor.
   */
  function wornArmor(defence) {
    return _.floor(defence * 0.85);
  }

  /**
   * Increase the defence provided by an armor.
   *
   * @param {integer} defence: protection provided by one armor.
   * @return {integer} the new defence for the armor.
   */
  function goodArmor(defence) {
    return defence + 1;
  }

  return {
    /**
     * @return {hash} a random weapon from the list with some improvments to give to the player.
     */
    randomWeapon: function() {
      var weapon = _.extend({}, weapons[_.random(weapons.length - 1)]);

      if (_.random(3) === 0) {
        weapon.critical = [sharpen(weapon.critical[0]), weapon.critical[1]];
        weapon.name = "Sharp " + weapon.name;
      }

      if (_.random(3) === 0) {
        weapon.damages = increaseDamages(weapon.damages);
        weapon.name += " of Brutality";
      }

      // enhancement between 0 and 3
      weapon.enhancement = _.max([_.floor(_.random(13) / 3) - 1, 0]);
      if (weapon.enhancement > 0) {
        weapon.name += " + " + weapon.enhancement;
      }

      return weapon;
    },

    /**
     * @return {hash} a random armor from the list to give the player.
     */
    randomArmor: function() {
      var armor = _.extend({}, armors[_.random(armors.length - 1)]);

      if (_.random(3) === 0) {
        armor.defence = wornArmor(armor.defence);
        armor.name = "Worn " + armor.name;
      } else if (_.random(3) === 0) {
        armor.defence = goodArmor(armor.defence);
        armor.name += " of good quality";
      }

      // enhancement between 0 and 3
      armor.enhancement = _.max([_.floor(_.random(13) / 3) - 1, 0]);
      if (armor.enhancement > 0) {
        armor.name += " + " + armor.enhancement;
      }

      return armor;
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
