$(function() {
    $( document ).tooltip({
      track: true
    });
  });

var idleGame = angular.module('idleGame', ['ngRoute']);

idleGame.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
			when('/business', {
				templateUrl: 'business.html',
				controller: 'BusinessController'
			}).
			when('/stats', {
				templateUrl: 'stats.html',
				controller: 'StatsController'
			}).
			when('/space', {
				templateUrl: 'space.html',
				controller: 'SpaceController'
			}).
			when('/knowledge', {
				templateUrl: 'knowledge.html',
				controller: 'KnowledgeController'
			}).
			when('/menu', {
				templateUrl: 'menu.html',
				controller: 'MenuController'
			}).
			otherwise({
				redirectTo: '/business'
			});
	}
]);

idleGame.service('miningService', function(gameService) {
	// return a list of resources of the amount specified.
	// used for creating an asteroid of a certain size and 
	// for mining a certain amount of minterals
	this.getResources = function(amount) {
		var resources = gameService.resources,
			maxProp = resources.reduce(function(prev, cur){return prev + cur.proportion}, 0),
			rtn = [];

		for(var i = 0; i < amount; i++) {
			var choice = Math.random() * maxProp, self = this;
			var selection = resources.reduce(function(prev, cur) {
				// if it's numeric, keep iterating until proportion is over random number
				// once it's over, just return that item.  now the reduce function will return the random resource
				if(self.isNumber(prev)) {
					prev += cur.proportion;
					if (prev >= choice) {
						return cur;
					}
					return prev;
				}
				return prev;
			}, 0);

			// find the item in existing return data
			var item = rtn.filter(function(d) {return d.id == selection.id});
			if(item.length > 0) item = item[0];
			else item = {};

			// Add an entry for it if not on asteroid yet
			if(item.id === undefined) {
				rtn.push({id: selection.id, remaining: 1, name: selection.name});
			}
			//otherwise increment existing item
			else {
				var index = rtn.indexOf(item);
				rtn[index].remaining++;
			}
		}

		return rtn;
	}

	this.isNumber = function(n) {
		return !isNaN(parseFloat(n)) && isFinite(n);
	}
});

idleGame.service('importExportService', function($rootScope, cacheService, playerService, gameService) {
	this.loadGame = function(file) {
		// Grab current items.  Will be useful if more items were added after you started game
		var curr = playerService.items;

		// Go through each property of playerService, and if it exists, load it
		for(var prop in playerService) {
			var propName = "CompanyGame." + prop;
			if(file[propName] != undefined)
				playerService[prop] = JSON.parse(file[propName]);
		}

		// Load in any business knowledge items bought for this game
		$rootScope.$broadcast('loadKnowledge');

		// Update the chached values for click power and money/second
		$rootScope.$broadcast('updateCache');

		// Add in any money you should have received while the game was not playing
		var lastSave = file["CompanyGame.lastSaveDate"];
		if(lastSave) {
			var date = Date.parse(lastSave);
			var timePassed = (new Date() - date) / 1000;  // Divide by 1000 to get in seconds
			var missedMoney = timePassed * cacheService.getMps();

			// Get upgrades that deal with giving money when game isn't on
			var upgrades = gameService.upgrades.
				filter(function(d) {
					return d.isOnLoad;
				}).
				filter(function(d) {
					return playerService.getUpgrade(d.id).id >= 0;
				});

			for(var i = 0; i < upgrades.length; i++) {
				var missed = upgrades[i].per * missedMoney;
				playerService.money += missed;
				playerService.totalMoney += missed;
			}
		}
	}
});

idleGame.service('saveService', function(playerService, $rootScope) {
	this.saveGame = function() {
		// Save everything in the game service that isn't a function as JSON to local storage
		for(var prop in playerService) {
			if(typeof(playerService[prop]) != "function")
				localStorage.setItem("CompanyGame." + prop, JSON.stringify(playerService[prop]));
		}

		localStorage.setItem("CompanyGame.lastSaveDate", new Date());
		$rootScope.$broadcast('displayMessage', 'Game Saved!');
	}
});

// A simple search that will go through the passed in list and find
// the first item that the specified property matches a given value.
// Otherwise it will return a default value
var search = function(list, property, value, def) {
	for(var item in list)
		if(list[item][property] === value)
			return list[item];

	return def;
}

var isNumeric = function(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}