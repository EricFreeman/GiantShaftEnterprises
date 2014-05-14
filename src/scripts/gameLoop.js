function GameLoopController($scope, $timeout, gameService) {	
	// Getters to grab values through gameService
	$scope.getCompanyName = function() {
		return gameService.companyName;
	};
	$scope.getMoney = function() {
		return gameService.money;
	};
	$scope.getMps = function() {
		return gameService.mps();
	};

	$scope.loadGame = function() {
		// Grab current items.  Will be useful if more items were added after you started game
		var curr = gameService.items;

		// Go through each property of gameService, and if it exists, load it
		for(var prop in gameService) {
			var propName = "CompanyGame." + prop;
			if(localStorage[propName] != undefined)
				gameService[prop] = JSON.parse(localStorage.getItem(propName));
		}

		// If any items are not in the current save file, add them in now
		for(var prop in curr) {
			var found = false;
			for(var oProp in gameService.items) {
				delete gameService.items[oProp].$$hashKey;
				if(curr[prop].id == gameService.items[oProp].id)
					found = true;
			}

			if(!found)
				gameService.items.push(curr[prop]);
		}
	};

	$scope.saveGame = function() {
		// Save everything in the game service that isn't a function as JSON to local storage
		for(var prop in gameService) {
			if(typeof(gameService[prop]) != "function")
				localStorage.setItem("CompanyGame." + prop, JSON.stringify(gameService[prop]));
		}

		$timeout($scope.saveGame, 30000); // Recall this method to autosave every 30 seconds
	}
	
	// Game Loop
	$scope.update = function() {
		// Make sure the FPS is valid, otherwise default it
		if(!isNumeric(gameService.fps)) gameService.fps = 10;

		gameService.money += (gameService.mps() / gameService.fps);
		$timeout($scope.update, 1000 / gameService.fps);
	};
	
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