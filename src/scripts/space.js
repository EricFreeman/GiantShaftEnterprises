function SpaceController($scope, $timeout, playerService, gameService) {
	////////////
	// Mining //
	////////////

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
		// money isn't a mineable resource so it won't be in the resources list
		var name = gameService.resources.filter(function(d) {return d.id == id;});
		if (name.length == 0) name = 'Money';
		else name = name[0].name;

		return name;
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
			if(as.resources.length === 0)
				break;
		}

		playerService.mine(mined);
	}

	$scope.abandon = function() {
		$scope.current = null;
	}

	///////////
	// FLEET //
	///////////

	$scope.getCount = function(id) {
		var ship = playerService.ships.filter(function(d) {return d.id == id;});
		return ship.length == 1 ? ship[0].count : 0;
	}

	$scope.buy = function(id, amount) {
		if($scope.canBuyShip(id, amount, false)) {
			$scope.canBuyShip(id, amount, true);

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

	$scope.canBuyShip = function(id, amount, buy) {
		var ship = gameService.ships.filter(function(d) {return d.id == id;})[0];
		return $scope.canBuy(ship, amount, buy);
	}

	// Returns if player can buy a specific item.  Passing in true for the 'buy' 
	// value will also remove the resources when checking if you have enough
	$scope.canBuy = function(item, amount, buy) {
		var buyable = true;

		for(var i = 0; i < item.cost.length; i++) {
			if(item.cost[i].name == 'Money'){
				buyable &= playerService.money >= item.cost[i].price * amount;
				if(buy) playerService.money -= item.cost[i].price * amount;
			}
			else {
				var resource = playerService.resources.filter(function(d) {return d.id == item.cost[i].id});
				if(resource.length > 0) resource = resource[0];
				else resource = {};

				buyable &= resource.count >= item.cost[i].price * amount;
				if(buy) resource.count -= item.cost[i].price * amount;
			}
		}

		return buyable;
	}

	/////////////
	// PLANETS //
	/////////////

	$scope.planets = [];
	$scope.selectedPlanet;
	$scope.scale = 100;

	$scope.initPlanets = function() {
		// Add every discovered planet to the array
		for(var i = 0; i < gameService.planets.length; i++) {
			if($scope.getPlanet(gameService.planets[i].id, true).id >= 0) {
				var p = gameService.planets[i];
				$scope.planets.push(p);
				$scope.updatePlanet(p);				
			}
		}
	}

	$scope.updatePlanet = function(p) {
		// Make sure DOM is updated
		$timeout(function() { 
			$('#' + p.id).css({'left': p.x * $scope.scale, 'top': p.y * $scope.scale});
		}, 50);
	}

	$scope.getPlanet = function(id, onlyDiscovered) {
		var toSearch = onlyDiscovered ? playerService.planets : gameService.planets,
			planet = toSearch.filter(function(d) { return d.id === id; });
		
		if (planet.length > 0) return planet[0];
		else return { id: -1, name: '' };
	}

	$scope.selectPlanet = function(planet) {
		// Buildings are persisted, thus stored on the playerService, so you need to combine both 
		// versions of the planet to get all the properties for it (names, ids, locations, etc aren't 
		// persisted in case I ever change them - I want the player's version to update, not overwrite)
		var savedPlanet = playerService.planets.filter(function(d) {return d.id == planet.id;})[0];
		planet['buildings'] = savedPlanet.buildings;
		$scope.selectedPlanet = planet;
	}

	$scope.getLevel = function(building) {
		if($scope.selectedPlanet == null) return;
		var b = $scope.selectedPlanet.buildings.filter(function(d) { return d.id == building.id });
		return b.length > 0 ? b[0].level : 0;
	}

	$scope.buyBuilding = function(building) {
		if($scope.canBuy(building, 1, false)) {
			$scope.canBuy(building, 1, true);

			var b = $scope.selectedPlanet.buildings.filter(function(d) { return d.id == building.id });
			if(b.length > 0) 
				b[0].level++;
			else
				$scope.selectedPlanet.buildings.push({ id: building.id, level: 1 });
		}
	}

	$scope.getShipName = function(id) {
		var ship = gameService.ships.filter(function(d) { return d.id == id });
		if(ship.length > 0) return ship[0].name;
		else return 'Error - Ship not found';
	}

	$scope.attack = function() {
		var battleOver = false,
			battleLog = [],
			shipReduce = $scope.shipReduce,
			getTurnStat = $scope.getTurnStat;

		while(!battleOver) {
			var maxPlayerAtk = shipReduce(playerService.ships, 'attack');
			var turnPlayerAtk = getTurnStat(maxPlayerAtk);

			var maxEnemyDef = shipReduce($scope.selectedPlanet.enemies, 'defense');
			var turnEnemyDef = getTurnStat(maxEnemyDef);

			var playerDamage = turnPlayerAtk - turnEnemyDef;

			$scope.removeEnemies($scope.selectedPlanet.enemies, playerDamage);

			if($scope.selectedPlanet.enemies.length > 0) {
				var maxEnemyAtk = shipReduce($scope.selectedPlanet.enemies, 'attack');
				var turnEnemyAtk = getTurnStat(maxPlayerAtk);

				var maxPlayerDef = shipReduce(playerService.ships, 'defense');
				var turnPlayerDef = getTurnStat(maxPlayerDef);

				var enemyDamage = turnEnemyAtk - turnPlayerDef;

				$scope.removeEnemies($scope.selectedPlanet.enemies, enemyDamage);
			}

			battleOver = playerService.ships.length == 0 || $scope.selectedPlanet.enemies.length == 0;
		}
	}

	// TODO: This sucks - please make it not suck
	$scope.removeEnemies = function(ships, attack) {
		var shipsToDestroy = Math.floor(attack / 10);

		for(var i = 0; i < shipsToDestroy; i++) {
			// random number between 0 and total of all ships in fleet
			var shipIndex = Math.floor(Math.random() * ships.reduce(function(prev, cur) { return prev += cur.count; }, 0));
			
			// get which ship in the array it is
			var arrayIndex = 0;
			for(var q = 0; q < ships.length; q++) {
				shipIndex -= ships[q].count;
				if(shipIndex <= 0) arrayIndex = q;
			}

			// remove 1 ship from the remaining pool
			ships[arrayIndex].count--;

			// if the remaining is 0, remove from ship array
			if(ships[arrayIndex].count <= 0)
				ships.splice(arrayIndex, 1);

			// break early if all enemies are dead
			if(ships.length == 0)
				break;
		}
	}

	$scope.getShip = function(id) {
		var ship = gameService.ships.filter(function(d) { return d.id == id });
		if(ship.length > 0) return ship[0];
		else return { id: -1 };
	}

	$scope.getTurnStat = function(stat) {
		return (Math.random() * stat / 2) + (stat / 2);
	}

	$scope.shipReduce = function(ships, field) {
		return ships.reduce(function(prev, cur) { return prev += $scope.getShip(cur.id)[field] * cur.count; }, 0)
	}
}