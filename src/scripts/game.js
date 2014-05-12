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
		{ "name" : "minimum wage worker", "count" : 1, "mps" : 1 , "price" : 15},
		{ "name" : "cubicals", "count" : 5, "mps" : 5 , "price" : 100},
		{ "name" : "salary employee", "count" : 2, "mps" : 50, "price" : 1500}
	];
	
	// Your cumulative mps (money per second) is the combination of the 
	// count of each item multiplied by the item's individual mps
	this.mps = function() {
		return this.items.reduce(function (prev, cur) {
			return prev += cur.mps * cur.count;
		}, 0);
	};
});

function GameLoopController($scope, $timeout, gameService) {	
	// Getters to grab values through gameService
	$scope.getMoney = function() {
		return gameService.money;
	}
	$scope.getMps = function() {
		return gameService.mps();
	}
	
	// Game Loop
	$scope.update = function() {
		gameService.money += (gameService.mps() / gameService.fps);
		$timeout($scope.update, 1000 / gameService.fps);
	};
	
	// Start game loop
	$scope.update();
}

function StoreController($scope, gameService) {
	
};

function StatasController($scope, gameService) {
	
};

function MenuController($scope, gameService) {
	
};