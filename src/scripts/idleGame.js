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
		{ id: 0, itemId: 0, name: "Better Scheduling", description: "When all your employees work under 40 hours a week, there's no need to pay them health benefits!", price: 500, mps: .05 },
		{ id: 1, itemId: 0, name: "Illegal Aliens", description: "By hiring only illegal aliens, you can make twice as much per worker!", price: 1500, mps: .1 },
		{ id: 2, itemId: 0, name: "On-Site Housing", description: "Why make your employees waste precious work hours by driving to and from work?  Maximize efficiency with on-site housing!", price: 30000, mps: .1 }
//		{ id: 0, itemId: 0, name: "", description: "", price: 0, mps: 0 }
	];

	this.getItem = function(id) {
		for(var item in this.items)
			if(this.items[item].id === id) 
				return this.items[item];

		return { id: -1, name: "", mps: 0, price: 0 };
	};

	this.getUpgrade = function(id) {
		for(var upgrade in this.upgrades)
			if(this.upgrades[upgrade].id === id) 
				return this.upgrades[upgrade];

		return { id: -1, itemId: -1, name: "", description: "", price: 0, mps: 0 };
	};
});

idleGame.service('playerService', function () {
	// Owned items are defined here as: { id: x, count: y }
	this.items = [];
	// Owned upgrades are stored here as: { id: x }
	this.upgrades = [];
	this.money = 15;
	this.companyName = "Default Company";

	this.getItem = function(id) {
		for(var item in this.items)
			if(this.items[item].id === id) 
				return this.items[item];

		return { id: -1, count: 0 };
	};

	this.getUpgrade = function(id) {
		for(var upgrade in this.upgrades)
			if(this.upgrades[upgrade].id === id) 
				return this.upgrades[upgrade];

		return { id: -1, itemId: -1, name: "", description: "", price: 0, mps: 0 };
	};

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