function GameLoopController($scope, $timeout, $rootScope, $location, $window, gameService, playerService, cacheService, saveService, importExportService, miningService) {	
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
	$scope.getResourcesPerSecond = function() {
		return cacheService.cachedResourcesPerSecond;
	}
	$scope.showKnowledge = function() {
		return playerService.totalKnowledge > 0;
	}
	$scope.showSpace = function() {
		// 42 = id for Space Program upgrade
		return playerService.getUpgrade(42).id >= 0;
	}

	$scope.loadedVersion = 1;
	$scope.currentVersion = 1;

	$scope.loadGame = function() {
		importExportService.loadGame(localStorage);
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
		var elapsedTime = (now.getTime() - before.getTime()),
			moneyEarned = 0,
			researchEarned = 0;

		if(elapsedTime > 1000 / playerService.fps) {
			var extra = Math.floor(elapsedTime/(1000/playerService.fps));

			moneyEarned = ((cacheService.getMps() / playerService.fps) * extra);
			researchEarned = ((cacheService.cachedResearchPerSecond / playerService.fps) * extra);
		}
		else {
			moneyEarned = (cacheService.getMps() / playerService.fps);
			researchEarned = ((cacheService.cachedResearchPerSecond / playerService.fps));
		}
		
		playerService.money += moneyEarned;
		playerService.totalMoney += moneyEarned;

		playerService.research += researchEarned;
		playerService.totalResearch += researchEarned;

		before = new Date();
		$timeout($scope.update, 1000 / playerService.fps);

		document.title = playerService.companyName;
	};

	// Mine minerals every second
	$scope.mine = function() {
		var resources = miningService.getResources(cacheService.cachedResourcesPerSecond);
		playerService.mine($scope.translateResource(resources));

		$timeout($scope.mine, 1000);
	}

	// Translates a resource list from asteroid generation to the form mining takes in
	$scope.translateResource = function(resources) {
		var rtn = [];

		for(var res = 0; res < resources.length; res++) {
			for(var am = 0; am < resources[res].remaining; am++) {
				rtn.push({id: resources[res].id});
			}
		}

		return rtn;
	}

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

	// Start mining minerals
	$scope.mine();

	// Check for update to game every five minutes
	$scope.checkForUpdate();

	// Start up the heartbeat
	$scope.heartbeat();

	// Start save loop of every 30 seconds
	$timeout($scope.saveGame, 30000);
}