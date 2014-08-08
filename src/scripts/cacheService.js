var idleGame = angular.module('idleGame');

idleGame.service('saveService', function(playerService, $rootScope) {
	this.saveGame = function() {
		// Save everything in the game service that isn't a function as JSON to local storage
		for(var prop in playerService) {
			if(typeof(playerService[prop]) != "function")
				localStorage.setItem("CompanyGame." + prop, JSON.stringify(playerService[prop]));
		}

		localStorage.setItem("CompanyGame.lastSaveDate", new Date());
		$rootScope.$broadcast('displayMessage', 'Game Saved!');
	}
});

idleGame.service('importExportService', function($rootScope, cacheService, playerService, gameService) {
	this.loadGame = function(file) {
		// Grab current items.  Will be useful if more items were added after you started game
		var curr = playerService.items;

		// Go through each property of playerService, and if it exists, load it
		for(var prop in playerService) {
			var propName = "CompanyGame." + prop;
			if(file[propName] != undefined)
				playerService[prop] = JSON.parse(file[propName]);
		}

		// Load in any business knowledge items bought for this game
		$rootScope.$broadcast('loadKnowledge');

		// Update the chached values for click power and money/second
		$rootScope.$broadcast('updateCache');

		// Add in any money you should have received while the game was not playing
		var lastSave = file["CompanyGame.lastSaveDate"];
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
	}
});

idleGame.service('cacheService', function($rootScope, gameService, playerService) {
	this.cachedMps = 0;
	this.cachedClickPower = 0;
	this.lowestAmountCache = 0;
	this.cachedBcBoost = 0;
	this.cachedMaxBcBoost = 0;
	this.items = [];
	this.cachedPlanetMps = [];
	this.cachedResourcesPerSecond = 0;
	this.cachedResearchPerSecond = 0;
	this.cachedPerks = {};
	this.cachedAsteroidBoost = 0;

	this.getMps = function() {
		return this.cachedMps;
	}

	this.clickPower = function() {
		return this.cachedClickPower;
	}

	this.planetBoost = function(id) {
		var planet = this.cachedPlanetMps.filter(function(d) { return d.id == id; });
		if(planet.length > 0) return planet[0].resources;
		else return {mps: 0, resources: 0, research: 0};
	}

	var self = this;
	$rootScope.$on('updateCache', function() {
		self.cachedPerks = self.getPerks();
		self.cachedPlanetMps = self.getPlanetMps();
		self.cachedResourcesPerSecond = Math.floor(self.cachedPlanetMps.reduce(function(prev, cur) { return prev += cur.resources.resources }, 0));
		self.cachedResearchPerSecond = self.cachedPlanetMps.reduce(function(prev, cur) { return prev += cur.resources.research }, 0);
		self.cachedAsteroidBoost = gameService.perks
									.filter(function(d) { return d.property == 'asteroid'; })
									.reduce(function(prev, cur) { 
										var perk = search(playerService.perks, 'id', cur.id, { id: -1 });
										if(perk.id > -1) return prev += cur.effect;
										
										return prev;
									}, 0);
		self.cachedBcBoost = self.getNewBcBoost();
		self.cachedMps = self.getNewMps();
		self.cachedClickPower = self.getNewClickPower();
		self.items = self.getNewItems();
		self.cachedMaxBcBoost = self.getPossibleBcBoost();
	});

	$rootScope.$on('loadKnowledge', function() {
		var items = playerService.unlockedKnowledgeItems;
		for(var i = 0; i < items.length; i++) {
			var item = gameService.getKnowledgeItem(items[i].id);
			if(item.type === 'item')
				gameService.items.push(item.item);
			else if(item.type === 'upgrade')
				gameService.upgrades.push(item.item);
		}

		gameService.items.sort(function(a, b) { return a.price-b.price; });
		gameService.upgrades.sort(function(a, b) { return a.price-b.price; });
	});

	// The perks you have from research stations on planets
	this.getPerks = function() {
		var perkTypes = ['mps', 'resources', 'attack', 'defense'],
			rtn = {};

		for(var i = 0; i < perkTypes.length; i++) {
			var perks = gameService.perks.filter(function(d) { 
				return d.property == perkTypes[i] && 
					   playerService.perks.map(function(p) { return p.id }).indexOf(d.id) >= 0; 
			});
			rtn[perkTypes[i]] = perks.reduce(function(prev, cur) { return prev += cur.effect; }, 0);
		}

		return rtn;
	}

	// Your cumulative mps (money per second) is the combination of the 
	// count of each item multiplied by the item's individual mps
	// plus all the upgrades for said item
	this.getNewMps = function() {
		var self = this;
		var baseMps = playerService.items.reduce(function (prev, cur) {
			return prev += (gameService.getItem(cur.id).mps * cur.count) + (self.getNewUpgradesMps(cur.id) * cur.count);
		}, 0);

		// Get upgrades that deal with giving money for each achievement
		var upgrades = gameService.upgrades.
			filter(function(d) {
				return d.isAchievement;
			}).
			filter(function(d) {
				return playerService.getUpgrade(d.id).id >= 0;
			});

		var additionalMps = 0;

		// Add in amount gained from upgrades that give you a base % boost
		for(var i = 0; i < upgrades.length; i++) {
			additionalMps += upgrades[i].per * playerService.achievements.length * baseMps;
		}

		// Add in space colonies
		additionalMps += this.cachedPlanetMps.reduce(function(prev, cur) { return prev += cur.resources.mps; }, 0);

		// Add in perks from space research
		additionalMps += baseMps * this.cachedPerks.mps;

		// Add in amount gained from business connections
		additionalMps += baseMps * this.cachedBcBoost;

		return baseMps + additionalMps;
	};

	// Get the mps that should be added in from the upgrades for the specified item
	this.getNewUpgradesMps = function(id) {
		return playerService.upgrades.reduce(function(prev, cur) {
			var upgrade = gameService.getUpgrade(cur.id);
			return prev += upgrade.itemId == id ? upgrade.mps : 0;
		}, 0);
	};

	// Get the money gained from completing a business opportunity
	this.getNewClickPower = function() {
		var basicClickPower = 1;
		var mps = this.getNewMps();

		return basicClickPower + 
			gameService.upgrades.
				filter(function(d) {
					return d.isOpportunity && playerService.getUpgrade(d.id).id != -1;
				}).
				reduce(function(prev, cur) {
					return prev += (cur.mpo ? cur.mpo : cur.mpop * mps);
				}, 0);
	}

	// Get the list of items and count of each that the player has
	this.getNewItems = function() {
		var rtn = [];
		this.lowestAmountCache = -1;

		for(var i = 0; i < gameService.items.length; i++) {
			var id = gameService.items[i].id;
			var count = playerService.getItem(id).count;
			rtn.push({ id: id, count: count });

			if(this.lowestAmountCache < 0 || count < this.lowestAmountCache) this.lowestAmountCache = count;
		}

		return rtn;
	}

	// Using the current setup, 784 BC will give you the maximum boost of 100% of your base MPS
	this.getNewBcBoost = function() {
		var baseBoost = .0025,			// % boost from each BC
			depreciation = .000003121,	// Amount the boost goes down by per BC
			bcBoost = 0,
			maxBoost = this.getMaxBcBoost(),
			minDepreciatedBoost = .0001;

		for(var i = 1; i <= playerService.businessConnections; i++) {
			var tempBoost = baseBoost - (depreciation * i);
			if(tempBoost < minDepreciatedBoost) tempBoost = minDepreciatedBoost;
			bcBoost += tempBoost;
			
			if(bcBoost >= maxBoost) {
				bcBoost = maxBoost;
				break;
			}
		}

		return bcBoost;
	}

	// Get the maximum boost from business connections
	this.getMaxBcBoost = function() {
		var baseMaxBoost = 1;

		var extraBoost = playerService.upgrades.reduce(function(prev, cur) {
							var upgrade = gameService.getUpgrade(cur.id);
							return prev += upgrade.isBcBoost ? upgrade.bcBoost : 0;
						}, 0);
		
		return  baseMaxBoost + extraBoost;
	}

	this.getPossibleBcBoost = function() {
		var baseMax = 1;

		var extraBoost = gameService.upgrades.reduce(function(prev, cur) {
							return prev += cur.isBcBoost ? cur.bcBoost : 0;
						}, 0);

		return baseMax + extraBoost;
	}

	this.hasDiversity = function(amount) {
		return amount <= this.lowestAmountCache;
	}

	// fill up the array for each planet of how much resources they provide
	this.getPlanetMps = function() {
		var rtn = [];

		for(var i = 0; i < playerService.planets.length; i++) {
			rtn.push({ id: i, resources: this.calculatePlanetMps(playerService.planets[i]) });
		}

		return rtn;
	}

	this.calculatePlanetMps = function(planet) {
		var enemies = search(gameService.planets, "id", planet.id, {enemies: []}).enemies;
		if((!planet.isConquered && (!!enemies && enemies.length > 0)) && !planet.isAppeased)
			return { mps: 0, resources: 0, research: 0 };

		var mps = 0, resources = 0, research = 0;

		for(var i = 0; i < planet.buildings.length; i++) {
			var cur = planet.buildings[i];
			var building = gameService.buildings.filter(function(d) {return d.id == cur.id});
			if(building.length > 0) building = building[0];
			else continue;

			if(building.returns === 'money')
				mps += building.amount(planet, cur);
			else if(building.returns === 'resources')
				resources += building.amount(planet, cur);
			else if(building.returns === 'research')
				research += building.amount(planet, cur);
		}

		// Add in extra stuff from perks
		mps += mps * this.cachedPerks.mps;
		resources += resources * this.cachedPerks.resources;

		return { mps: mps, resources: resources, research: research };
	}
});

// A simple search that will go through the passed in list and find
// the first item that the specified property matches a given value.
// Otherwise it will return a default value
var search = function(list, property, value, def) {
	for(var item in list)
		if(list[item][property] === value)
			return list[item];

	return def;
}

var isNumeric = function(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}