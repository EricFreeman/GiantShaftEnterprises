function AchievementsController($scope, gameService, playerService, mpsService) {
	$scope.achievements = gameService.achievements;

	$scope.hasEarned = function(id) {
		return playerService.hasAchievement(id);
	}
};