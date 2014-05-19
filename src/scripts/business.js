function BusinessController($scope, gameService, playerService, mpsService) {
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
		playerService.money += $scope.clickPower();

		while($scope.opportunity == curr)
			$scope.opportunity = $scope.possibleOpportunities.randomElement();
	};

	$scope.clickPower = function() {
		var basicClickPower = 1;
		var mps = mpsService.getMps();

		return basicClickPower + 
			playerService.upgrades.
				filter(function(d) {
					return d.itemId === "business";
				}).
				reduce(function(prev, cur) {
					return prev += (cur.mpo ? cur.mpo : cur.mpop * mps);
				}, 0);
	}
};

Array.prototype.randomElement = function () {
    return this[Math.floor(Math.random() * this.length)]
}