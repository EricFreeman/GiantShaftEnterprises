var idleGame = angular.module('idleGame');

idleGame.service('playerService', function () {
	// Owned items are defined here as: { id: x, count: y }
	this.items = [];
	// Owned upgrades are stored here as: { id: x }
	this.upgrades = [];
	// Resources mined are stored here as { id: x, count: y }
	this.resources = [];
	// Earned achievments are stored here as: { id: x }
	this.achievements = [];
	// Owned space ships are stored here as { id: x, count: y }
	this.ships = [];
	// Discovered planets are stored here as { id: x, buildings: [], isConquered: t/f, isAppeased: t/f }
	this.planets = [];
	// Unlocked perks from research stations on planets are stored as { id: x }
	this.perks = [];

	this.money = 0;
	this.companyName = "Giant Shaft Enterprises";

	this.vcFunding = 0;
	this.businessConnections = 0;

	this.research = 0;
	this.totalResearch = 0;

	// For stats page
	this.totalMoneyReset = 0;
	this.totalMoney = 0;
	this.totalOpportunities = 0;
	this.totalMoneyFromOpportunties = 0;

	// For newgame plus
	this.totalKnowledge = 0;
	this.knowledge = 0;
	this.unlockedKnowledgeItems = [];

	this.totalCompaniesStarted = 1;
	this.totalOpportunitiesReset = 0;

	// Settings
	this.hideBoughtUpgrades = true;
	this.hideNumberPops = false;
	this.showTutorial = true;
	this.tutorialStep = 0;
	this.fps = 10;
	this.customIncrement = 1;
	this.hideResources = false;
	this.hideFleet = false;
	this.hideResearch = false;

	this.vcPointsToMoney = function(pts) {
		// 1 pt = $1000, but maybe make this value upgradeable in the future?
		return pts * 1000;
	}

	this.getItem = function(id) {
		return search(this.items, "id", id,
			{ id: -1, count: 0 });
	}

	this.getUpgrade = function(id) {
		return search(this.upgrades, "id", id,
			{ id: -1, itemId: -1, name: "", description: "", price: 0, mps: 0 });
	}

	this.getResource = function(id) {
		return search(this.resources, "id", id,
			{ id: -1, name: '', count: 0 });
	}

	this.getKnowledgeItem = function(id) {
		return search(this.unlockedKnowledgeItems, "id", id,
			{ id: -1, price: 0 });
	}

	this.hasAchievement = function(id) {
		return search(this.achievements, "id", id, false) ? true : false;
	}

	this.awardAchievement = function(id) {
		if(!this.hasAchievement(id)) this.achievements.push({id: id});
	}

	this.buyItem = function(id) {
		var item = this.getItem(id);

		// Add an entry for it if nobody has bought it yet.
		if(item.id === -1) {
			item.id = id;
			item.count++;
			this.items.push({id: id, count: item.count});
		}
		else {
			var index = this.items.indexOf(item);
			this.items[index].count++;
		}
	};

	this.mine = function(items) {
		for(var i = 0; i < items.length; i++) {
			var item = this.getResource(items[i].id);

			// Add an entry for it if nobody has bought it yet.
			if(item.id === -1) {
				this.resources.push({id: items[i].id, count: 1});
			}
			else {
				var index = this.resources.indexOf(item);
				this.resources[index].count++;
			}
		}
	}

	this.buyUpgrade = function(upgrade) {
		this.upgrades.push({id: upgrade.id});
	};
});