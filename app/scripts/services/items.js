"use strict";

/**
 * @ngdoc function
 * @name rpgApp.service:ItemsDB
 * @description
 * Service holding a data base of all items (weapons, armors and others).
 */

angular.module("rpgApp").service("ItemsDB", ["CharServ", function (CharServ) {

  var weapons = [
    {
      name: "dagger",
      damages: "1d4",
      hitBonus: 5,
      critical: [19, 2]
    },
    {
      name: "Rapier",
      damages: "1d6",
      hitBonus: 3,
      critical: [18, 2]
    },
    {
      name: "Sword",
      damages: "1d8",
      hitBonus: 1,
      critical: [19, 2]
    },
    {
      name: "Bastard Sword",
      damages: "1d10",
      hitBonus: 1,
      critical: [19, 2]
    },
    {
      name: "Two-handed Sword",
      damages: "2d6",
      hitBonus: -1,
      critical: [19, 2]
    },
    {
      name: "Mace",
      damages: "1d6",
      hitBonus: 0,
      critical: [20, 2]
    },
    {
      name: "Warhammer",
      damages: "1d8",
      hitBonus: 1,
      critical: [20, 3]
    },
    {
      name: "Heavy Flail",
      damages: "1d10",
      hitBonus: 0,
      critical: [19, 2]
    },
    {
      name: "Hand Axe",
      damages: "1d6",
      hitBonus: 2,
      critical: [20, 3]
    },
    {
      name: "Battle Axe",
      damages: "1d8",
      hitBonus: 1,
      critical: [20, 3]
    },
    {
      name: "Halleberd",
      damages: "1d10",
      hitBonus: 0,
      critical: [20, 3]
    },
    {
      name: "Great Axe",
      damages: "1d12",
      hitBonus: -1,
      critical: [20, 3]
    },
    {
      name: "Scythe",
      damages: "2d4",
      hitBonus: -2,
      critical: [20, 4]
    }
  ];

  var armors = [
    {
      name: "Padded Armor",
      weight: 5,
      defence: 1
    },
    {
      name: "Leather Armor",
      weight: 10,
      defence: 2
    },
    {
      name: "Hide Armor",
      weight: 15,
      defence: 3
    },
    {
      name: "Scale Mail",
      weight: 20,
      defence: 4
    },
    {
      name: "Chain Mail",
      weight: 25,
      defence: 5
    },
    {
      name: "Splint Mail",
      weight: 30,
      defence: 6
    },
    {
      name: "Half Plate",
      weight: 35,
      defence: 7
    },
    {
      name: "Full Plate",
      weight: 40,
      defence: 8
    },
  ];

  var potions = [
    {
      name: "Minor Life Potion",
      description: "Regain 10 Life Points",
      usable: true,
      use: function() {
        CharServ.lifeRegen(10);
      }
    },
    {
      name: "Medium Life Potion",
      description: "Regain 50 Life Points",
      usable: true,
      use: function() {
        CharServ.lifeRegen(50);
      }
    },
    {
      name: "Major Life Potion",
      description: "Regain 100 Life Points",
      usable: true,
      use: function() {
        CharServ.lifeRegen(100);
      }
    }
  ];

  var rares = [
    {
      name: "Resurection Stone",
      usable: false,
    }
  ];

  /**
   * Double the critical range: 20 -> 19; 19 -> 17; 18 -> 15.
   *
   * @param {integer} critical: the threshold for a critical hit (20, 19 or 18).
   * @return {integer} the new threshold for landing a critical hit.
   */
  function increaseCriticalChance(critical) {
    return 2 * critical - 21;
  }

  /**
   * Increase the damages multiplier when landing a critical hit.
   *
   * @param {integer} multiplier: the damages mutiplier for a critical hit (2, 3 or 4).
   * @return {integer} the new multiplier.
   */
  function increaseCriticalMultiplier(multiplier) {
    return multiplier + 1;
  }

  /**
   * Increase the hit bonus of a weapon.
   *
   * @param {integer} hitBonus: the bonus for landing a hit.
   * @return {integer} the new bonus.
   */
  function increaseHitBonus(hitBonus) {
    return hitBonus + 2;
  }

  /**
   * Decrease the hit bonus of a weapon.
   *
   * @param {integer} hitBonus: the bonus for landing a hit.
   * @return {integer} the new bonus.
   */
  function decreaseHitBonus(hitBonus) {
    return hitBonus - 2;
  }

  /**
   * Double the number of dices for the weapon's damages.
   *
   * @param {string} damages: damages possibilities of weapon, as 'integer'd'integer' (1d8 , 3d12, 6d4)
   *                          the first integer is the number of dices and the second the dices' faces' number.
   * @return {string} the new damages for the weapon.
   */
  function increaseDamages(damages) {
    var diceNumber = parseInt(damages.slice(0, 1), 10) * 2;
    return diceNumber + damages.slice(1);
  }

  /**
   * Reduce by 2 the damages range of a weapon.
   *
   * @param {string} damages: damages possibilities of weapon, as 'integer'd'integer' (1d8 , 3d12, 6d4)
   *                          the first integer is the number of dices and the second the dices' faces' number.
   * @return {string} the new damages for the weapon.
   */
  function decreaseDamages(damages) {
    var dice = parseInt(damages.slice(damages.indexOf("d") + 1), 10) - 2;
    return damages.slice(0, damages.indexOf("d") + 1) + dice;
  }

  /**
   * Increase the defence provided by an armor.
   *
   * @param {integer} defence: protection provided by one armor.
   * @return {integer} the new defence for the armor.
   */
  function increaseArmor(defence) {
    return defence + 1;
  }

  /**
   * Reduce the defence provided by an armor.
   * Half and full plate decreased by 2, the others by 1.
   *
   * @param {integer} defence: protection provided by one armor.
   * @return {integer} the new defence for the armor.
   */
  function decreaseArmor(defence) {
    return _.floor(defence * 0.85);
  }

  /**
   * Increase the weight of an armor.
   *
   * @param {integer} weight: the malus applied to the hit bonus.
   * @return {integer} the new weight for the armor.
   */
  function increaseWeight(weight) {
    return weight + 10;
  }

  /**
   * Decrease the weight of an armor.
   *
   * @param {integer} weight: the malus applied to the hit bonus.
   * @return {integer} the new weight for the armor.
   */
  function decreaseWeight(weight) {
    return _.max([weight - 10, 0]);
  }


  return {
    /**
     * @param {integer} difficulty: mob's difficulty parameter, influencing the enhancement.
     * @return {hash} a random base weapon from the list for mobs.
     */
    randomBaseWeapon: function(difficulty) {
      var weapon = _.merge({}, weapons[_.random(weapons.length - 1)]);
      weapon.enhancement = _.max([difficulty + 1, 0]);
      if (weapon.enhancement > 0) {
        weapon.name += " + " + weapon.enhancement;
      }
      return weapon;
    },

    /**
     * @param {integer} difficulty: mob's difficulty parameter, influencing the enhancement.
     * @return {hash} a random base armor from the list for mobs.
     */
    randomBaseArmor: function(difficulty) {
      var armor = _.merge({}, armors[_.random(armors.length - 1)]);
      armor.enhancement = _.max([difficulty + 1, 0]);
      if (armor.enhancement > 0) {
        armor.name += " + " + armor.enhancement;
      }
      return armor;
    },

    /**
     * @return {hash} a random weapon from the list with some improvments to give to the player.
     */
    randomWeapon: function() {
      var weapon = _.merge({}, weapons[_.random(weapons.length - 1)]);

      var firstPrefix = _.random(10);
      var secondPrefix = _.random(10);
      var sufix = _.random(10);

      if (secondPrefix < 3) {
        weapon.damages = decreaseDamages(weapon.damages);
        weapon.name = "Rusty " + weapon.name;
      }

      if (secondPrefix > 8) {
        weapon.critical[0] = increaseCriticalChance(weapon.critical[0]);
        weapon.name = "Sharp " + weapon.name;
      }

      if (firstPrefix < 3) {
        weapon.hitBonus = decreaseHitBonus(weapon.hitBonus);
        weapon.name = "Unbalanced " + weapon.name;
      }

      if (firstPrefix > 8) {
        weapon.hitBonus = increaseHitBonus(weapon.hitBonus);
        weapon.name = "Well-balanced " + weapon.name;
      }

      if (sufix < 2) {
        weapon.damages = increaseDamages(weapon.damages);
        weapon.name += " of Brutality";
      }

      if (sufix >8) {
        weapon.critical[1] = increaseCriticalMultiplier(weapon.critical[1]);
        weapon.name += " of Extermination";
      }

      var level = CharServ.getAllDatas().stats.level;
      // enhancement between 0 and level/3 and then +1 for each 5 levels
      weapon.enhancement = _.floor(_.random(0, level) / 3) + _.floor(level / 5);
      if (weapon.enhancement > 0) {
        weapon.name += " + " + weapon.enhancement;
      }

      return weapon;
    },

    /**
     * @return {hash} a random armor from the list to give the player.
     */
    randomArmor: function() {
      var armor = _.merge({}, armors[_.random(armors.length - 1)]);

      var firstPrefix = _.random(10);
      var secondPrefix = _.random(10);
      var sufix = _.random(10);

      if (secondPrefix < 3) {
        armor.weight = increaseWeight(armor.weight);
        armor.name = "Heavy " + armor.name;
      }

      if (secondPrefix > 8) {
        armor.weight = decreaseWeight(armor.weight);
        armor.name = "Light " + armor.name;
      }

      if (firstPrefix < 3) {
        armor.defence = decreaseArmor(armor.defence);
        armor.name = "Worn " + armor.name;
      }

      if (firstPrefix > 8) {
        armor.defence = increaseArmor(armor.defence);
        armor.name = "Wellcrafted " + armor.name;
      }

      if (sufix < 2) {
        armor.weight = _.max([armor.weight - 15, 0]);
        armor.name += " of Swiftness";
      }

      if (sufix >8) {
        armor.defence += 3;
        armor.name += " of Protection";
      }

      var level = CharServ.getAllDatas().stats.level;
      // enhancement between 0 and level/3 and then +1 for each 5 levels
      armor.enhancement = _.floor(_.random(0, level) / 3) + _.floor(level / 5);
      if (armor.enhancement > 0) {
        armor.name += " + " + armor.enhancement;
      }

      return armor;
    },

    /**
     * @return {hash} a random potion from the list to give the player.
     */
    randomPotion: function() {
      var potion = _.merge({}, potions[_.random(potions.length - 1)]);
      return potion;
    },

    /**
     * @return {hash} a random rare item from the list to give the player.
     */
    randomRare: function() {
      var rare = _.merge({}, rares[_.random(rares.length - 1)]);
      return rare;
    }
  };
}]);
