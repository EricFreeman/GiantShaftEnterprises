function MenuController($scope, playerService, saveService) {
	$scope.playerService = playerService;

	$scope.saveGame = function() {
		saveService.saveGame();
	}

	$scope.resetGame = function() {
		localStorage.clear();
	}

	$scope.updates = [
		{ title: '5/21/2014', description: 'Added this page!  And toast messages.' },
		{ title: '5/9/2014 - 5/21/2014', description: 'I am not writing a description for the first almost two weeks of production, but rest assured I did a lot of work during this time.'}
	];
};