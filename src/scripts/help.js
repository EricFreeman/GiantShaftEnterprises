function HelpController($scope) {
	$scope.displayHelp = true;
	$scope.selectedTopic = null;
	$scope.selectedQuestion = null;

	$scope.topics = [
		{ name: 'Quick Start', questions: [
			{ name: 'What is the point?', answer: 'Like any business, earn boatloads money!' },
			{ name: 'What is a Business Opportunity?', answer: 'The big button near the top of the page.' },
			{ name: 'What should I do first?', answer: 'Complete business opportunities for money, buy items in the first column on the business tab to earn money over time, and then upgrade the items with upgrades from the second column.' },
			{ name: 'What should I do second?', answer: 'Once you have a good amount of Business Knowledge saved up, you should think about prestiging.' },
			{ name: 'What is prestiging?', answer: 'Prestiging means starting a new business from the menu and using your Business Knowledge to unlock powerful items, upgrades, and even new sections of the game! (hint: buy Space Program first)' },
		]}
	];

	$scope.selectTopic = function(topic) {
		$scope.selectedTopic = topic;
	}

	$scope.selectQuestion = function(question) {
		$scope.selectedQuestion = question;
	}
}