function BusinessController($scope, gameService, playerService) {
	$scope.possibleOpportunities = [
		"Meet with clients.",
		"Meet with investors.",
		"Conduct business meeting at the golf course.", 
		"Buy $100 steaks on the company card.", 
		"Power nap during meeting.",
		"Analyze information.",
		"Evaluate options.",
		"Meditate.",
		"Prioritize objectives.",
		"Streamline workforce.",
		"Push the envelope.",
		"Break your limits.",
		"Perform market research.",
		"Center your chi.",
		"Attend leadership conference.",
		"Host leadership conference.",
		"Network with business leaders."
	];
	$scope.opportunity = $scope.possibleOpportunities.randomElement();

	$scope.doBusiness = function(curr) {
		playerService.money += playerService.clickPower();

		while($scope.opportunity == curr)
			$scope.opportunity = $scope.possibleOpportunities.randomElement();
	};
};

Array.prototype.randomElement = function () {
    return this[Math.floor(Math.random() * this.length)]
}