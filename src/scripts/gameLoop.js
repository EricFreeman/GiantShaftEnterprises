function GameLoopController($scope, $timeout, gameService, playerService) {	
	// Getters to grab values through gameService
	$scope.getCompanyName = function() {
		return playerService.companyName;
	};
	$scope.getMoney = function() {
		return playerService.money;
	};

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
	
	// Game Loop
	$scope.update = function() {
		// Make sure the FPS is valid, otherwise default it
		if(!isNumeric(gameService.fps)) gameService.fps = 10;

		playerService.money += ($scope.getMps() / gameService.fps);
		$timeout($scope.update, 1000 / gameService.fps);
	};

	// Your cumulative mps (money per second) is the combination of the 
	// count of each item multiplied by the item's individual mps
	// plus all the upgrades for said item
	$scope.getMps = function() {
		return playerService.items.reduce(function (prev, cur) {
			return prev += (gameService.getItem(cur.id).mps * cur.count) + ($scope.getUpgradesMps(cur.id) * cur.count);
		}, 0);
	};

	// Get the mps that should be added in from the upgrades for the specified item
	$scope.getUpgradesMps = function(id) {
		return playerService.upgrades.reduce(function(prev, cur) {
			var upgrade = gameService.getUpgrade(cur.id);
			return prev += upgrade.itemId == id ? upgrade.mps : 0;
		}, 0);
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