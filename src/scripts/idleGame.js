var idleGame = angular.module('idleGame', ['ngRoute']);

idleGame.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
			when('/store', {
				templateUrl: 'store.html',
				controller: 'StoreController'
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
	this.companyName = "Default Company";
	this.money = 15;
	this.fps = 10;
	
	// All base items (not upgrades) you can purchase are defined here
	this.items = [
		{ id: 0, name: "Minimum Wage Worker", count: 0, mps: .1 , price: 15 },
		{ id: 1, name: "Cubical", count: 0, mps: .3 , price: 100 },
		{ id: 2, name: "Salary Employee", count: 0, mps: 2, price: 1500 },
		{ id: 7, name: "Ergonomic Keyboards", count: 0, mps: 1, price: 1500 },
		{ id: 3, name: "Upper Management", count: 0, mps: 1, price: 2000 },
		{ id: 4, name: "Standing Desk", count: 0, mps: 3, price: 2500 },
		{ id: 5, name: "Office Building", count: 0, mps: 3, price: 2500 },
		{ id: 6, name: "Executive", count: 0, mps: 10, price: 5000 },
		{ id: 8, name: "Benefits Package", count: 0, mps: 20, price: 50000 }
	];
	
	// Your cumulative mps (money per second) is the combination of the 
	// count of each item multiplied by the item's individual mps
	this.mps = function() {
		return this.items.reduce(function (prev, cur) {
			return prev += cur.mps * cur.count;
		}, 0);
	};
});