var idleGame = angular.module('idleGame', ['ngRoute']);

idleGame.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
			when('/menu', {
				templateUrl: 'menu.html',
				controller: 'MenuController'
			}).
			when('/store', {
				templateUrl: 'store.html',
				controller: 'StoreController'
			}).
			when('/upgrades', {
				templateUrl: 'upgrades.html',
				controller: 'UpgradesController'
			}).
			when('/business', {
				templateUrl: 'business.html',
				controller: 'BusinessController'
			}).
			otherwise({
				redirectTo: '/menu'
			});
	}
]);

idleGame.service('gameService', function() {
	this.fps = 10;
	
	// All base items (not upgrades) you can purchase are defined here
	this.items = [
		{ id: 0, name: "Minimum Wage Worker", mps: .1 , price: 15 },
		{ id: 1, name: "Cubical", mps: .3 , price: 100 },
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
	this.upgrades = [
		{ id: 0, itemId: 0, name: "Positive Reinforcement", price: 500, mps: .05,
			description: "Studies have shown that training employees is the same as training a dog: use lots of positive reinforcement to get them to behave correctly." },
		{ id: 1, itemId: 0, name: "Mentoring Program", price: 1500, mps: .1,
			description: "While reading binder upon binder of information is fun for some people, it is easier to learn and retain information from a good teacher." },
		{ id: 2, itemId: 0, name: "Better Scheduling", price: 30000, mps: .1,
			description: "When all of your minimum wage employees work under 40 hours a week, there's no need to pay them health benefits!" },

		{ id: 3, itemId: 1, name: "Lower Walls", price: 1000, mps: .1,
			description: "Lowering the walls of a cubical will help increase team dynamics and promote synergy!" },
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

//		{ id: 0, itemId: 0, name: "", price: 0, mps: 0, description: "" },
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
	this.money = 15;
	this.companyName = "Default Company";
	
	this.clickPower = function() {
		return 1;
	}

	this.getItem = function(id) {
		return search(this.items, "id", id,
			{ id: -1, count: 0 });
	};

	this.getUpgrade = function(id) {
		return search(this.upgrades, "id", id,
			{ id: -1, itemId: -1, name: "", description: "", price: 0, mps: 0 });
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

// A simple search that will go through the passed in list and find
// the first item that the specified property matches a given value.
// Otherwise it will return a default value
var search = function(list, property, value, def) {
	for(var item in list)
		if(list[item][property] === value)
			return list[item];

	return def;
}