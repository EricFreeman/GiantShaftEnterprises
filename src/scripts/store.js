function StoreController($scope, gameService) {
	$scope.items = gameService.items;
	
	$scope.currentPrice = function(id) {
		var priceIncrease = .15; // 15% per item already bought
		return gameService.items[id].price + (gameService.items[id].count * gameService.items[id].price * priceIncrease);
	}
	
	$scope.cantBuy = function(id) {
		return $scope.currentPrice(id) > gameService.money;
	};
	
	$scope.buy = function(id) {
		if(!$scope.cantBuy(id)) {
			gameService.money -= gameService.items[id].price;
			gameService.items[id].count++;
		}
	};
};