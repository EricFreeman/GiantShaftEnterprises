function GameLoopController($scope, $timeout, $rootScope, $location, $window, gameService, playerService, cacheService, saveService) {	
	// Getters to grab values through services
	$scope.getCompanyName = function() {
		return playerService.companyName;
	};
	$scope.getMoney = function() {
		return playerService.money;
	};
	$scope.getMps = function() {
		return cacheService.getMps();
	}
	$scope.getClickPower = function() {
		return cacheService.clickPower();
	}
	$scope.showKnowledge = function() {
		return playerService.totalKnowledge > 0;
	}

	$scope.loadedVersion = 1;
	$scope.currentVersion = 1;

	$scope.loadGame = function() {
		// Grab current items.  Will be useful if more items were added after you started game
		var curr = playerService.items;

		// Go through each property of playerService, and if it exists, load it
		for(var prop in playerService) {
			var propName = "CompanyGame." + prop;
			if(localStorage[propName] != undefined)
				playerService[prop] = JSON.parse(localStorage.getItem(propName));
		}

		// Load in any business knowledge items bought for this game
		$rootScope.$broadcast('loadKnowledge');

		// Update the chached values for click power and money/second
		$rootScope.$broadcast('updateCache');

		// Add in any money you should have received while the game was not playing
		var lastSave = localStorage.getItem("CompanyGame.lastSaveDate");
		if(lastSave) {
			var date = Date.parse(lastSave);
			var timePassed = (new Date() - date) / 1000;  // Divide by 1000 to get in seconds
			var missedMoney = timePassed * cacheService.getMps();

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

			moneyEarned = ((cacheService.getMps() / playerService.fps) * extra);
		}
		else {
			moneyEarned = (cacheService.getMps() / playerService.fps);
		}
		
		playerService.money += moneyEarned;
		playerService.totalMoney += moneyEarned;		

		before = new Date();
		$timeout($scope.update, 1000 / playerService.fps);

		document.title = playerService.companyName;
	};

	$scope.firstTime = true;
	$scope.checkForUpdate = function() {
		$.ajax({
            url: "version.txt",
            async: false,
            success: function (data){
                console.log(data);
                $scope.currentVersion = parseFloat(data);

                if($scope.firstTime) {
                	$scope.loadedVersion = $scope.currentVersion;
                	$scope.firstTime = false;
                }

                if($scope.currentVersion == $scope.loadedVersion)
                	$timeout($scope.checkForUpdate, 300000);
            }
        });
	}

	$scope.checkAchievements = function() {
		for(var a in gameService.achievements) {
			if(!playerService.hasAchievement(gameService.achievements[a].id)) {
				if(gameService.achievements[a].earn.call(null, gameService, playerService, cacheService)) {
					playerService.awardAchievement(gameService.achievements[a].id);
					$rootScope.$broadcast('displayMessage', 'Earned Achievement: ' + gameService.achievements[a].name);
					$rootScope.$broadcast('updateCache');
				}
			}
		}

		$timeout($scope.checkAchievements, 3000);
	};

	// Google Analytics page tracking
	$scope.$on('$viewContentLoaded', function(event) {
		$window.ga('send', 'pageview', { page: $location.path() });
	});

	// Keep the session alive on GA since it times out quickly
	$scope.heartbeat = function() {
		$window.ga('send', 'heartbeat', { page: $location.path() });
		$timeout($scope.heartBeat, 300000);
	}

	
	// Check if player won any achievements
	$scope.checkAchievements();
	
	// Load the game if it was previously saved
	$scope.loadGame();

	// Start game loop
	$scope.update();

	// Check for update to game every five minutes
	$scope.checkForUpdate();

	// Start up the heartbeat
	$scope.heartbeat();

	// Start save loop of every 30 seconds
	$timeout($scope.saveGame, 30000);
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}