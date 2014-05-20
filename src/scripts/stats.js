function StatsController($scope, gameService, playerService, mpsService) {
	$scope.playerService = playerService;

	$scope.totalBuildings = playerService.items.reduce(function(prev, curr) {return prev += curr.count}, 0);
	
	$scope.totalUpgrades = playerService.upgrades.length;
	$scope.possibleUpgrades = gameService.upgrades.length;

	$scope.totalAchievements = playerService.achievements.length;
	$scope.possibleAchievements = gameService.achievements.length;
};