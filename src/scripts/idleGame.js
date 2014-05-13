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
	this.money = 0;
	this.fps = 10;
	
	// All base items (not upgrades) you can purchase are defined here
	this.items = [
		{ id: 0, name : "minimum wage worker", count : 1, mps : 1 , price : 15},
		{ id: 1, name : "cubicals", count : 0, mps : 5 , price : 100},
		{ id: 2, name : "salary employee", count : 0, mps : 50, price : 1500}
	];
	
	// Your cumulative mps (money per second) is the combination of the 
	// count of each item multiplied by the item's individual mps
	this.mps = function() {
		return this.items.reduce(function (prev, cur) {
			return prev += cur.mps * cur.count;
		}, 0);
	};
});