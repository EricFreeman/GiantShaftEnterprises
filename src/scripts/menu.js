function MenuController($rootScope, $scope, playerService, saveService) {
	$scope.playerService = playerService;
	$scope.potentialKp = function() { return Math.round(playerService.totalMoney / 1000000000); } 

	$scope.saveGame = function() {
		saveService.saveGame();
	}

	$scope.prestige = function() {
		playerService.totalMoneyReset += playerService.totalMoney;

		var knowledgeGained = Math.round(playerService.totalMoney / 1000000000); // every $1 billion you make = 1 Business Knowledge 
		playerService.knowledge += knowledgeGained;
		playerService.totalKnowledge += knowledgeGained;

		playerService.totalCompaniesStarted++;
		playerService.totalOpportunitiesReset += playerService.totalOpportunities;

		playerService.totalMoneyReset += playerService.totalMoney;
		playerService.totalMoney = playerService.vcPointsToMoney(playerService.vcFunding);
		playerService.money = playerService.vcPointsToMoney(playerService.vcFunding);
		playerService.items = [];
		playerService.upgrades = [];
		playerService.companyName = 'Giant Shaft Enterprises';
		playerService.totalOpportunities = 0;
		playerService.totalMoneyFromOpportunties = 0;

		$rootScope.$broadcast('updateCache');
		$rootScope.$broadcast('displayMessage', 'Starting Over!  Business Knowledge Gained: ' + knowledgeGained);
	}

	$scope.resetGame = function() {
		localStorage.clear();
	}

	$scope.updates = [
		{ title: '5/29/2014 - 6/4/2014', description: 'Added tons of new prestige items and upgrades.  Also added floating numbers when you complete business opportunities (you can turn it off in the menu) and some new early and end game items for clicking to make it still a useful thing besides just when using an autoclicker.' },
		{ title: '5/27/2014 - 5/28/2014', description: 'Prestige!  You can now create a new company from the menu tab.  This effectively starts you over from square one, but you gain "Business Knowledge" that can be spent to unlock new, powerful upgrades and items!' },
		{ title: '5/23/2014 - 5/26/2014', description: 'Trying to cache several of the bigger calculations to increase performance on lower systems.  Also added new achievements and upgrades!' },
		{ title: '5/22/2014', description: 'After reading the huge amount of constructive criticism on my Reddit post, I decided to change the game fairly dramatically.  I combined the Business, Store, and Upgrades tabs into one since this is where the heart of the game is.  I also merged About and Menu into one.  I made several changes that were also requested like a reset button and a way to hide upgrades you already purchased.  I also did my best to make the toast messages more readable.  I probably did some other stuff that I am forgetting, but nonetheless, please keep the ideas coming and a huge THANK YOU to everyone testing the game and giving me feedback!' },
		{ title: '5/21/2014', description: 'Added this page!  And toast messages.' },
		{ title: '5/9/2014 - 5/21/2014', description: 'I am not writing a description for the first almost two weeks of production, but rest assured I did a lot of work during this time.' }
	];
};