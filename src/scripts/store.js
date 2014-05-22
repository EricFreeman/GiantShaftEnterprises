function StoreController($scope, gameService, playerService) {
	$scope.items = gameService.items;
	$scope.boughtItems = playerService.items;
	
	$scope.currentPrice = function(id) {
		var priceIncrease = .2; // 20% per item already bought
		return gameService.getItem(id).price + (playerService.getItem(id).count * gameService.getItem(id).price * priceIncrease);
	}
	
	$scope.getMps = function(id) {
		return gameService.getItem(id).mps + $scope.getUpgradesMps(id);
	}

	// Get the mps that should be added in from the upgrades for the specified item
	$scope.getUpgradesMps = function(id) {
		return playerService.upgrades.reduce(function(prev, cur) {
			var upgrade = gameService.getUpgrade(cur.id);
			return prev += upgrade.itemId == id ? upgrade.mps : 0;
		}, 0);
	};

	$scope.getCount = function(id) {
		return playerService.getItem(id).count;
	}

	$scope.cantBuy = function(id) {
		return $scope.currentPrice(id) > playerService.money;
	};

	$scope.buy = function($event, id) {
		var count = 1;
		if($event.shiftKey) count = 10;
		else if($event.altKey) count = 100;

		for(var i = 0; i < count; i++) {
			if(!$scope.cantBuy(id)) {
				playerService.money -= $scope.currentPrice(id);
				playerService.buyItem(id);
			}
		}
	};
};