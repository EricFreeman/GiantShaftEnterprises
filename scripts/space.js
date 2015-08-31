function SpaceController($rootScope, $scope, $timeout, playerService, gameService, cacheService, miningService, spaceStory) {
	////////////
	// Mining //
	////////////

	// The current asteroid you scanned for that you can potentially mine
	$scope.current = null;

	$scope.playerService = playerService;
	$scope.gameService = gameService;
	$scope.cacheService = cacheService;

	// Returns a random asteroid that fits the difficulty
	// 		miningCost 	- How much it costs every time you mine the asteroid
	//		chance		- % chance that mining will return any valuables
	//		maxPerMine	- maximum amount of minerals you can earn when the mining is successful
	//		resources	- array of what resources and how many of each are on the specific asteroid
	$scope.scanForAsteroid = function()
	{
		var difficulty = 1 + cacheService.cachedAsteroidBoost;
		
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
		var maxResources = Math.pow(2, difficulty + 2) + 10 * ((difficulty + 2) * Math.random() * 10);
		return miningService.getResources(maxResources);
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

	$scope.miningRate = function() {
		return cacheService.cachedResearchPerSecond;
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
	$scope.cachedAppeasementCost = 0;

	$scope.initPlanets = function() {
		// Add every planet to the array
		for(var i = 0; i < gameService.planets.length; i++) {
			var p = gameService.planets[i];
			$scope.planets.push(p);
			$scope.updatePlanet(p);

			if(!playerService.planets.filter(function(d) {return d.id == p.id;}).length > 0)
				playerService.planets.push({id: p.id, buildings: [], isConquered: false, isAppeased: false})
		}
	}

	$scope.updatePlanet = function(p) {
		// Make sure DOM is updated
		$timeout(function() { 
			$('#' + p.id).css({'left': p.x * $scope.scale + 250, 'top': p.y * $scope.scale - 32 + 250});
		}, 50);
	}

	$scope.getPlanet = function(id, onlyDiscovered) {
		var toSearch = onlyDiscovered ? playerService.planets : gameService.planets,
			planet = toSearch.filter(function(d) { return d.id === id; });
		
		if (planet.length > 0) return planet[0];
		else return { id: -1, name: '' };
	}

	$scope.getPlanetImage = function(planet) {
		var defaultImage = 'planet1.png';
		return !!planet.image ? planet.image : defaultImage;
	}

	$scope.selectPlanet = function(planet) {
		// Buildings are persisted, thus stored on the playerService, so you need to combine both 
		// versions of the planet to get all the properties for it (names, ids, locations, etc aren't 
		// persisted in case I ever change them - I want the player's version to update, not overwrite)
		var savedPlanet = $scope.getPlanet(planet.id, true);
		planet['buildings'] = savedPlanet != null ? savedPlanet.buildings : [];
		planet['isConquered'] = savedPlanet.isConquered;
		planet['isAppeased'] = savedPlanet.isAppeased;
		$scope.selectedPlanet = planet;
		$scope.cachedAppeasementCost = $scope.getAppeasementCost();

		if(!planet.isConquered && !planet.isAppeased)
			spaceStory.broadcastMessage();
	}

	$scope.getLevel = function(building) {
		if($scope.selectedPlanet == null) return;
		var b = $scope.selectedPlanet.buildings.filter(function(d) { return d.id == building.id });
		return b.length > 0 ? b[0].level : 0;
	}

	$scope.buyBuilding = function(building) {
		if($scope.canBuy(building, 1, false) && $scope.getLevel(building) < building.maxLevel) {
			$scope.canBuy(building, 1, true);

			var b = $scope.selectedPlanet.buildings.filter(function(d) { return d.id == building.id });
			if(b.length > 0) 
				b[0].level++;
			else
				$scope.selectedPlanet.buildings.push({ id: building.id, level: 1 });

			$rootScope.$broadcast('updateCache');
		}
	}

	$scope.isMaxLevel = function(building) {
		if($scope.selectedPlanet == null) return false;

		var pb = $scope.selectedPlanet.buildings.filter(function(d) { return d.id == building.id });
		if(pb.length > 0) pb = pb[0];
		else return false;

		// Max level of appeased planets is only 1
		var planet = $scope.getPlanet($scope.selectedPlanet.id, true);
		if(planet.isAppeased && !planet.isConquered) return 1;
		else return pb.level >= building.maxLevel;
	}

	$scope.getShipName = function(id) {
		var ship = gameService.ships.filter(function(d) { return d.id == id });
		if(ship.length > 0) return ship[0].name;
		else return 'Error - Ship not found';
	}

	$scope.canAppease = function() {
		var gold = $scope.getGold();
		return gold.count >= $scope.cachedAppeasementCost && !$scope.isAppeased() && !$scope.isConquered();
	}

	$scope.getGold = function() {
		var goldId = 4; // TODO: Get a better way to find this later or something
		var gold = search(playerService.resources, 'id', goldId, { id: -1, count: 0 });
		if(gold.id === -1) return false;
		else return gold;
	}

	$scope.isAppeased = function() {
		if($scope.selectedPlanet == null) return false;

		var planet = $scope.getPlanet($scope.selectedPlanet.id, true);
		return !!planet.isAppeased;
	}

	$scope.isConquered = function() {
		if($scope.selectedPlanet == null) return false;

		var planet = $scope.getPlanet($scope.selectedPlanet.id, true);
		return !!planet.isConquered;
	}

	$scope.appease = function() {
		var gold = $scope.getGold();
		gold.count -= $scope.cachedAppeasementCost;
		$scope.getPlanet($scope.selectedPlanet.id, true).isAppeased = true;
	}

	// TODO: Figure out a better way to formulate how much appeasing should cost
	$scope.getAppeasementCost = function() {
		if($scope.selectedPlanet == null) return;

		var planetsConquered = playerService.planets.filter(function(d) { return d.isConquered; }).length;
		var shipsOnPlanet = $scope.selectedPlanet.enemies.reduce(function(prev, cur) { return prev += cur.count; }, 0);

		return (planetsConquered + 1) * shipsOnPlanet;
	}

	$scope.battleLog = [];

	$scope.attack = function() {
		var battleOver = false;
		$scope.battleLog = [];

		while(!battleOver) {
			var beforeCount = $scope.battleCount();

			// take player's turn
			$scope.takeTurn(playerService.ships, $scope.selectedPlanet.enemies, playerService.companyName, $scope.selectedPlanet.name, true);

			// if there's still enemies, take their turn
			if($scope.selectedPlanet.enemies.length > 0) {
				$scope.takeTurn($scope.selectedPlanet.enemies, playerService.ships, $scope.selectedPlanet.name, playerService.companyName, false);

				// if it's a stalemate, then hit random one
				if(beforeCount == $scope.battleCount()) {
					var hit = Math.floor(Math.random * 2);
					$scope.removeEnemies(hit == 0 ? $scope.selectedPlanet.enemies : playerService.ships, 1);
					$scope.battleLog.push({ name: hit == 0 ? playerService.companyName : $scope.selectedPlanet.name, 
											against: hit == 0 ? $scope.selectedPlanet.name : playerService.companyName,
											damage: 1, 
											remaining: $scope.fleetRemaining(hit == 1 ? $scope.selectedPlanet.enemies : playerService.ships),
											isPlayer: hit == 0 });
				}
			}

			battleOver = playerService.ships.length == 0 || $scope.selectedPlanet.enemies.length == 0;
		}

		// you conquered the planet if all the enemies are gone
		$scope.getPlanet($scope.selectedPlanet.id, true).isConquered = $scope.selectedPlanet.enemies.length == 0;
	
		// update cache because if you reconquered a planet with buildings then you need to recalculate the planet's MPS
		$rootScope.$broadcast('updateCache');
	}

	$scope.takeTurn = function(attackerShips, defnderShips, attackerName, defenderName, isPlayer) {
		var maxTurnAtk = $scope.shipReduce(attackerShips, 'attack');
		var turnAtk = $scope.getTurnStat(maxTurnAtk);

		var maxTurnDef = $scope.shipReduce(defnderShips, 'defense');
		var turnDef = $scope.getTurnStat(maxTurnDef);

		if(isPlayer) maxTurnAtk += maxTurnAtk * cacheService.cachedPerks.attack;
		else maxTurnDef += maxTurnDef * cacheService.cachedPerks.defense;

		var turnDamage = $scope.getAttack(turnAtk, turnDef);

		$scope.removeEnemies(defnderShips, turnDamage);
		$scope.battleLog.push({ name: attackerName, 
								against: defenderName,
								damage: turnDamage, 
								remaining: $scope.fleetRemaining(defnderShips),
								isPlayer: isPlayer });
	}

	$scope.getAttack = function(atk, def) {
		var damage = atk - def;
		return damage > 0 ? Math.floor(damage/10) : 0;
	}

	$scope.battleCount = function() {
		return $scope.countShips(playerService.ships) + $scope.countShips($scope.selectedPlanet.enemies)
	}

	$scope.countShips = function(ships) {
		return ships.reduce(function(prev, cur) {return prev += cur.count }, 0);
	}

	$scope.writeLog = function(name, damage, remaining) {
		if(remaining.length == 0) return name + ' destroyed remaining forces.';
		var rtn = name + ' destroyed ' + (damage > 0 ? Math.floor(damage/10) : 0) + ' ships.  Fleet remaining: ' + 
			remaining.reduce(function(prev, cur) { return prev += $scope.getShip(cur.id).name + ': ' + cur.count + ', ' }, '');

		return rtn.substring(0, rtn.length - 2);
	}

	$scope.fleetRemaining = function(fleet) {
		var rtn = fleet.reduce(function(prev, cur) { return prev += $scope.getShip(cur.id).name + ': ' + cur.count + ', ' }, '');
		return rtn.substring(0, rtn.length - 2);
	}

	$scope.removeEnemies = function(ships, attack) {
		for(var i = 0; i < attack; i++) {
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

	$scope.canBuildBuildings = function() {
		if($scope.selectedPlanet == null) return;
		var noEnemies = !$scope.selectedPlanet.enemies || $scope.selectedPlanet.enemies.length == 0;
		var planet = playerService.planets.filter(function(d) { return d.id == $scope.selectedPlanet.id; })[0];
		
		return noEnemies || !!planet.isConquered || !!planet.isAppeased;
	}

	//////////////
	// RESEARCH //
	//////////////

	$scope.perks = gameService.perks.sort(function(a, b) {
		if(a.price > b.price) return 1;
		if(a.price < b.price) return -1;
		return 0;
	});

	$scope.getResearch = function() {
		return Math.floor(playerService.research);
	}

	$scope.getResearchPerSec = function() {
		return cacheService.cachedResearchPerSecond;
	}

	$scope.availablePerks = function() {
		if(!playerService.hideBoughtUpgrades) return $scope.perks;

		return $scope.perks.filter(function(d) { return !$scope.alreadyBought(d.id); });
	}

	$scope.canBuyPerk = function(perk) {
		return playerService.research >= perk.price &&
				!$scope.alreadyBought(perk.id);
	}

	$scope.alreadyBought = function(id) {
		return playerService.perks.map(function(d) { return d.id }).indexOf(id) >= 0;
	}

	$scope.buyPerk = function(perk) {
		if($scope.canBuyPerk(perk) && !$scope.alreadyBought(perk.id)) {
			playerService.research -= perk.price;
			playerService.perks.push({id: perk.id});

			$rootScope.$broadcast('updateCache');
		}
	}

	$scope.translateProperty = function(property) {
		switch(property) {
			case 'resources':
				return 'resource mining rate';
			case 'asteroid':
				return 'asteroid quality';
			default:
				return property;
		}
	}
}

var idleGame = angular.module('idleGame');

idleGame.service('miningService', function(gameService) {
	// return a list of resources of the amount specified.
	// used for creating an asteroid of a certain size and 
	// for mining a certain amount of minterals
	this.getResources = function(amount) {
		var resources = gameService.resources,
			maxProp = resources.reduce(function(prev, cur){return prev + cur.proportion}, 0),
			rtn = [];

		for(var i = 0; i < amount; i++) {
			var choice = Math.random() * maxProp, self = this;
			var selection = resources.reduce(function(prev, cur) {
				// if it's numeric, keep iterating until proportion is over random number
				// once it's over, just return that item.  now the reduce function will return the random resource
				if(self.isNumber(prev)) {
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

	this.isNumber = function(n) {
		return !isNaN(parseFloat(n)) && isFinite(n);
	}
});