function StoreController($scope, gameService, playerService) {
	$scope.items = gameService.items;
	$scope.boughtItems = playerService.items;
	
	$scope.currentPrice = function(id) {
		var priceIncrease = .15; // 15% per item already bought
		return gameService.getItem(id).price + (playerService.getItem(id).count * gameService.getItem(id).price * priceIncrease);
	}
	
	$scope.getMps = function(id) {
		return gameService.getItem(id).mps;
	}

	$scope.getCount = function(id) {
		return playerService.getItem(id).count;
	}

	$scope.cantBuy = function(id) {
		return $scope.currentPrice(id) > playerService.money;
	};
	
	$scope.buy = function($event, id) {
		var count = 1;
		if($event.shiftKey) count = 10;

		for(var i = 0; i < count; i++) {
			if(!$scope.cantBuy(id)) {
				playerService.money -= $scope.currentPrice(id);
				playerService.buyItem(id);
			}
		}
	};
};