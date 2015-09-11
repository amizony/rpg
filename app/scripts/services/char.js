"use strict";

/**
 * @ngdoc function
 * @name rpgApp.service:CharServ
 * @description
 * Service holding every data related to the character.
 * Provide functions to access or modify them.
 */

angular.module("rpgApp").service("CharServ", ["MapServ", "CharCreation", function (MapServ, CharCreation) {

  var $scope = {};

  /**
   * Determine the initial position of the player.
   *
   * @return {array} position of hero, as [x,y].
   */
  function randPos() {
    var posX, posY;
    do {
      posX = _.random(0,37);
      posY = _.random(0,35);
    } while (MapServ.isWall([posX, posY]));
    return [posX, posY];
  }

  /**
   * Provide a level increase to the player.
   * Increase and recalculate the player's stats.
   */
  function levelUP() {
    $scope.stats.experience -= $scope.stats.level *1000;
    $scope.stats.level += 1;
    if ($scope.stats.level % 5 === 0) {
      var attributeIncrease = _.shuffle([1, 0, 0]);
      var i = 0;
      _.forIn($scope.attribute, function(value, key) {
        $scope.attribute[key] = value + attributeIncrease[i];
        i += 1;
      });
    }

    recalculateStats();
    $scope.stats.life = $scope.stats.lifeMax;
    //$scope.stats.mana = $scope.stats.manaMax;
  }

  function recalculateStats() {
    $scope.stats.lifeMax = $scope.stats.level * (8 + $scope.attribute.endurance);
    //$scope.stats.manaMax = $scope.stats.level * (2 + $scope.attribute.wisdom);
    $scope.stats.hitBonus = _.floor(($scope.stats.level + $scope.attribute.strength + $scope.weapon.hitBonus + $scope.weapon.enhancement) * (1 - $scope.armor.weight / 100));
    $scope.stats.defence = 10 + $scope.attribute.dexterity + $scope.armor.defence + $scope.armor.enhancement;
  }

  return {
    /**
     * Create the character.
     */
    create: function() {
      $scope = CharCreation.getChar();

      $scope.stats.level = 1;
      $scope.stats.experience = 0;

      recalculateStats();
      $scope.stats.life = $scope.stats.lifeMax;
      //$scope.stats.mana = $scope.stats.manaMax;

      // $scope.spells = {
      //   "Heavy Blow": {
      //     damages: 5,
      //     hitBonus: -2,
      //     mana: 1
      //   },
      //   "Precise Blow": {
      //     damages: -1,
      //     hitBonus: 2,
      //     mana: 1
      //   }
      // };

      var position = randPos();
      $scope.position = {
        x: position[0],
        y: position[1]
      };
    },
    /**
     * @return {array} cell coordinates of player, as [x,y].
     */
    getPosition: function() {
      return [$scope.position.x, $scope.position.y];
    },

    /**
     * @param {array} direction: adjustment of position to apply, as [+x, +y].
     */
    updatePosition: function(direction) {
      $scope.position.x += direction[0];
      $scope.position.y += direction[1];
      //console.log("New hero location: " + $scope.position.x + ", " + $scope.position.y);
    },

    getAllDatas: function() {
      return {
        stats: _.extend({}, $scope.stats),
        attribute: $scope.attribute,
        weapon: $scope.weapon,
        armor: $scope.armor,
        spells: $scope.spells,
        inventory: $scope.inventory,
      };
    },

    /**
     * @param {integer} dmg: damages taken by the player.
     */
    takeDamages: function(dmg) {
      $scope.stats.life -= dmg;
      if ($scope.stats.life < 1) {
        this.die();
      }
    },

    /**
     * @param {integer} exp: experience gained by the player.
     * @return {string} message to display in the combat log.
     */
    getXP: function(exp) {
      var message = ["You got " + exp + " XP!"];
      $scope.stats.experience += exp;
      if ($scope.stats.experience >= $scope.stats.level * 1000) {
        levelUP();
        message.push("You gained a level! You are now level " + $scope.stats.level);
      }
      return message;
    },

    /**
     * Gaining a new item or increasing the number of one already in inventory.
     *
     * @param {string} item: the item to add to the inventory.
     */
    gainItem: function(item) {
      var itemFound = false;
      _.forIn($scope.inventory, function(value) {
        if (value.name === item.name) {
          value.quantity += 1;
          itemFound = true;
        }
      });
      if (!itemFound) {
        item.quantity = 1;
        $scope.inventory.push(item);
      }
    },

    /**
     * Decrease the quantity of an item when used.
     *
     * @param {string} name: the used item.
     */
    useItem: function(name) {
      _.forIn($scope.inventory, function(value) {
        if (value.name === name) {
          value.quantity -= 1;
        }
      });
    },

    /**
     * Receiving a new weapon.
     *
     * @param {hash} armor as: {name: {string},
     *                          damages: {string},
     *                          hiBonus: {integer},
     *                          critical: {array} as [range, multiplier],
     *                          enhancement: {integer}}
     */
    gainWeapon: function(weapon) {
      $scope.weapon = weapon;
      recalculateStats();
    },

    /**
     * Receiving a new armor.
     *
     * @param {hash} armor as: {name: {string},
     *                          defence: {integer},
     *                          weight: {integer},
     *                          enhancement: {integer}}
     */
    gainArmor: function(armor) {
      $scope.armor = armor;
      recalculateStats();
    },

    /**
     * When the life reaches 0 the character dies. A Resurection Stone allows to continue,
     * else a new game is started.
     *
     * @return {string} message to display in the combat log.
     */
    die: function() {
      // Resurection Stones always first item in inventory.
      if ($scope.inventory[0].quantity > 0) {
        $scope.inventory[0].quantity -= 1;
        $scope.stats.life = $scope.stats.lifeMax;
        return ["The use of a Resurection Stone allows you to continue your adventure (" + $scope.inventory[0].quantity + " left)."];
      } else {
        var temp = $scope.position;
        this.create();
        $scope.position = temp;
        return ["No Resurection Stones left - Game Over.", "New Game started"];
      }
    },

    /**
     * Regain a certain quantity of mana, or only 1 point if not specified.
     *
     * @param {integer} value: [optional] the quantity of mana to gain.
     */
    manaRegen: function(value) {
      var amount = value || 1;
      $scope.stats.mana = Math.min($scope.stats.mana + amount, $scope.stats.manaMax);
    },

    /**
    * Regain a certain quantity of life, or only 1 point if not specified.
    *
    * @param {integer} value: [optional] the quantity of life to gain.
    */
    lifeRegen: function(value) {
      var amount = value || 1;
      $scope.stats.life = Math.min($scope.stats.life + amount, $scope.stats.lifeMax);
    }
  };

}]);
