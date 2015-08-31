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