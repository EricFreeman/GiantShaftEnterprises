var idleGame = angular.module('idleGame', ['ngRoute']);

idleGame.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
			when('/store', {
				templateUrl: 'store.html',
				controller: 'StoreController'
			}).
			when('/upgrades', {
				templateUrl: 'upgrades.html',
				controller: 'UpgradesController'
			}).
			when('/stats', {
				templateUrl: 'stats.html',
				controller: 'StatsController'
			}).
			when('/menu', {
				templateUrl: 'menu.html',
				controller: 'MenuController'
			}).
			otherwise({
				redirectTo: '/store'
			});
	}
]);

idleGame.service('gameService', function() {
	this.fps = 10;
	
	// All base items (not upgrades) you can purchase are defined here
	this.items = [
		{ id: 0, name: "Minimum Wage Worker", mps: .1 , price: 15 },
		{ id: 1, name: "Cubical", mps: .3 , price: 100 },
		{ id: 2, name: "Salary Employee", mps: 2, price: 1500 },
		{ id: 7, name: "Ergonomic Keyboards", mps: 1, price: 1500 },
		{ id: 9, name: "HR Department", mps: .5, price: 2000 },
		{ id: 3, name: "Upper Management", mps: 1, price: 2250 },
		{ id: 4, name: "Standing Desk", mps: 3, price: 2500 },
		{ id: 5, name: "Office Building", mps: 3, price: 2500 },
		{ id: 6, name: "Executive", mps: 10, price: 5000 },
		{ id: 8, name: "Benefits Package", mps: 20, price: 50000 }
	];

	// All upgrades for items
	this.upgrades = [
		{ id: 0, itemId: 0, name: "Better Scheduling", price: 500, mps: .05,
			description: "When all your employees work under 40 hours a week, there's no need to pay them health benefits!" },
		{ id: 1, itemId: 0, name: "Illegal Aliens", price: 1500, mps: .1,
			description: "By hiring only illegal aliens, you can make twice as much per worker!" },
		{ id: 2, itemId: 0, name: "On-Site Housing", price: 30000, mps: .1,
			description: "Why make your employees waste precious work hours by driving to and from work?  Maximize efficiency with on-site housing!" },

		{ id: 3, itemId: 1, name: "Lower walls", price: 1000, mps: .1,
			description: "Lowering the walls of a cubical will help increase team dynamics and promote synergy!" },
		{ id: 4, itemId: 1, name: "Better seating", price: 6000, mps: .2,
			description: "Better seating will reduce stress and improve your employees' quality of life!" },
		{ id: 5, itemId: 1, name: "Modest Improvements", price: 120000, mps: .3,
			description: "Adding better lighting, air-purifying plants, and other solutions to increase Feng Shui!" },

		{ id: 6, itemId: 2, name: "Four Tens", price: 10000, mps: .5, description: "Changing the work schedule to four ten hour days and giving the employees a three day weekened boosts employee retention cutting down on the cost to train new employees!" },
		{ id: 7, itemId: 2, name: "Free Lunch", price: 60000, mps: 1, description: "I guess there is such a thing." },
		{ id: 8, itemId: 2, name: "80/20", price: 1200000, mps: 2, description: "Letting your employees do whatever they want (within reason) 20% of the day gives them more skills, better attitudes, and extra creativity to get the most out of the remaining 80%!" },

//		{ id: 0, itemId: 0, name: "", price: 0, mps: 0, description: "" },
	];

	this.getItem = function(id) {
		return search(this.items, "id", id,
			{ id: -1, name: "", mps: 0, price: 0 });
	};

	this.getUpgrade = function(id) {
		return search(this.upgrades, "id", id,
			{ id: -1, itemId: -1, name: "", description: "", price: 0, mps: 0 });
	}
});

idleGame.service('playerService', function () {
	// Owned items are defined here as: { id: x, count: y }
	this.items = [];
	// Owned upgrades are stored here as: { id: x }
	this.upgrades = [];
	this.money = 15;
	this.companyName = "Default Company";

	this.getItem = function(id) {
		return search(this.items, "id", id,
			{ id: -1, count: 0 });
	};

	this.getUpgrade = function(id) {
		return search(this.upgrades, "id", id,
			{ id: -1, itemId: -1, name: "", description: "", price: 0, mps: 0 });
	}

	this.buyItem = function(id) {
		var item = this.getItem(id);

		// Add an entry for it if nobody has bought it yet.
		if(item.id === -1) {
			item.id = id;
			item.count++;
			this.items.push(item);
		}
		else {
			var index = this.items.indexOf(item);
			this.items[index].count++;
		}
	}

	this.buyUpgrade = function(upgrade) {
		this.upgrades.push(upgrade);
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