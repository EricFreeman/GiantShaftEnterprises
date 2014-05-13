function GameLoopController($scope, $timeout, gameService) {	
	// Getters to grab values through gameService
	$scope.getCompanyName = function() {
		return gameService.companyName;
	};
	$scope.getMoney = function() {
		return gameService.money;
	};
	$scope.getMps = function() {
		return gameService.mps();
	};
	
	// Game Loop
	$scope.update = function() {
		gameService.money += (gameService.mps() / gameService.fps);
		$timeout($scope.update, 1000 / gameService.fps);
	};
	
	// Start game loop
	$scope.update();
}