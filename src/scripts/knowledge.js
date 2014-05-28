function KnowledgeController($rootScope, $scope, gameService, playerService, cacheService) {
	$scope.items = gameService.knowledgeItems;

	$scope.canBuy = function(id) {
		var enoughMoney = gameService.getKnowledgeItem(id).price <= playerService.knowledge;
		return enoughMoney && !$scope.alreadyBought(id);
	}

	$scope.alreadyBought = function(id) {
		return playerService.getKnowledgeItem(id).id != -1;
	}

	$scope.buy = function(id) {
		var item = gameService.getKnowledgeItem(id);

		if(id > -1 && $scope.canBuy(id)) {
			playerService.money -= item.price;
			playerService.unlockedKnowledgeItems.push(item);

			if(item.type === 'building') {
				gameService.items.push(item.item);
				gameService.items.sort(function(a, b) { return a.price-b.price; });
			}
			else if(item.type === 'upgrade') {
				gameService.upgrades.push(item.item);
				gameService.upgrades.sort(function(a, b) { return a.price-b.price; });
			}
		}
	}
};