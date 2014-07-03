function SpaceController($scope, playerService, gameService) {
	// The current asteroid you scanned for that you can potentially mine
	$scope.current = null;

	$scope.playerService = playerService;
	$scope.gameService = gameService;

	// Returns a random asteroid that fits the difficulty
	// 		miningCost 	- How much it costs every time you mine the asteroid
	//		chance		- % chance that mining will return any valuables
	//		maxPerMine	- maximum amount of minerals you can earn when the mining is successful
	//		resources	- array of what resources and how many of each are on the specific asteroid
	$scope.scanForAsteroid = function(difficulty)
	{
		$scope.current = { 
			miningCost: $scope.getMiningCost(difficulty), 
			chance: $scope.getChance(difficulty), 
			maxPerMine: $scope.getMaxPerMine(difficulty),
			resources: $scope.getResources(difficulty),
		};
	}

	$scope.getMiningCost = function(difficulty) {
		return (100000 * (difficulty + 1)) + (Math.random() * Math.pow(2, difficulty) * 1000);
	}

	$scope.getChance = function(difficulty) {
		return Math.random() * (100 - difficulty * 5) / 2;
	}

	$scope.getMaxPerMine = function(difficulty) {
		return Math.floor(Math.pow(2, difficulty) + Math.random() * (2 + Math.pow(difficulty, 2)));
	}

	$scope.getResources = function(difficulty) {
		var maxResources = Math.pow(2, difficulty + 2) + 10 * ((difficulty + 2) * Math.random() * 10),
			resources = gameService.resources,
			res = 0,
			maxProp = resources.reduce(function(prev, cur){return prev + cur.proportion},0),
			rtn = [];

		for(var i = 0; i < maxResources; i++) {
			var choice = Math.random() * maxProp;
			var selection = resources.reduce(function(prev, cur) {
				// if it's numeric, keep iterating until proportion is over random number
				// once it's over, just return that item.  now the reduce function will return the random resource
				if($scope.isNumber(prev)) {
					prev += cur.proportion;
					if (prev >= choice) {
						return cur;
					}
					return prev;
				}
				return prev;
			}, 0);

			// find the item in existing return data
			var item = rtn.filter(function(d) {return d.id == selection.id});
			if(item.length > 0) item = item[0];
			else item = {};

			// Add an entry for it if not on asteroid yet
			if(item.id === undefined) {
				rtn.push({id: selection.id, remaining: 1, name: selection.name});
			}
			//otherwise increment existing item
			else {
				var index = rtn.indexOf(item);
				rtn[index].remaining++;
			}
		}

		return rtn;
	}

	$scope.isNumber = function(n) {
		return !isNaN(parseFloat(n)) && isFinite(n);
	}

	$scope.getName = function(id) {
		return gameService.resources.filter(function(d) {return d.id == id;})[0].name;
	}

	// Return array of the minerals from the mine (or nothing if mining failed)
	$scope.mine = function() {
		var as = $scope.current,
				 successfulMine = Math.random() * 100 < as.chance,
				 mined = [], mineralsToMine;

		playerService.money -= $scope.current.miningCost;
		if(!successfulMine) return;

		mineralsToMine = Math.floor((Math.random() * as.maxPerMine) + 1);
		for(var i = 0; i < mineralsToMine; i++) {
			var mineral = Math.floor(Math.random() * as.resources.length);
			mined.push({ id: as.resources[mineral].id });
			
			as.resources[mineral].remaining--;
			if(as.resources[mineral].remaining <= 0)
				as.resources.splice(mineral, 1);
		}

		playerService.mine(mined);
	}

	$scope.abandon = function() {
		$scope.current = null;
	}

	$scope.getCount = function(id) {
		var ship = playerService.ships.filter(function(d) {return d.id == id;});
		return ship.length == 1 ? ship[0].count : 0;
	}

	$scope.buy = function(id, amount) {
		if($scope.canBuy(id, amount, false)) {
			$scope.canBuy(id, amount, true);

			var ship = playerService.ships.filter(function(d) {return d.id == id;});
			if(ship.length > 0) {
				//over 0 means the ship was already bought at least once, meaning we just need to increment the counter
				ship = ship[0];
				ship.count += amount;
			}
			else {
				playerService.ships.push({id: id, count: amount});
			}
		}
	}

	// Returns if player can buy a specific ship.  Passing in true for the 'buy' 
	// value will also remove the resources when checking if you have enough
	$scope.canBuy = function(id, amount, buy) {
		var ship = gameService.ships.filter(function(d) {return d.id == id;})[0];

		var buyable = true;

		for(var i = 0; i < ship.cost.length; i++) {
			if(ship.cost[i].name == 'Money'){
				buyable &= playerService.money >= ship.cost[i].price * amount;
				if(buy) playerService.money -= ship.cost[i].price * amount;
			}
			else {
				var resource = playerService.resources.filter(function(d) {return d.name == ship.cost[i].name});
				if(resource.length > 0) resource = resource[0];
				else resource = {};

				buyable &= resource.count >= ship.cost[i].price * amount;
				if(buy) resource.count -= ship.cost[i].price * amount;
			}
		}

		return buyable;
	}
}