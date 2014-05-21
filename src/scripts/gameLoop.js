function GameLoopController($scope, $timeout, gameService, playerService, moneyService, saveService) {	
	// Getters to grab values through services
	$scope.getCompanyName = function() {
		return playerService.companyName;
	};
	$scope.getMoney = function() {
		return playerService.money;
	};
	$scope.getMps = function() {
		return moneyService.getMps();
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

		// Add in any money you should have received while the game was not playing
		var lastSave = localStorage.getItem("CompanyGame.lastSaveDate");
		if(lastSave) {
			var date = Date.parse(lastSave);
			var timePassed = (new Date() - date) / 1000;  // Divide by 1000 to get in seconds
			var missedMoney = timePassed * moneyService.getMps();

			// Get upgrades that deal with giving money when game isn't on
			var upgrades = gameService.upgrades.
				filter(function(d) {
					return d.isOnLoad;
				}).
				filter(function(d) {
					return playerService.getUpgrade(d.id).id >= 0;
				});

			for(var i = 0; i < upgrades.length; i++) {
				var missed = upgrades[i].per * missedMoney;
				playerService.money += missed;
				playerService.totalMoney += missed;
			}
		}
	};

	$scope.saveGame = function() {
		saveService.saveGame();
		// Re-call this method to autosave every 30 seconds
		$timeout($scope.saveGame, 30000);
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

			moneyEarned = ((moneyService.getMps() / playerService.fps) * extra);
		}
		else {
			moneyEarned = (moneyService.getMps() / playerService.fps);
		}
		
		playerService.money += moneyEarned;
		playerService.totalMoney += moneyEarned;

		before = new Date();
		$timeout($scope.update, 1000 / playerService.fps);
	};

	$scope.checkAchievements = function() {
		for(var a in gameService.achievements) {
			if(!playerService.hasAchievement(gameService.achievements[a].id)) {
				if(gameService.achievements[a].earn.call(null, gameService, playerService, moneyService))
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