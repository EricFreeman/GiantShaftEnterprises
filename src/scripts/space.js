function SpaceController($scope, playerService) {
	// The current asteroid you scanned for that you can potentially mine
	$scope.current = null;

	// Returns a random asteroid that fits the difficulty
	// 		miningCost 	- How much it costs every time you mine the asteroid
	//		chance		- % chance that mining will return any valuables
	//		maxPerMine	- maximum amount of minerals you can earn when the mining is successful
	//		resources	- array of what resources and how many of each are on the specific asteroid
	$scope.scanForAsteroid = function(difficulty)
	{
		// TODO: Change this from temporary spiked out test data to the real deal!
		if(difficulty == 0)
			$scope.current = { miningCost: 100000, chance: 10, maxPerMine: 2, resources: [ {name: 'titanium', remaining: 100}, {name: 'diamond', remaining: 25} ]};
		else
			$scope.current = null;
	}

	// Return array of the minerals from the mine (or nothing if mining failed)
	$scope.mine = function() {
		var as = $scope.current,
				 successfulMine = Math.random() * 100 < as.chance,
				 mined = [], mineralsToMine;

		if(!successfulMine) return;

		mineralsToMine = Math.floor((Math.random() * as.maxPerMine) + 1);
		for(var i = 0; i < mineralsToMine; i++) {
			var mineral = Math.floor(Math.random() * as.resources.length);

			as.resources[mineral].remaining--;
			if(as.resources[mineral].remaining <= 0)
				as.resources.splice(mineral, 1);

			// mined.push({ as.resources[mineral]: 1 });
		}

		return mined;
	}

	$scope.abandon = function() {
		$scope.current = null;
	}
}