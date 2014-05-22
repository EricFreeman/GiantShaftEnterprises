function MenuController($scope, playerService, saveService) {
	$scope.playerService = playerService;

	$scope.saveGame = function() {
		saveService.saveGame();
	}

	$scope.resetGame = function() {
		localStorage.clear();
	}
};