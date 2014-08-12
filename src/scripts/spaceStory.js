var idleGame = angular.module('idleGame');

idleGame.service('spaceStory', function ($rootScope, playerService) {
	this.peacefulMessages = [
		'Welcome, friends.',
		'Would you like to trade?',
		'Welcome to our colony.',
		'We look forward to a peaceful relationship.',
		'We are eager to learn about your culture.',
		'Let us benefit each other.'
	];

	this.neutralMessages = [
		'We do not want any trouble.',
		'We are wary of you.',
		'Your planet has earned a bad reputation.',
		'Please, quit your planetary expansion.',
		'We only wish to be friends.',
		'We are a peaceful colony.  We wish you no harm.'
	];

	this.enemyMessages = [
		'Your planet disgusts us.',
		'Leave.',
		'Go away.',
		'You are despicable.',
		'We will destroy you.',
		'We welcome the chance to crush you in battle.',
		'Please spare us.',
		'Why are you attacking us?'
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