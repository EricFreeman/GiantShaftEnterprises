function GameLoopController($scope, $timeout, gameService, playerService, mpsService) {	
	// Getters to grab values through services
	$scope.getCompanyName = function() {
		return playerService.companyName;
	};
	$scope.getMoney = function() {
		return playerService.money;
	};
	$scope.getMps = function() {
		return mpsService.getMps();
	}

	$scope.loadGame = function() {
		// Grab current items.  Will be useful if more items were added after you started game
		var curr = playerService.items;

		// Go through each property of playerService, and if it exists, load it
		for(var prop in playerService) {
			var propName = "CompanyGame." + prop;
			if(localStorage[propName] != undefined)
				playerService[prop] = JSON.parse(localStorage.getItem(propName));
		}
	};

	$scope.saveGame = function() {
		// Save everything in the game service that isn't a function as JSON to local storage
		for(var prop in playerService) {
			if(typeof(playerService[prop]) != "function")
				localStorage.setItem("CompanyGame." + prop, JSON.stringify(playerService[prop]));
		}

		$timeout($scope.saveGame, 30000); // Recall this method to autosave every 30 seconds
	}
	
	var before = new Date();
	var now = new Date();

	// Game Loop
	$scope.update = function() {
		// Make sure the FPS is valid, otherwise default it
		if(!isNumeric(playerService.fps)) playerService.fps = 10;

		// Check if the timeout took longer than usual (this happens when the tab isn't selected in some browsers)
		now = new Date();
		var elapsedTime = (now.getTime() - before.getTime());
		var moneyEarned = 0;

		if(elapsedTime > 1000 / playerService.fps) {
			var extra = Math.floor(elapsedTime/(1000/playerService.fps));

			moneyEarned = ((mpsService.getMps() / playerService.fps) * extra);
		}
		else {
			moneyEarned = (mpsService.getMps() / playerService.fps);
		}
		
		playerService.money += moneyEarned;
		playerService.totalMoney += moneyEarned;

		before = new Date();
		$timeout($scope.update, 1000 / playerService.fps);
	};

	$scope.checkAchievements = function() {
		for(var a in gameService.achievements) {
			if(!playerService.hasAchievement(gameService.achievements[a].id)) {
				if(gameService.achievements[a].earn.call(null, gameService, playerService, mpsService))
					playerService.awardAchievement(gameService.achievements[a].id);
			}
		}

		$timeout($scope.checkAchievements, 1000);
	};

	$scope.checkAchievements();
	
	// Load the game if it was previously saved
	$scope.loadGame();

	// Start game loop
	$scope.update();

	// Start save loop of every 30 seconds
	$timeout($scope.saveGame, 30000);
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}