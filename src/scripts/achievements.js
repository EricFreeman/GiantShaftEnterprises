function AchievementsController($scope, gameService, playerService, moneyService) {
	$scope.achievements = gameService.achievements;

	$scope.hasEarned = function(id) {
		return playerService.hasAchievement(id);
	}
};