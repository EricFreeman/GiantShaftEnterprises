var idleGame = angular.module('idleGame', ['ngRoute']);

idleGame.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
			when('/business', {
				templateUrl: 'business.html',
				controller: 'BusinessController'
			}).
			when('/store', {
				templateUrl: 'store.html',
				controller: 'StoreController'
			}).
			when('/upgrades', {
				templateUrl: 'upgrades.html',
				controller: 'UpgradesController'
			}).
			when('/achievements', {
				templateUrl: 'achievements.html',
				controller: 'AchievementsController'
			}).
			when('/stats', {
				templateUrl: 'stats.html',
				controller: 'StatsController'
			}).
			when('/menu', {
				templateUrl: 'menu.html',
				controller: 'MenuController'
			}).
			when('/about', {
				templateUrl: 'about.html',
				controller: 'AboutController'
			}).
			otherwise({
				redirectTo: '/business'
			});
	}
]);

idleGame.service('gameService', function() {
	// All base items (not upgrades) you can purchase are defined here
	this.items = [
		{ id: 0, name: "Minimum Wage Worker", mps: .1 , price: 15 },
		{ id: 1, name: "Cubicle", mps: .3 , price: 100 },
		{ id: 2, name: "Salary Employee", mps: 2, price: 1500 },
		{ id: 7, name: "Hardware", mps: 1, price: 1500 },
		{ id: 9, name: "HR Department", mps: .5, price: 2000 },
		{ id: 4, name: "Accounting Department", mps: 3, price: 5000 },
		{ id: 5, name: "Benefits Package", mps: 3, price: 25000 },
		{ id: 3, name: "Upper Management", mps: 1, price: 50000 },
		{ id: 6, name: "Executive", mps: 10, price: 100000 },
		{ id: 8, name: "Office Building", mps: 20, price: 500000 }
	];

	// All upgrades for items
	// Optional fields: 
	//		isOpportunity - used to change what the 'Adds' row displays
	//		isOnLoad -		only used when the game is loaded
	//		mpo - 			money per opportunity
	//		mpop - 			money per opportunity percentage (of MPS)
	//		showAfter - 	array of other upgrade ids to only show upgrade after listed upgrades was purchased
	this.upgrades = [
		{ id: 0, itemId: 0, name: "Positive Reinforcement", price: 500, mps: .05,
			description: "Studies have shown that training employees is the same as training a dog: use lots of positive reinforcement to get them to behave correctly." },
		{ id: 1, itemId: 0, name: "Mentoring Program", price: 1500, mps: .1,
			description: "While reading binder upon binder of information is fun for some people, it is easier to learn and retain information from a good teacher." },
		{ id: 2, itemId: 0, name: "Better Scheduling", price: 30000, mps: .1,
			description: "When all of your minimum wage employees work under 40 hours a week, there's no need to pay them health benefits!" },

		{ id: 3, itemId: 1, name: "Lower Walls", price: 1000, mps: .1,
			description: "Lowering the walls of a cubicle will help increase team dynamics and promote synergy!" },
		{ id: 4, itemId: 1, name: "Better Seating", price: 6000, mps: .2,
			description: "Better seating will reduce stress and improve your employees' quality of life!" },
		{ id: 5, itemId: 1, name: "Modest Improvements", price: 120000, mps: .3,
			description: "Adding better lighting, air-purifying plants, and other solutions to increase Feng Shui!" },

		{ id: 6, itemId: 2, name: "Four Tens", price: 10000, mps: .5, 
			description: "Changing the work schedule to four ten hour days and giving the employees a three day weekened boosts employee retention cutting down on the cost to train new employees!" },
		{ id: 7, itemId: 2, name: "Free Lunch", price: 60000, mps: 1, 
			description: "I guess there is such a thing." },
		{ id: 8, itemId: 2, name: "80/20", price: 1200000, mps: 2,
			description: "Letting your employees do whatever they want (within reason) 20% of the day gives them more skills, better attitudes, and extra creativity to get the most out of the remaining 80%!" },

		{ id: 9, itemId: 7, name: "Ergonomic Keyboards", price: 50000, mps: .25, 
			description: "Mitigate work related injuries with smarter keyboards for your employees!" },
		{ id: 10, itemId: 7, name: "Upgraded Computers", price: 350000, mps: .5, 
			description: "Your employees can get more done when they don't have to wait on technological limitations." },
		{ id: 11, itemId: 7, name: "Enhanced Servers", price: 5000000, mps: 1, 
			description: "Your clients are happier because of the higher load speeds and reduced down-time." },

		{ id: 12, itemId: 9, name: "Employee Handbook", price: 50000, mps: .01, 
			description: "Make sure you read every page!" },
		{ id: 13, itemId: 9, name: "Policy Documentation", price: 100000, mps: .01, 
			description: "Your employees will make an extra effort to comply with the company's policies." },
		{ id: 14, itemId: 9, name: "Christmas Party", price: 150000, mps: .01, 
			description: "Your employees will never forget how drunk Jason from Accounting was that night!" },
		
		{ id: 18, itemId: 4, name: "Chasing Nickels Around Dollar Bills", price: 150000, mps: 1.5, 
			description: "Increase the effectiveness of your business by trimming small expenses.  Your employees are now unhappy your business charges for coffee in the breakroom." },
		{ id: 19, itemId: 4, name: "Investments", price: 250000, mps: 2, 
			description: "Purchase goods or services to make huge gains in the long run." },
		{ id: 20, itemId: 4, name: "Strategic Financial Management", price: 350000, mps: 3, 
			description: "Short term loss will guarentee a winning financial strategy in the long term!" },

		{ id: 21, itemId: 5, name: "Unlimited PTO", price: 500000, mps: 2, 
			description: "Your workers will be very happy with a more flexible PTO schedule (and some may even take less PTO than normal)." },
		{ id: 22, itemId: 5, name: "Health, Vision, and Dental Plans", price: 750000, mps: 3, 
			description: "Lisa needs braces!" },
		{ id: 23, itemId: 5, name: "Generous Pension", price: 1000000, mps: 4, 
			description: "Keep employee retention up by offering them a generous pension in exchange for a lifetime of servitude." },

		{ id: 15, itemId: 3, name: "Useless Meetings", price: 1000000, mps: 0, 
			description: "None of your employees are suffering from insomnia after that meeting!" },
		{ id: 16, itemId: 3, name: "Even More #$^&*% Useless Meetings", price: 1750000, mps: 0, 
			description: "None of your employees are suffering from insomnia after *that* meeting!" },
		{ id: 17, itemId: 3, name: "Micromanagement", price: 2500000, mps: 0, 
			description: "Upper Management does their best to get the most out of them slacking employees!" },

		{ id: 24, itemId: 6, name: "Executive Bathroom", price: 10000000, mps: 5, 
			description: "The most prized posession of every executive." },
		{ id: 25, itemId: 6, name: "Goal Oriented Bonuses", price: 20000000, mps: 10, 
			description: "Giving an executive a healthy bonus when their department doesn't go over budget will ensure your company stays fiscally responsible!" },
		{ id: 26, itemId: 6, name: "Golden Handcuffs", price: 30000000, mps: 15, 
			description: "Ensure your executive's loyalty by paying them large sign on bonuses that they have to pay back if they quit within a certain amount of years." },

		{ id: 27, itemId: 8, name: "Recreations", price: 50000000, mps: 25, 
			description: "Ping-Pong tables, olympic size swimming pool, and bike trails will make sure your employees always have something they can do if they want to take a break." },
		{ id: 28, itemId: 8, name: "Electric Car Charging Parking Lot", price: 100000000, mps: 50, 
			description: "Now your employees can take their Tesla to work." },
		{ id: 29, itemId: 8, name: "Improved Space", price: 150000000, mps: 100, 
			description: "Better lighting, comfier furniture, and the use of plants goes a long way to reducing stress and increasing productivity of your employees!" },

		{ id: 30, itemId: "Business Opportunity", name: "Business Guru", price: 1000, mps: 0, mpo: 1, isOpportunity: 1, isBusiness: 1,
			description: "Your increase in business savvy skills lead to doubling the profit gained from completing business opportunities." },
		{ id: 31, itemId: "Business Opportunity", name: "Business Expert", price: 10000, mps: 0, mpo: 18, isOpportunity: 1, showAfter: [30], isBusiness: 1,
			description: "Your expertise in everything business just put you on Glassdoor.com's Top CEO list." },
		{ id: 32, itemId: "Business Opportunity", name: "Business Savant", price: 100000, mps: 0, mpo: 180, isOpportunity: 1, showAfter: [30, 31], isBusiness: 1,
			description: "Your eat your competition for breakfast." },

		{ id: 33, itemId: "Business Opportunity", name: "Business Demigod", price: 1000000, mps: 0, mpop: .01, showAfter: [32], isOpportunity: 1, isBusiness: 1,
			description: "Opportunity awaits." },
		{ id: 34, itemId: "Business Opportunity", name: "Business God", price: 10000000, mps: 0, mpop: .01, showAfter: [33], isOpportunity: 1, isBusiness: 1,
			description: "Become one with the opportunity." },
		{ id: 35, itemId: "Business Opportunity", name: "Business Elder God", price: 100000000, mps: 0, mpop: .01, showAfter: [34], isOpportunity: 1, isBusiness: 1,
			description: "Kill the non believeres.  You are the only true opportunity." },

		{ id: 36, itemId: "Money/Second", name: "Night Owl", price: 250000, mps: 0, isOnLoad: 1, per: .083, isBusiness: 1,
			description: "Gain a small part of your money even while the game is closed." },
		{ id: 37, itemId: "Money/Second", name: "Night Owl II", price: 2500000, mps: 0, isOnLoad: 1, per: .083, showAfter: [36], isBusiness: 1,
			description: "Gain a small part of your money even while the game is closed." },
		{ id: 38, itemId: "Money/Second", name: "Night Owl III", price: 25000000, mps: 0, isOnLoad: 1, per: .083, showAfter: [37], isBusiness: 1,
			description: "Gain a small part of your money even while the game is closed." },

		{ id: 39, itemId: "Money/Second", name: "Over Achiever", price: 100000000, isAchievement: 1, per: .0025, isBusiness: 1,
			description: "Gain a percentage increase of Money/Second for every achievement earned." },
		{ id: 40, itemId: "Money/Second", name: "Butt Kisser", price: 1000000000, isAchievement: 1, per: .005, showAfter: [39], isBusiness: 1,
			description: "Gain a percentage increase of Money/Second for every achievement earned." },
		{ id: 41, itemId: "Money/Second", name: "Brown Noser", price: 10000000000, isAchievement: 1, per: .01, showAfter: [40], isBusiness: 1,
			description: "Gain a percentage increase of Money/Second for every achievement earned." },
	];

	// All in game achievements and how to earn them are defined here
	this.achievements = [
		{ id: 0, name: "First Steps",
			description: "Buy something from the store.",
			earn: function(gameService, playerService, moneyService) { return playerService.items.length > 0; }
		},
		{ id: 1, name: "Never Stop Improving", 
			description: "Buy your first upgrade.",
			earn: function(gameService, playerService, moneyService) { return playerService.upgrades.length > 0; }
		},
		{ id: 2, name: "Diversity is Key", 
			description: "Own one of everything.",
			earn: function(gameService, playerService, moneyService) { return gameService.items.filter(function(d) {return playerService.getItem(d.id).count < 1}).length == 0; }
		},
		{ id: 45, name: "Diversity is Paramount", 
			description: "Own ten of everything.",
			earn: function(gameService, playerService, moneyService) { return gameService.items.filter(function(d) {return playerService.getItem(d.id).count < 10}).length == 0; }
		},
		{ id: 46, name: "Diversity is Opportunity", 
			description: "Own one hundred of everything.",
			earn: function(gameService, playerService, moneyService) { return gameService.items.filter(function(d) {return playerService.getItem(d.id).count < 100}).length == 0; }
		},
		{ id: 47, name: "Diversity is You", 
			description: "Own one thousand of everything.",
			earn: function(gameService, playerService, moneyService) { return gameService.items.filter(function(d) {return playerService.getItem(d.id).count < 1000}).length == 0; }
		},

		{ id: 9, name: "Make $1,000,000 by EOD", 
			description: "Earn enough to make $1mil in one day.",
			earn: function(gameService, playerService, moneyService) { return moneyService.getMps() > 1000000/24/60/60; }
		},
		{ id: 10, name: "Make $1,000,000,000 by EOD", 
			description: "Earn enough to make $bil in one day.",
			earn: function(gameService, playerService, moneyService) { return moneyService.getMps() > 1000000000/24/60/60; }
		},
		{ id: 11, name: "Make $1,000,000,000,000 by EOD", 
			description: "Earn enough to make $tril in one day.",
			earn: function(gameService, playerService, moneyService) { return moneyService.getMps() > 1000000000000/24/60/60; }
		},

		{ id: 36, name: "Opportunist", 
			description: "Complete 10 business opportunities.",
			earn: function(gameService, playerService, moneyService) { return playerService.totalOpportunities >= 10; }
		},
		{ id: 37, name: "Mega Opportunist", 
			description: "Complete 100 business opportunities.",
			earn: function(gameService, playerService, moneyService) { return playerService.totalOpportunities >= 100; }
		},
		{ id: 38, name: "Ultra Opportunist", 
			description: "Complete 1000 business opportunities.",
			earn: function(gameService, playerService, moneyService) { return playerService.totalOpportunities >= 1000; }
		},
		{ id: 39, name: "You Need to Calm Down and Re-Evaluate Life Opportunist", 
			description: "Complete 10000 business opportunities.",
			earn: function(gameService, playerService, moneyService) { return playerService.totalOpportunities >= 10000; }
		},

		{ id: 40, name: "Busy-ness", 
			description: "Earn $10,000 Total.",
			earn: function(gameService, playerService, moneyService) { return playerService.totalMoney >= 10000; }
		},
		{ id: 41, name: "Business as Usual", 
			description: "Earn $1,000,000 Total.",
			earn: function(gameService, playerService, moneyService) { return playerService.totalMoney >= 1000000; }
		},
		{ id: 42, name: "Business as Unusual", 
			description: "Earn $100,000,000 Total.",
			earn: function(gameService, playerService, moneyService) { return playerService.totalMoney >= 100000000; }
		},
		{ id: 43, name: "Timeless Business", 
			description: "Earn $100,000,000,000 Total.",
			earn: function(gameService, playerService, moneyService) { return playerService.totalMoney >= 100000000000; }
		},

		{ id: 44, name: "That Was a Good Business Deal", 
			description: "Earn over $1,000 per business opportunity.",
			earn: function(gameService, playerService, moneyService) { return moneyService.clickPower() > 1000; }
		},

		{ id: 3, name: "Hooray, Capitalism!", 
			description: "Own ten Minimum Wage Workers.",
			earn: function(gameService, playerService, moneyService) { return playerService.getItem(0).count >= 10; }
		},
		{ id: 4, name: "Yummy, Capitalism!", 
			description: "Own one hundred Minimum Wage Workers.",
			earn: function(gameService, playerService, moneyService) { return playerService.getItem(0).count >= 100; }
		},
		{ id: 5, name: "Okay, Wal-Mart", 
			description: "Own one thousand Minimum Wage Workers.",
			earn: function(gameService, playerService, moneyService) { return playerService.getItem(0).count >= 1000; }
		},

		{ id: 6, name: "Little Boxes", 
			description: "Own ten Cubicles.",
			earn: function(gameService, playerService, moneyService) { return playerService.getItem(1).count >= 10; }
		},
		{ id: 7, name: "Cubicle Farm", 
			description: "Own one hundred Cubicles.",
			earn: function(gameService, playerService, moneyService) { return playerService.getItem(1).count >= 100; }
		},
		{ id: 8, name: "Sea of Cubicles", 
			description: "Own one thousand Cubicles.",
			earn: function(gameService, playerService, moneyService) { return playerService.getItem(1).count >= 1000; }
		},

		{ id: 12, name: "9 to 5", 
			description: "Own ten Salary Employess.",
			earn: function(gameService, playerService, moneyService) { return playerService.getItem(2).count >= 10; }
		},
		{ id: 13, name: "9 to 6", 
			description: "Own one hundred Salary Employess.",
			earn: function(gameService, playerService, moneyService) { return playerService.getItem(2).count >= 100; }
		},
		{ id: 14, name: "9 to 7 + Weekends", 
			description: "Own one thousand Salary Employess.",
			earn: function(gameService, playerService, moneyService) { return playerService.getItem(2).count >= 1000; }
		},

		{ id: 15, name: "Horizontal Scaling is Best Scaling",
			description: "Own ten Hardwares.",
			earn: function(gameService, playerService, moneyService) { return playerService.getItem(7).count >= 10; }
		},
		{ id: 16, name: "Hardware to Hell", 
			description: "Own one hundred Hardwares.",
			earn: function(gameService, playerService, moneyService) { return playerService.getItem(7).count >= 100; }
		},
		{ id: 17, name: "Johnny Mnemonic", 
			description: "Own one thousand Hardwares.",
			earn: function(gameService, playerService, moneyService) { return playerService.getItem(7).count >= 1000; }
		},

		{ id: 18, name: "HRotica",
			description: "Own ten HR Departments.",
			earn: function(gameService, playerService, moneyService) { return playerService.getItem(9).count >= 10; }
		},
		{ id: 19, name: "Human Remains Department", 
			description: "Own one hundred HR Departments.",
			earn: function(gameService, playerService, moneyService) { return playerService.getItem(9).count >= 100; }
		},
		{ id: 20, name: "HRmy of Darkness", 
			description: "Own one thousand HR Departments.",
			earn: function(gameService, playerService, moneyService) { return playerService.getItem(9).count >= 1000; }
		},

		{ id: 21, name: "Cook the Books",
			description: "Own ten Accounting Departments.",
			earn: function(gameService, playerService, moneyService) { return playerService.getItem(4).count >= 10; }
		},
		{ id: 22, name: "Burn the Books", 
			description: "Own one hundred Accounting Departments.",
			earn: function(gameService, playerService, moneyService) { return playerService.getItem(4).count >= 100; }
		},
		{ id: 23, name: "Enron the Books", 
			description: "Own one thousand Accounting Departments.",
			earn: function(gameService, playerService, moneyService) { return playerService.getItem(4).count >= 1000; }
		},

		{ id: 24, name: "Lisa Needs Braces",
			description: "Own ten Benefits Packages.",
			earn: function(gameService, playerService, moneyService) { return playerService.getItem(5).count >= 10; }
		},
		{ id: 25, name: "DENTAL PLAN", 
			description: "Own one hundred Benefits Packages.",
			earn: function(gameService, playerService, moneyService) { return playerService.getItem(5).count >= 100; }
		},
		{ id: 26, name: "Lisa Needs Braces", 
			description: "Own one thousand Benefits Packages.",
			earn: function(gameService, playerService, moneyService) { return playerService.getItem(5).count >= 1000; }
		},

		{ id: 27, name: "What Are You Doing?",
			description: "Own ten Upper Managements.",
			earn: function(gameService, playerService, moneyService) { return playerService.getItem(3).count >= 10; }
		},
		{ id: 28, name: "No, Seriously, Please Stop.", 
			description: "Own one hundred Upper Managements.",
			earn: function(gameService, playerService, moneyService) { return playerService.getItem(3).count >= 100; }
		},
		{ id: 29, name: ":(", 
			description: "Own one thousand Upper Managements.",
			earn: function(gameService, playerService, moneyService) { return playerService.getItem(3).count >= 1000; }
		},

		{ id: 30, name: "Execute",
			description: "Own ten Executives.",
			earn: function(gameService, playerService, moneyService) { return playerService.getItem(6).count >= 10; }
		},
		{ id: 31, name: "ExeCute",
			description: "Own one hundred Executives.",
			earn: function(gameService, playerService, moneyService) { return playerService.getItem(6).count >= 100; }
		},
		{ id: 32, name: "Cute",
			description: "Own one thousand Executives.",
			earn: function(gameService, playerService, moneyService) { return playerService.getItem(6).count >= 1000; }
		},

		{ id: 33, name: "National",
			description: "Own ten Office Buildings.",
			earn: function(gameService, playerService, moneyService) { return playerService.getItem(8).count >= 10; }
		},
		{ id: 34, name: "International", 
			description: "Own one hundred Office Buildings.",
			earn: function(gameService, playerService, moneyService) { return playerService.getItem(8).count >= 100; }
		},
		{ id: 35, name: "Starbucks", 
			description: "Own one thousand Office Buildings.",
			earn: function(gameService, playerService, moneyService) { return playerService.getItem(8).count >= 1000; }
		},
	];

	this.getItem = function(id) {
		return search(this.items, "id", id,
			{ id: -1, name: "", mps: 0, price: 0 });
	};

	this.getUpgrade = function(id) {
		return search(this.upgrades, "id", id,
			{ id: -1, itemId: -1, name: "", description: "", price: 0, mps: 0 });
	}
});

idleGame.service('playerService', function () {
	// Owned items are defined here as: { id: x, count: y }
	this.items = [];
	// Owned upgrades are stored here as: { id: x }
	this.upgrades = [];
	// Earned achievments are stored here as: { id: x }
	this.achievements = [];
	this.money = 15;
	this.companyName = "Default Company";
	this.fps = 10;

	// For stats page
	this.totalMoney = 0;
	this.totalOpportunities = 0;
	this.totalMoneyFromOpportunties = 0;

	// Settings
	this.hideBoughtUpgrades = false;

	this.getItem = function(id) {
		return search(this.items, "id", id,
			{ id: -1, count: 0 });
	};

	this.getUpgrade = function(id) {
		return search(this.upgrades, "id", id,
			{ id: -1, itemId: -1, name: "", description: "", price: 0, mps: 0 });
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
			this.items.push(item);
		}
		else {
			var index = this.items.indexOf(item);
			this.items[index].count++;
		}
	}

	this.buyUpgrade = function(upgrade) {
		this.upgrades.push(upgrade);
	}
});

idleGame.service('moneyService', function($rootScope, gameService, playerService) {
	this.cachedMps = 0;
	this.cachedClickPower = 0;

	this.getMps = function() {
		return this.cachedMps;
	}

	this.clickPower = function() {
		return this.cachedClickPower;
	}

	var self = this;
	$rootScope.$on('updateCache', function() {
		self.cachedMps = self.getNewMps();
		self.cachedClickPower = self.getNewClickPower();
	});

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

		for(var i = 0; i < upgrades.length; i++) {
			additionalMps += upgrades[i].per * playerService.achievements.length * baseMps;
		}

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
			playerService.upgrades.
				filter(function(d) {
					return d.isOpportunity;
				}).
				reduce(function(prev, cur) {
					return prev += (cur.mpo ? cur.mpo : cur.mpop * mps);
				}, 0);
	}
});

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

// A simple search that will go through the passed in list and find
// the first item that the specified property matches a given value.
// Otherwise it will return a default value
var search = function(list, property, value, def) {
	for(var item in list)
		if(list[item][property] === value)
			return list[item];

	return def;
}