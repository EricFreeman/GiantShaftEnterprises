$(function() {
    $( document ).tooltip({
      track: true
    });
  });

var idleGame = angular.module('idleGame', ['ngRoute']);

idleGame.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
			when('/business', {
				templateUrl: 'business.html',
				controller: 'BusinessController'
			}).
			when('/stats', {
				templateUrl: 'stats.html',
				controller: 'StatsController'
			}).
			when('/space', {
				templateUrl: 'space.html',
				controller: 'SpaceController'
			}).
			when('/knowledge', {
				templateUrl: 'knowledge.html',
				controller: 'KnowledgeController'
			}).
			when('/menu', {
				templateUrl: 'menu.html',
				controller: 'MenuController'
			}).
			otherwise({
				redirectTo: '/business'
			});
	}
]);

idleGame.service('gameService', function() {
	// All base items (not upgrades) you can purchase are defined here
	// WARNING: When adding new items, it is essntial to check knowledgeItems when determining what the next id for the item should be!
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
	//		showAfter - 	array of other upgrade ids to only show upgrade after listed upgrades were purchased
	// WARNING: When adding new upgrades, it is essntial to check knowledgeItems when determining what the next id for the upgrade should be!
	this.upgrades = [
		{ id: 0, itemId: 0, name: "Positive Reinforcement", price: 500, mps: .05,
			description: "Studies have shown that training employees is the same as training a dog: use lots of positive reinforcement to get them to behave correctly." },
		{ id: 1, itemId: 0, name: "Mentoring Program", price: 1500, mps: .1,
			description: "While reading binder upon binder of information is fun for some people, it is easier to learn and retain information from a good teacher." },
		{ id: 2, itemId: 0, name: "Better Scheduling", price: 30000, mps: .1,
			description: "When all of your minimum wage employees work under 35 hours a week, there's no need to pay them health benefits!" },

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
			description: "Short term loss will guarantee a winning financial strategy in the long term!" },
		
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
			description: "The most prized possession of every executive." },
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
		
		{ id: 71, itemId: "Business Opportunity", name: "Starting Business", price: 5, mps: 0, mpo: 1, isOpportunity: 1, isBusiness: 1,
			description: "Starting a new business makes you feel young and alive again!" },
		{ id: 75, itemId: "Business Opportunity", name: "Business Innovator", price: 400, mps: 0, mpo: 2.5, isOpportunity: 1, showAfter: [71], isBusiness: 1,
			description: "You're starting to make waves in the industry." },
		{ id: 30, itemId: "Business Opportunity", name: "Business Guru", price: 1000, mps: 0, mpo: 8, isOpportunity: 1, showAfter: [75], isBusiness: 1,
			description: "Your increase in business savvy skills lead to increasing the profit gained from completing business opportunities." },
		{ id: 31, itemId: "Business Opportunity", name: "Business Expert", price: 10000, mps: 0, mpo: 20, isOpportunity: 1, showAfter: [30], isBusiness: 1,
			description: "Your expertise in everything business just put you on Glassdoor.com's Top CEO list." },
		{ id: 32, itemId: "Business Opportunity", name: "Business Savant", price: 100000, mps: 0, mpo: 200, isOpportunity: 1, showAfter: [31], isBusiness: 1,
			description: "Your eat your competition for breakfast." },
		{ id: 44, itemId: "Business Opportunity", name: "Business Epic", price: 1000000, mps: 0, mpo: 2000, isOpportunity: 1, showAfter: [32], isBusiness: 1,
			description: "Absorb the competition." },
		{ id: 76, itemId: "Business Opportunity", name: "Business Leader", price: 25000000, mps: 0, mpo: 50000, isOpportunity: 1, showAfter: [44], isBusiness: 1,
			description: "Mothers name their children after you." },

		{ id: 33, itemId: "Business Opportunity", name: "Business Demigod", price: 1000000, mps: 0, mpop: .01, showAfter: [32], isOpportunity: 1, isBusiness: 1,
			description: "Opportunity awaits." },
		{ id: 34, itemId: "Business Opportunity", name: "Business God", price: 10000000, mps: 0, mpop: .01, showAfter: [33], isOpportunity: 1, isBusiness: 1,
			description: "Become one with the opportunity." },
		{ id: 35, itemId: "Business Opportunity", name: "Business Elder God", price: 100000000, mps: 0, mpop: .01, showAfter: [34], isOpportunity: 1, isBusiness: 1,
			description: "Kill the non believers.  You are the only true opportunity." },
		{ id: 43, itemId: "Business Opportunity", name: "Final Business", price: 1000000000, mps: 0, mpop: .02, showAfter: [35], isOpportunity: 1, isBusiness: 1,
			description: "Transcend." },

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
		{ id: 0, name: "First Steps", image: 'firstSteps',
			description: "Buy something from the store.",
			earn: function(gameService, playerService, cacheService) { return playerService.items.length > 0; }
		},
		{ id: 1, name: "Never Stop Improving",
			description: "Buy your first upgrade.", image: 'improve',
			earn: function(gameService, playerService, cacheService) { return playerService.upgrades.length > 0; }
		},
		{ id: 2, name: "Diversity is Key", image: 'diversity1',
			description: "Own one of everything.",
			earn: function(gameService, playerService, cacheService) { return cacheService.hasDiversity(1); }
		},
		{ id: 45, name: "Diversity is Paramount", image: 'diversity2',
			description: "Own ten of everything.",
			earn: function(gameService, playerService, cacheService) { return cacheService.hasDiversity(10); }
		},
		{ id: 46, name: "Diversity is Opportunity", image: 'diversity3',
			description: "Own one hundred of everything.",
			earn: function(gameService, playerService, cacheService) { return cacheService.hasDiversity(100); }
		},
		{ id: 47, name: "Diversity is You", image: 'diversity4',
			description: "Own one thousand of everything.",
			isHidden: true,
			earn: function(gameService, playerService, cacheService) { return cacheService.hasDiversity(1000); }
		},
		{ id: 58, name: "There is No Diversity...Only You.", image: 'diversity4',
			description: "Own ten thousand of everything.",
			isHidden: true,
			earn: function(gameService, playerService, cacheService) { return cacheService.hasDiversity(10000); }
		},

		{ id: 80, name: "Starting Over", image: 'handshake',
			description: "Start a second company.",
			isHidden: true,
			earn: function(gameService, playerService, cacheService) { return playerService.totalCompaniesStarted > 1; }
		},
		{ id: 81, name: "True Entrepreneur", image: 'handshake',
			description: "Start ten new companies.",
			isHidden: true,
			earn: function(gameService, playerService, cacheService) { return playerService.totalCompaniesStarted > 10; }
		},

		{ id: 82, name: "Galileo Galilei", image: 'management2',
			description: "Earn 10 BK",
			isHidden: true,
			earn: function(gameService, playerService, cacheService) { return playerService.totalKnowledge >= 10; }
		},
		{ id: 83, name: "Isaac Newton", image: 'management2',
			description: "Earn 100 BK",
			isHidden: true,
			earn: function(gameService, playerService, cacheService) { return playerService.totalKnowledge >= 100; }
		},
		{ id: 84, name: "Albert Einstein", image: 'management2',
			description: "Earn 1000 BK",
			isHidden: true,
			earn: function(gameService, playerService, cacheService) { return playerService.totalKnowledge >= 1000; }
		},
		{ id: 85, name: "Eric Freeman", image: 'management2',
			description: "Earn 10000 BK",
			isHidden: true,
			earn: function(gameService, playerService, cacheService) { return playerService.totalKnowledge >= 10000; }
		},

		{ id: 86, name: "Smart Move", image: 'firstSteps',
			description: "Buy your first BK item.",
			isHidden: true,
			earn: function(gameService, playerService, cacheService) { return playerService.knowledge < playerService.totalKnowledge; }
		},

		{ id: 9, name: "Make $1,000,000 by EOD", image: 'money1',
			description: "Earn enough to make $1 million in one day.",
			earn: function(gameService, playerService, cacheService) { return cacheService.getMps() > 11.57; }
		},
		{ id: 10, name: "Make $1,000,000,000 by EOD", image: 'money2',
			description: "Earn enough to make $1 billion in one day.",
			earn: function(gameService, playerService, cacheService) { return cacheService.getMps() > 11574; }
		},
		{ id: 11, name: "Make $1,000,000,000,000 by EOD", image: 'money3',
			description: "Earn enough to make $1 trillion in one day.",
			isHidden: true,
			earn: function(gameService, playerService, cacheService) { return cacheService.getMps() > 11574074; }
		},
		{ id: 59, name: "Make $1,000,000,000,000,000 by EOD", image: 'money3',
			description: "Earn enough to make $1 quadrillion in one day.",
			isHidden: true,
			earn: function(gameService, playerService, cacheService) { return cacheService.getMps() > 11574074000; }
		},

		{ id: 36, name: "Opportunist", image: 'bo1',
			description: "Complete 10 business opportunities.",
			earn: function(gameService, playerService, cacheService) { return playerService.totalOpportunities >= 10; }
		},
		{ id: 37, name: "Mega Opportunist", image: 'bo2',
			description: "Complete 100 business opportunities.",
			earn: function(gameService, playerService, cacheService) { return playerService.totalOpportunities >= 100; }
		},
		{ id: 38, name: "Ultra Opportunist", image: 'bo3',
			description: "Complete 1000 business opportunities.",
			earn: function(gameService, playerService, cacheService) { return playerService.totalOpportunities >= 1000; }
		},
		{ id: 39, name: "You Need to Calm Down and Re-Evaluate Life Opportunist", image: 'bo3',
			description: "Complete 10000 business opportunities.",
			isHidden: true,
			earn: function(gameService, playerService, cacheService) { return playerService.totalOpportunities >= 10000; }
		},

		{ id: 40, name: "Busy-ness", image: 'money1',
			description: "Earn $10,000 Total.",
			earn: function(gameService, playerService, cacheService) { return playerService.totalMoney >= 10000; }
		},
		{ id: 41, name: "Business as Usual", image: 'money2',
			description: "Earn $1,000,000 Total.",
			earn: function(gameService, playerService, cacheService) { return playerService.totalMoney >= 1000000; }
		},
		{ id: 42, name: "Business as Unusual", image: 'money3',
			description: "Earn $100,000,000 Total.",
			earn: function(gameService, playerService, cacheService) { return playerService.totalMoney >= 100000000; }
		},
		{ id: 43, name: "Timeless Business", image: 'money3',
			description: "Earn $100,000,000,000 Total.",
			earn: function(gameService, playerService, cacheService) { return playerService.totalMoney >= 100000000000; }
		},
		{ id: 60, name: "Just Business", image: 'money3',
			description: "Earn $100,000,000,000,000 Total.",
			isHidden: true,
			earn: function(gameService, playerService, cacheService) { return playerService.totalMoney >= 100000000000000; }
		},
		{ id: 61, name: "Business", image: 'money3',
			description: "Earn $100,000,000,000,000,000 Total.",
			isHidden: true,
			earn: function(gameService, playerService, cacheService) { return playerService.totalMoney >= 100000000000000000; }
		},

		{ id: 62, name: "That Was an Okay Business Deal", image: 'handshake',
			description: "Earn over $100 per business opportunity.",
			earn: function(gameService, playerService, cacheService) { return cacheService.clickPower() > 100; }
		},
		{ id: 44, name: "That Was a Good Business Deal", image: 'handshake',
			description: "Earn over $1,000 per business opportunity.",
			isHidden: true,
			earn: function(gameService, playerService, cacheService) { return cacheService.clickPower() > 1000; }
		},
		{ id: 63, name: "That Was a Fantastic Business Deal", image: 'handshake',
			description: "Earn over $10,000 per business opportunity.",
			isHidden: true,
			earn: function(gameService, playerService, cacheService) { return cacheService.clickPower() > 10000; }
		},

		{ id: 3, name: "Hooray, Capitalism!", image: 'worker1',
			description: "Own ten Minimum Wage Workers.",
			earn: function(gameService, playerService, cacheService) { return playerService.getItem(0).count >= 10; }
		},
		{ id: 4, name: "Yummy, Capitalism!", image: 'worker1',
			description: "Own one hundred Minimum Wage Workers.",
			isHidden: true,
			earn: function(gameService, playerService, cacheService) { return playerService.getItem(0).count >= 100; }
		},
		{ id: 5, name: "Okay, Wal-Mart", image: 'worker2',
			description: "Own one thousand Minimum Wage Workers.",
			isHidden: true,
			earn: function(gameService, playerService, cacheService) { return playerService.getItem(0).count >= 1000; }
		},
		{ id: 48, name: "Enslavement", image: 'worker2',
			description: "Own ten thousand Minimum Wage Workers.",
			isHidden: true,
			earn: function(gameService, playerService, cacheService) { return playerService.getItem(0).count >= 10000; }
		},

		{ id: 6, name: "Little Boxes", image: 'cubicle1',
			description: "Own ten Cubicles.",
			earn: function(gameService, playerService, cacheService) { return playerService.getItem(1).count >= 10; }
		},
		{ id: 7, name: "Cubicle Farm", image: 'cubicle2',
			description: "Own one hundred Cubicles.",
			isHidden: true,
			earn: function(gameService, playerService, cacheService) { return playerService.getItem(1).count >= 100; }
		},
		{ id: 8, name: "Sea of Cubicles", image: 'cubicle3',
			description: "Own one thousand Cubicles.",
			isHidden: true,
			earn: function(gameService, playerService, cacheService) { return playerService.getItem(1).count >= 1000; }
		},
		{ id: 49, name: "Ocean of Cubicles", image: 'cubicle3',
			description: "Own ten thousand Cubicles.",
			isHidden: true,
			earn: function(gameService, playerService, cacheService) { return playerService.getItem(1).count >= 10000; }
		},

		{ id: 12, name: "9 to 5", image: 'salary1',
			description: "Own ten Salary Employees.",
			earn: function(gameService, playerService, cacheService) { return playerService.getItem(2).count >= 10; }
		},
		{ id: 13, name: "9 to 6", image: 'salary1',
			description: "Own one hundred Salary Employees.",
			isHidden: true,
			earn: function(gameService, playerService, cacheService) { return playerService.getItem(2).count >= 100; }
		},
		{ id: 14, name: "9 to 7 + Weekends", image: 'salary1',
			description: "Own one thousand Salary Employees.",
			isHidden: true,
			earn: function(gameService, playerService, cacheService) { return playerService.getItem(2).count >= 1000; }
		},
		{ id: 50, name: "9 to the Rest of Your Life", image: 'salary1',
			description: "Own ten thousand Salary Employees.",
			isHidden: true,
			earn: function(gameService, playerService, cacheService) { return playerService.getItem(2).count >= 10000; }
		},

		{ id: 15, name: "Horizontal Scaling is Best Scaling", image: 'hardware1',
			description: "Own ten Hardwares.",
			earn: function(gameService, playerService, cacheService) { return playerService.getItem(7).count >= 10; }
		},
		{ id: 16, name: "Hardware to Hell", image: 'hardware2',
			description: "Own one hundred Hardwares.",
			isHidden: true,
			earn: function(gameService, playerService, cacheService) { return playerService.getItem(7).count >= 100; }
		},
		{ id: 17, name: "Johnny Mnemonic", image: 'hardware3',
			description: "Own one thousand Hardwares.",
			isHidden: true,
			earn: function(gameService, playerService, cacheService) { return playerService.getItem(7).count >= 1000; }
		},
		{ id: 51, name: "Unit 01", image: 'hardware4',
			description: "Own ten thousand Hardwares.",
			isHidden: true,
			earn: function(gameService, playerService, cacheService) { return playerService.getItem(7).count >= 10000; }
		},

		{ id: 18, name: "HRotica", image: 'hr1',
			description: "Own ten HR Departments.",
			earn: function(gameService, playerService, cacheService) { return playerService.getItem(9).count >= 10; }
		},
		{ id: 19, name: "Human Remains Department", image: 'hr1',
			description: "Own one hundred HR Departments.",
			isHidden: true,
			earn: function(gameService, playerService, cacheService) { return playerService.getItem(9).count >= 100; }
		},
		{ id: 20, name: "HRmy of Darkness", image: 'hr1',
			description: "Own one thousand HR Departments.",
			isHidden: true,
			earn: function(gameService, playerService, cacheService) { return playerService.getItem(9).count >= 1000; }
		},
		{ id: 52, name: "HRmageddon", image: 'hr1',
			description: "Own ten thousand HR Departments.",
			isHidden: true,
			earn: function(gameService, playerService, cacheService) { return playerService.getItem(9).count >= 10000; }
		},

		{ id: 21, name: "Cook the Books", image: 'accounting1',
			description: "Own ten Accounting Departments.",
			earn: function(gameService, playerService, cacheService) { return playerService.getItem(4).count >= 10; }
		},
		{ id: 22, name: "Burn the Books", image: 'accounting2',
			description: "Own one hundred Accounting Departments.",
			isHidden: true,
			earn: function(gameService, playerService, cacheService) { return playerService.getItem(4).count >= 100; }
		},
		{ id: 23, name: "Enron the Books", image: 'accounting3',
			description: "Own one thousand Accounting Departments.",
			isHidden: true,
			earn: function(gameService, playerService, cacheService) { return playerService.getItem(4).count >= 1000; }
		},
		{ id: 53, name: "You Are the Books", image: 'accounting4',
			description: "Own ten thousand Accounting Departments.",
			isHidden: true,
			earn: function(gameService, playerService, cacheService) { return playerService.getItem(4).count >= 10000; }
		},

		{ id: 24, name: "Lisa Needs Braces", image: 'benefits1',
			description: "Own ten Benefits Packages.",
			earn: function(gameService, playerService, cacheService) { return playerService.getItem(5).count >= 10; }
		},
		{ id: 25, name: "DENTAL PLAN", image: 'benefits2',
			description: "Own one hundred Benefits Packages.",
			isHidden: true,
			earn: function(gameService, playerService, cacheService) { return playerService.getItem(5).count >= 100; }
		},
		{ id: 26, name: "Lisa Needs Braces", image: 'benefits1',
			description: "Own one thousand Benefits Packages.",
			isHidden: true,
			earn: function(gameService, playerService, cacheService) { return playerService.getItem(5).count >= 1000; }
		},
		{ id: 54, name: "DENTAL PLAN", image: 'benefits2',
			description: "Own ten thousand Benefits Packages.",
			isHidden: true,
			earn: function(gameService, playerService, cacheService) { return playerService.getItem(5).count >= 10000; }
		},

		{ id: 27, name: "What Are You Doing?", image: 'management1',
			description: "Own ten Upper Managements.",
			earn: function(gameService, playerService, cacheService) { return playerService.getItem(3).count >= 10; }
		},
		{ id: 28, name: "No, Seriously, Please Stop.", image: 'management2',
			description: "Own one hundred Upper Managements.",
			isHidden: true,
			earn: function(gameService, playerService, cacheService) { return playerService.getItem(3).count >= 100; }
		},
		{ id: 29, name: ":(", image: 'management3',
			description: "Own one thousand Upper Managements.",
			isHidden: true,
			earn: function(gameService, playerService, cacheService) { return playerService.getItem(3).count >= 1000; }
		},
		{ id: 55, name: ":'(", image: 'management4',
			description: "Own ten thousand Upper Managements.",
			isHidden: true,
			earn: function(gameService, playerService, cacheService) { return playerService.getItem(3).count >= 10000; }
		},

		{ id: 30, name: "Execute", image: 'executive1',
			description: "Own ten Executives.",
			earn: function(gameService, playerService, cacheService) { return playerService.getItem(6).count >= 10; }
		},
		{ id: 31, name: "ExeCute", image: 'executive1',
			description: "Own one hundred Executives.",
			isHidden: true,
			earn: function(gameService, playerService, cacheService) { return playerService.getItem(6).count >= 100; }
		},
		{ id: 32, name: "Cute", image: 'executive1',
			description: "Own one thousand Executives.",
			isHidden: true,
			earn: function(gameService, playerService, cacheService) { return playerService.getItem(6).count >= 1000; }
		},
		{ id: 56, name: "Cutest", image: 'executive1',
			description: "Own ten thousand Executives.",
			isHidden: true,
			earn: function(gameService, playerService, cacheService) { return playerService.getItem(6).count >= 10000; }
		},

		{ id: 33, name: "National", image: 'office1',
			description: "Own ten Office Buildings.",
			earn: function(gameService, playerService, cacheService) { return playerService.getItem(8).count >= 10; }
		},
		{ id: 34, name: "International", image: 'office2',
			description: "Own one hundred Office Buildings.",
			isHidden: true,
			earn: function(gameService, playerService, cacheService) { return playerService.getItem(8).count >= 100; }
		},
		{ id: 35, name: "Starbucks", image: 'office3',
			description: "Own one thousand Office Buildings.",
			isHidden: true,
			earn: function(gameService, playerService, cacheService) { return playerService.getItem(8).count >= 1000; }
		},
		{ id: 57, name: "Subway", image: 'office4',
			description: "Own ten thousand Office Buildings.",
			isHidden: true,
			earn: function(gameService, playerService, cacheService) { return playerService.getItem(8).count >= 10000; }
		},

		{ id: 64, name: "Office 1 Superstore", image: 'supply1',
			description: "Own ten Office Supplies.",
			isHidden: true,
			earn: function(gameService, playerService, cacheService) { return playerService.getItem(10).count >= 10; }
		},
		{ id: 65, name: "Office Depot", image: 'supply2',
			description: "Own one hundred Office Supplies.",
			isHidden: true,
			earn: function(gameService, playerService, cacheService) { return playerService.getItem(10).count >= 100; }
		},
		{ id: 66, name: "OfficeMax", image: 'supply3',
			description: "Own one thousand Office Supplies.",
			isHidden: true,
			earn: function(gameService, playerService, cacheService) { return playerService.getItem(10).count >= 1000; }
		},
		{ id: 67, name: "Staples", image: 'supply4',
			description: "Own ten thousand Office Supplies.",
			isHidden: true,
			earn: function(gameService, playerService, cacheService) { return playerService.getItem(10).count >= 10000; }
		},

		{ id: 68, name: "Solidware", image: 'software1',
			description: "Own ten Softwares.",
			isHidden: true,
			earn: function(gameService, playerService, cacheService) { return playerService.getItem(11).count >= 10; }
		},
		{ id: 69, name: "Liquidware", image: 'software2',
			description: "Own one hundred Softwares.",
			isHidden: true,
			earn: function(gameService, playerService, cacheService) { return playerService.getItem(11).count >= 100; }
		},
		{ id: 70, name: "Gasware", image: 'software3',
			description: "Own one thousand Softwares.",
			isHidden: true,
			earn: function(gameService, playerService, cacheService) { return playerService.getItem(11).count >= 1000; }
		},
		{ id: 71, name: "Vaporware", image: 'software4',
			description: "Own ten thousand Softwares.",
			isHidden: true,
			earn: function(gameService, playerService, cacheService) { return playerService.getItem(11).count >= 10000; }
		},

		{ id: 76, name: "Ford", image: 'car1',
			description: "Own ten Company Cars.",
			isHidden: true,
			earn: function(gameService, playerService, cacheService) { return playerService.getItem(13).count >= 10; }
		},
		{ id: 77, name: "Toyota", image: 'car2',
			description: "Own one hundred Company Cars.",
			isHidden: true,
			earn: function(gameService, playerService, cacheService) { return playerService.getItem(13).count >= 100; }
		},
		{ id: 78, name: "Audi", image: 'car3',
			description: "Own one thousand Company Cars.",
			isHidden: true,
			earn: function(gameService, playerService, cacheService) { return playerService.getItem(13).count >= 1000; }
		},
		{ id: 79, name: "Tesla", image: 'car4',
			description: "Own ten thousand Company Cars.",
			isHidden: true,
			earn: function(gameService, playerService, cacheService) { return playerService.getItem(13).count >= 10000; }
		},

		{ id: 72, name: "Space Station 5", image: 'spacestation1',
			description: "Own ten Space Stations.",
			isHidden: true,
			earn: function(gameService, playerService, cacheService) { return playerService.getItem(12).count >= 10; }
		},
		{ id: 73, name: "Babylon 5", image: 'spacestation1',
			description: "Own one hundred Space Stations.",
			isHidden: true,
			earn: function(gameService, playerService, cacheService) { return playerService.getItem(12).count >= 100; }
		},
		{ id: 74, name: "Deep Space 9", image: 'spacestation1',
			description: "Own one thousand Space Stations.",
			isHidden: true,
			earn: function(gameService, playerService, cacheService) { return playerService.getItem(12).count >= 1000; }
		},
		{ id: 75, name: "Death Star", image: 'spacestation1',
			description: "Own ten thousand Space Stations.",
			isHidden: true,
			earn: function(gameService, playerService, cacheService) { return playerService.getItem(12).count >= 10000; }
		},
	];

	// All business knowledge items you can buy are here
	this.knowledgeItems = [
		// Click Buffs
		{ id: 31, price: 1, type: 'upgrade', description: 'New early game click buff',
			item: { id: 72, itemId: "Business Opportunity", name: "Leadership Training", price: 5, mps: 0, mpo: .5, isOpportunity: 1, isBusiness: 1,
				description: "Showing your true leadership will help you earn more respect and clients." } },
		{ id: 32, price: 2, type: 'upgrade', description: 'New early game click buff',
			item: { id: 73, itemId: "Business Opportunity", name: "Reserved Parking Space", price: 10, mps: 0, mpo: 1, isOpportunity: 1, isBusiness: 1,
				description: "Feel important with your very own personal parking space." } },
		{ id: 33, price: 3, type: 'upgrade', description: 'New early game click buff',
			item: { id: 74, itemId: "Business Opportunity", name: "Private Secretary", price: 100, mps: 0, mpo: 2, isOpportunity: 1, isBusiness: 1,
			description: "Having a secretary frees you up to focus more on your work." } },
		
		{ id: 38, price: 15, type: 'upgrade', description: 'New mid/late game click buff',
			item: { id: 81, itemId: "Business Opportunity", name: "Chauffer", price: 1000000, mps: 0, mpop: .01, isOpportunity: 1, isBusiness: 1,
			description: "Get where you're going faster with a private driver." }, },
		{ id: 38, price: 20, type: 'upgrade', description: 'New mid/late game click buff',
			item: { id: 82, itemId: "Business Opportunity", name: "Private Jet", price: 100000000, mps: 0, mpop: .01, isOpportunity: 1, isBusiness: 1,
			description: "Why drive when you can fly?" }, },
		{ id: 38, price: 25, type: 'upgrade', description: 'New mid/late game click buff',
			item: { id: 83, itemId: "Business Opportunity", name: "Security Forces", price: 10000000000, mps: 0, mpop: .01, isOpportunity: 1, isBusiness: 1,
			description: "You have made a lot of enemies.  Protect yourself." }, },

		// Office Supplies and tier 1 - 4 upgrades
		{ id: 0, price: 10, type: 'item', description: 'New early game item',
			item: { id: 10, name: "Office Supplies", mps: .1, price: 10 } },
		{ id: 1, price: 5, type: 'upgrade', parent: [0], description: 'Upgrade for Office Supplies',
			item: { id: 55, itemId: 10, name: "Pens and Paper Galore!", price: 250, mps: .05,
				description: "Your employees are happy at the amount of office supplies they can sneak home now!" } },
		{ id: 2, price: 5, type: 'upgrade', parent: [0], description: 'Upgrade for Office Supplies',
			item: { id: 56, itemId: 10, name: "Red Swingline Staplers", price: 500, mps: .1,
				description: "I believe you have my stapler." } },
		{ id: 3, price: 5, type: 'upgrade', parent: [0], description: 'Upgrade for Office Supplies',
			item: { id: 57, itemId: 10, name: "Office Copy Machine", price: 1000, mps: .15,
				description: "Perfect for printing pictures of your tuchus." } },
		{ id: 20, price: 10, type: 'upgrade', parent: [0, 8], description: 'Upgrade for Office Supplies',
			item: { id: 70, itemId: 10, name: "Zero Gravity Space Pens", price: 350000, mps: 1.75, showAfter: [42],
				description: "Your employees are happy they can use pens in zero gravity situations again." } },

		// Software and tier 1 - 4 upgrades
		{ id: 4, price: 15, type: 'item', description: 'New mid game item',
			item: { id: 11, name: "Software", mps: 1, price: 750 }},
		{ id: 5, price: 10, type: 'upgrade', parent: [4], description: 'Upgrade for Software',
			item: { id: 58, itemId: 11, name: "Contoso Office", price: 2000, mps: .4,
				description: "Your employees are happy that they no longer have to use Notepad." } },
		{ id: 6, price: 10, type: 'upgrade', parent: [4], description: 'Upgrade for Software',
			item: { id: 59, itemId: 11, name: "Contoso Office 365", price: 4000, mps: .8,
				description: "Your employees are starting to wish they stuck with Notepad." } },
		{ id: 7, price: 10, type: 'upgrade', parent: [4], description: 'Upgrade for Software',
			item: { id: 60, itemId: 11, name: "Contoso OneOffice Premium 365 2014", price: 8000, mps: 1,
				description: "Your employees see no value in the latest edition when the version from ten years ago still works fine 99.8% of the time." } },
		{ id: 19, price: 15, type: 'upgrade', parent: [4, 8], description: 'Upgrade for Software',
			item: { id: 61, itemId: 11, name: "Contoso OneOffice PremiumDrive x365Box 2014 For Business Enterprise Edition", price: 1000000, mps: 20, showAfter: [42],
				description: "Your employees now hate you." } },

		// Company Car and tier 1 - 4 upgrades
		{ id: 26, price: 35, type: 'item', description: 'New mid game item',
			item: { id: 13, name: "Company Car", mps: 6, price: 35000 } },
		{ id: 27, price: 20, type: 'upgrade', parent: [26], description: 'Upgrade for Company Car',
			item: { id: 66, itemId: 13, name: "Electric Car", price: 500000, mps: 4,
				description: "Save money on gas when switching to electric cars." } },
		{ id: 28, price: 20, type: 'upgrade', parent: [26], description: 'Upgrade for Company Car',
			item: { id: 67, itemId: 13, name: "Solar Powered", price: 750000, mps: 8,
				description: "Save money on electric bill by harnessing energy from the sun." } },
		{ id: 29, price: 20, type: 'upgrade', parent: [26], description: 'Upgrade for Company Car',
			item: { id: 68, itemId: 13, name: "Self Driving Cars", price: 1000000, mps: 16,
				description: "Get extra work done while your car drives by itself." } },
		{ id: 30, price: 35, type: 'upgrade', parent: [26, 8], description: 'Upgrade for Company Car',
			item: { id: 69, itemId: 13, name: "Flying Cars", price: 500000000, mps: 750, showAfter: [42],
				description: "Save money on wheels and cut down on transportation time by flying over water instead of driving around it." } },

		// Space Station and tier 1 - 4 upgrades
		{ id: 21, price: 100, type: 'item', description: 'New end game item',
			item: { id: 12, name: "Space Station", mps: 3000, price: 50000000 }},
		{ id: 22, price: 50, type: 'upgrade', parent: [21], description: 'Upgrade for Space Station',
			item: { id: 62, itemId: 12, name: "Teleporters", price: 5000000000, mps: 3000,
				description: "Add easy access to your space stations helps reduce transportation costs." } },
		{ id: 23, price: 50, type: 'upgrade', parent: [21], description: 'Upgrade for Space Station',
			item: { id: 63, itemId: 12, name: "Personal Army", price: 10000000000, mps: 8000,
				description: "Outfitting your station with a highly trained army will reduce the chance of alien attacks." } },
		{ id: 24, price: 50, type: 'upgrade', parent: [21], description: 'Upgrade for Space Station',
			item: { id: 64, itemId: 12, name: "Research Lab", price: 15000000000, mps: 20000,
				description: "Conduct any kind of research and tests you want without being bound to the laws of Earth!" } },
		{ id: 25, price: 100, type: 'upgrade', parent: [21, 8], description: 'Upgrade for Space Station',
			item: { id: 65, itemId: 12, name: "Giant Death-Ray", price: 25000000000, mps: 45000, showAfter: [42],
				description: "Destroy all who oppose you." } },

		// unlock tier 4
		{ id: 8, price: 15, type: 'upgrade', description: 'Unlock 4th Tier Upgrades For Base Items',
			item: { id: 42, itemId: "Money/Second", name: "Space Program", price: 50000000000, isAchievement: 1, per: .05, showAfter: [41, 35], isBusiness: 1,
			description: "Don't just shoot for the moon, mine it for minerals first." }},

		// tier 4
		{ id: 9, price: 1, type: 'upgrade', parent: [8], description: '4th Tier Upgrade for Minimum Wage Workers',
			item: { id: 45, itemId: 0, name: "Cloning", price: 400000, mps: 1.5, showAfter: [42],
			description: "Don't hire employees - create them!" } },
		{ id: 10, price: 2, type: 'upgrade', parent: [8], description: '4th Tier Upgrade for Cubicle.',
			item: { id: 46, itemId: 1, name: "Condensed Space", price: 1500000, mps: 5, showAfter: [42],
			description: "By replacing your cubicles with cramped cells, you can fit more employees in your offices." } },
		{ id: 11, price: 3, type: 'upgrade', parent: [8], description: '4th Tier Upgrade for Hardware',
			item: { id: 48, itemId: 7, name: "Space Tech", price: 75000000, mps: 100, showAfter: [42],
			description: "Employees can finally get work done when their hardware isn't made out of stone knives and bearskins." } },
		{ id: 12, price: 4, type: 'upgrade', parent: [8], description: '4th Tier Upgrade for Salary Employee',
			item: { id: 47, itemId: 2, name: "Shock Collars", price: 15000000, mps: 30, showAfter: [42],
			description: "Don't let your best employees leave through any means necessary." } },
		{ id: 13, price: 5, type: 'upgrade', parent: [8], description: '4th Tier Upgrade for HR Department',
			item: { id: 49, itemId: 9, name: "Holding Cells", price: 75000000, mps: 100, showAfter: [42],
			description: "Put problem employees in the futuristic version of a dungeon." } },
		{ id: 14, price: 6, type: 'upgrade', parent: [8], description: '4th Tier Upgrade for Accounting Department',
			item: { id: 50, itemId: 4, name: "Astro Mining", price: 250000000, mps: 300, showAfter: [42],
			description: "Your Accounting Department's latest business strategy." } },
		{ id: 15, price: 7, type: 'upgrade', parent: [8], description: '4th Tier Upgrade for Benefits Package',
			item: { id: 51, itemId: 5, name: "Death in Space Insurance", price: 500000000, mps: 550, showAfter: [42],
			description: "Your employees are happy that their loved ones will be financially safe in case of loss of life in space." } },
		{ id: 16, price: 8, type: 'upgrade', parent: [8], description: '4th Tier Upgrade for Upper Management',
			item: { id: 52, itemId: 3, name: "Spaceship Captains", price: 1000000000, mps: 1000, showAfter: [42],
			description: "Finally a real use for upper management!" } },
		{ id: 17, price: 9, type: 'upgrade', parent: [8], description: '4th Tier Upgrade for Executive',
			item: { id: 53, itemId: 6, name: "Fleet Admiral", price: 2000000000, mps: 2250, showAfter: [42],
			description: "Your executives now have a roadmap of what planets to mine for years to come." } },
		{ id: 18, price: 10, type: 'upgrade', parent: [8], description: '4th Tier Upgrade for Office Building',
			item: { id: 54, itemId: 8, name: "Space Station", price: 5000000000, mps: 5000, showAfter: [42],
			description: "Land is getting scarce on the planet surface, so expanding your offices to the outer reaches of the galaxy cuts down heavily on expenses." } },
		
		// Business Connections Upgrade
		{ id: 34, price: 100, type: 'upgrade', description: 'Increase the max boost from Business Connections',
			item: { id: 77, itemId: "Business Connections", name: "Networking 101", price: 10000000, isBusiness: 1, isBcBoost: true, bcBoost: .25,
			description: "Learn basic networking concepts to help increase the strength of your business connections." }},
		{ id: 35, price: 100, type: 'upgrade', parent: [34], description: 'Increase the max boost from Business Connections',
			item: { id: 78, itemId: "Business Connections", name: "Update LinkedIn", price: 50000000, isBusiness: 1, isBcBoost: true, bcBoost: .25, showAfter: [77],
			description: "Keep your LinkedIn profile up to date to find more connections and achieve maximum exposure." }},
		{ id: 36, price: 100, type: 'upgrade', parent: [35], description: 'Increase the max boost from Business Connections',
			item: { id: 79, itemId: "Business Connections", name: "Business Cards", price: 200000000, isBusiness: 1, isBcBoost: true, bcBoost: .25, showAfter: [78],
			description: "Look at that subtle off-white coloring. The tasteful thickness of it. Oh, my God. It even has a watermark." }},
		{ id: 37, price: 100, type: 'upgrade', parent: [36], description: 'Increase the max boost from Business Connections',
			item: { id: 80, itemId: "Business Connections", name: "Sleep with Marissa Mayer", price: 250000000, isBusiness: 1, isBcBoost: true, bcBoost: .25, showAfter: [79],
			description: "Maximize your business connections by making her scream 'Yahoo!'" }},
	];	

	this.ships = [
		{ id: 0, name: "Drone", attack: 0, defense: 1, 
			cost: [ { name: 'Money', price: 30000 }, { id: 0, price: 1 }, { id: 1, price: 1 } ]},
		{ id: 1, name: "Scout", attack: 1, defense: 2, 
			cost: [ { name: 'Money', price: 150000 }, { id: 0, price: 2 }, { id: 1, price: 1 } ]},
		{ id: 2, name: "Fighter", attack: 5, defense: 5, 
			cost: [ { name: 'Money', price: 500000 }, { id: 0, price: 10 }, { id: 1, price: 5 } ]},
		{ id: 3, name: "Bomber", attack: 15, defense: 2, 
			cost: [ { name: 'Money', price: 1500000 }, { id: 0, price: 15 }, { id: 1, price: 8 } ]},
	];

	this.resources = [
		{ id: 0, name: 'Titanium', proportion: 100 },
		{ id: 1, name: 'Diamond', proportion: 33 },
		{ id: 2, name: 'Rhodium', proportion: 1 },
		{ id: 3, name: 'Platinum', proportion: 66 },
		{ id: 4, name: 'Gold', proportion: 50 }
	];

	this.planets = [
		{ id: 0, name: 'Earth', x: 0, y: 0 },
		{ id: 1, name: 'Mercury', x: -2, y: 0 },
		{ id: 2, name: 'Venus', x: -1, y: 0 },
		{ id: 3, name: 'Mars', x: 1, y: 0, enemies: [ { id: 2, count: 15 } ] }
	];

	this.buildings = [
		{ id: 0, name: 'Colony', cost: [ { name: 'Money', price: 500000 }, { id: 0, price: 10 }, { id: 3, price: 8 } ] },
		{ id: 1, name: 'Giant Shaft Mine', cost: [ { name: 'Money', price: 100000000 } ] },
		{ id: 2, name: 'Trade Route', cost: [ { name: 'Money', price: 250000000 }, { id: 0, price: 100 }, { id: 3, price: 100 } ] }
	];

	this.getItem = function(id) {
		return search(this.items, "id", id,
			{ id: -1, name: "", mps: 0, price: 0 });
	}

	this.getUpgrade = function(id) {
		return search(this.upgrades, "id", id,
			{ id: -1, itemId: -1, name: "", description: "", price: 0, mps: 0 });
	}

	this.getKnowledgeItem = function(id) {
		return search(this.knowledgeItems, "id", id,
			{ id: -1, price: 0 });
	}
});

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
	// Discovered planets are stored here as { id: 0, buildings: [], isConquered: t/f }
	this.planets = [];

	this.money = 0;
	this.companyName = "Giant Shaft Enterprises";

	this.vcFunding = 0;
	this.businessConnections = 0;

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
				this.resources.push({id: items[0].id, count: 1});
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

idleGame.service('cacheService', function($rootScope, gameService, playerService) {
	this.cachedMps = 0;
	this.cachedClickPower = 0;
	this.lowestAmountCache = 0;
	this.cachedBcBoost = 0;
	this.cachedMaxBcBoost = 0;
	this.items = [];

	this.getMps = function() {
		return this.cachedMps;
	}

	this.clickPower = function() {
		return this.cachedClickPower;
	}

	var self = this;
	$rootScope.$on('updateCache', function() {
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
