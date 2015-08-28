# RPG

A RPG dungeon crawler game.
In this game, you wander in a dungeon, encounter monsters and fight them in a turn-based battle.
As long as you survive you can gather experience (and gain new levels), new equipment (Weapons and armors) and potions to help you in your quest.
And when you feel ready you can fight against the master of the dungeon.

Demo is available: [RPG](http://amizony.github.io/rpg/index.html#/).

## Technologies

The base project was generated with [Yeoman](http://yeoman.io/).  
The application is built with [Grunt](http://gruntjs.com/) and using:
* [Angularjs](https://angularjs.org/)
* [Jquery](http://jquery.com/)
* [Pixijs](http://www.pixijs.com/): 2D WebGL renderer


## Features

* Wandering in a dungeon and encountering monsters
* Fights in Turn-based battles
* Gaining levels and equipment
* Enemies and equipments randomly generated
* Rules inspired from [Dungeons & Dragons](https://en.wikipedia.org/wiki/Dungeons_%26_Dragons)
* WebGL rendering


## Quick start

Install:

1. [Grunt](http://gruntjs.com/): `npm install -g grunt-cli`.

2. [Compass](http://compass-style.org/): `gem install compass` (you'll need [ruby](https://www.ruby-lang.org/en/) and [gem](https://rubygems.org/) installed for that).

3. Install dependencies : `npm install`.

Run `grunt serve` for preview.


## How to play

Use the arrows to move the character.  
Use the mouse to interact with the interface, use potions (from inventory) or equip found items.


## Development status

The game is in a playable state, but is still in development.  
A lot more features are planed.

#### What's planed

* Character creation
* More character classes
* Using skills or spells
* FAQ page with help for players
* Better graphics
* Saving the game (via cookies)


## About the code

I'm using Jquery for it's deferred object (promises).  
I'm using [lodash](https://lodash.com/) as helper library.  

The game is architectured as follows: one main controller for the game, and all the functionalities split up in different services, each of them responsible of a particular aspect of the game.  
I'm using pseudo-$scope in my services. Angular doesn't provide a `$scope` object in its services, and I don't need its functionalities, but do need a global object to attach data.
And calling it `$scope` seems a good way to stay consistent with Angular conventions. 


Some technologies present in this project (like bootstrap or compass) are not yet really used but are planed within the development.
