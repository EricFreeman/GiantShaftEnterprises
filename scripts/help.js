function HelpController($scope) {
	$scope.displayHelp = false;
	$scope.selectedTopic = null;
	$scope.selectedQuestion = null;

	$scope.topics = [
		{ name: 'Quick Start', questions: [
			{ name: 'What is the point?', answer: 'Like any business, earn boatloads money!' },
			{ name: 'What is a Business Opportunity?', answer: 'The big button near the top of the page.' },
			{ name: 'What should I do first?', answer: 'Follow along with the tutorial and make sure to read all the text.  I swear, there is not that much and it really will help answer many of your initial questions.' },
			{ name: 'What should I do second?', answer: 'Complete business opportunities for money, buy items in the first column on the business tab to earn money over time, and then upgrade the items with upgrades from the second column.' },
			{ name: 'What should I do third?', answer: 'Once you have a good amount of Business Knowledge saved up, you should think about prestiging.' },
		]},
		{ name: 'Prestige', questions: [
			{ name: 'What is prestiging?', answer: 'Prestiging means starting a new business and using your Business Knowledge to unlock powerful items, upgrades, and even new sections of the game!' },
			{ name: 'How do I prestige?', answer: 'The "Start New Business" button in the menu.' },
			{ name: 'When should I prestige?', answer: 'That is entirely up to you.  I would wait until I had a couple hundred BK or so.' },
			{ name: 'What should I buy?', answer: 'Space Program is a fantastic upgrade to start with.  Also, if you buy any of the new items, you should make sure to buy all the upgrades for them as well.  The Tier 4 upgrades for current buildings would also be a good investment.' },
		]},
		{ name: 'Space', questions: [
			{ name: 'How do I unlock it?', answer: 'Purchase Space Program with business knowledge.' },
			{ name: 'What is the point?', answer: 'Set up colonies on other planets (through force or diplomacy) to help you earn money and research.  Research unlocks powerful new perks.' },
			{ name: 'What benefit is there to taking the diplomatic route?', answer: 'None, really.  The only reason to take the diplomatic route is to not be a dick.' },
			{ name: 'I conquered all the planets and unlocked everything.  Now what?', answer: 'Now you can move on with real life!  Or wait for updates.' },
		]},
	];

	$scope.selectTopic = function(topic) {
		$scope.selectedTopic = topic;
	}

	$scope.selectQuestion = function(question) {
		$scope.selectedQuestion = question;
	}

	$scope.closeHelp = function() {
		$scope.displayHelp = false;
		$scope.selectedTopic = null;
		$scope.selectedQuestion = null;
	}
}