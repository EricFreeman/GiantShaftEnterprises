var idleGame = angular.module('idleGame');

idleGame.service('spaceStory', function ($rootScope, playerService) {
	this.peacefulMessages = [
		'Hello.',
		'Would you like to trade?',
		'Welcome to our colony.',
		'We look forward to a sustainable, peaceful relationship.'
	];

	this.neutralMessages = [
		'We do not want any trouble.',
		'We are wary of you.',
		'Your planet has earned a bad reputation.'
	];

	this.enemyMessages = [
		'Your planet disgusts us.',
		'Leave.',
		'Go away.',
		'We do not want any trouble.'
	];

	this.broadcastMessage = function() {
		var list, 
			conqueredPlanets = playerService.planets.reduce(function(prev, cur) { return prev += cur.isConquered ? 1 : 0; }, 0);

		if(conqueredPlanets == 0) list = this.peacefulMessages;
		else if(conqueredPlanets <= 3) list = this.neutralMessages;
		else list = this.enemyMessages;

		this.displayMessage(this.randomMessage(list));
	}

	this.displayMessage = function(message) {
		$rootScope.$broadcast('displayMessage', message);
	}

	this.randomMessage = function(list) {
		var index = Math.floor(Math.random() * list.length);
		return list[index];
	}
});