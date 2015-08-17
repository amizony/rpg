"use strict";

/**
 * @ngdoc function
 * @name rpgApp.service:ItemsDB
 * @description
 * Service holding a data base of all items (weapons, armors and others).
 */

angular.module("rpgApp").service("ItemsDB", function () {

  var weapons = {};
  var armors = {};
  var potions = {};
  var rares = {};


  return {
    /**
     * @return {hash} a random weapon from the list to give the player.
     */
    randomWeapon: function() {

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
