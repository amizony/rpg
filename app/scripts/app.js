"use strict";

/**
 * @ngdoc overview
 * @name rpgApp
 * @description
 * # rpgApp
 *
 * Main module of the application.
 */
angular.module("rpgApp", ["ngCookies", "ngRoute", "ngSanitize"]).config(function ($routeProvider) {
  $routeProvider
    .when("/", {
      templateUrl: "views/main.html",
      controller: "MainCtrl",
      controllerAs: "main"
    })
    .when("/about", {
      templateUrl: "views/about.html",
      controller: "AboutCtrl",
      controllerAs: "about"
    })
    .when("/faq", {
      templateUrl: "views/faq.html",
      controller: "FaqCtrl",
      controllerAs: "faq"
    })
    .otherwise({
      redirectTo: "/"
    });
});
