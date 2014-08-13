function HelpController($scope) {
	$scope.displayHelp = false;
	$scope.selectedTopic = null;
	$scope.selectedQuestion = null;

	$scope.topics = [
		{ name: 'Quick Start', questions: [
			{ name: 'What is the point?', answer: 'Like any business, earn boatloads money!' },
			{ name: 'What is a Business Opportunity?', answer: 'The big button near the top of the page.' },
			{ name: 'What should I do first?', answer: 'Complete business opportunities for money, buy items in the first column on the business tab to earn money over time, and then upgrade the items with upgrades from the second column.' },
			{ name: 'What should I do second?', answer: 'Once you have a good amount of Business Knowledge saved up, you should think about prestiging.' },
			{ name: 'What is prestiging?', answer: 'Prestiging means starting a new business from the menu and using your Business Knowledge to unlock powerful items, upgrades, and even new sections of the game! (hint: buy Space Program first)' },
		]},
		{ name: 'Space', questions: [
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