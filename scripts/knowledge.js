function KnowledgeController($rootScope, $scope, gameService, playerService, cacheService) {
	$scope.items = gameService.knowledgeItems;
	$scope.knowledge = function() { return playerService.knowledge; }
	$scope.playerService = playerService;

	$scope.canBuy = function(id) {
		var enoughMoney = gameService.getKnowledgeItem(id).price <= playerService.knowledge;
		return enoughMoney && !$scope.alreadyBought(id);
	}

	$scope.alreadyBought = function(id) {
		return playerService.getKnowledgeItem(id).id != -1;
	}

	$scope.canShow = function(id) {
		var item = gameService.getKnowledgeItem(id);
		var hasAllParents = true;

		if(item.parent) {
			for(var i = 0; i < item.parent.length; i++) {
				hasAllParents &= playerService.getKnowledgeItem(item.parent[i]).id >= 0
			}
		}

		return hasAllParents && (!$scope.alreadyBought(id) || !playerService.hideBoughtUpgrades);
	}

	$scope.buy = function(id) {
		var item = gameService.getKnowledgeItem(id);

		if(id > -1 && $scope.canBuy(id)) {
			playerService.knowledge -= item.price;
			playerService.unlockedKnowledgeItems.push({id: item.id});

			if(item.type === 'item') {
				gameService.items.push(item.item);
				gameService.items.sort(function(a, b) { return a.price-b.price; });
			}
			else if(item.type === 'upgrade') {
				gameService.upgrades.push(item.item);
				gameService.upgrades.sort(function(a, b) { return a.price-b.price; });
			}

			$rootScope.$broadcast('updateCache');
		}
	}

	$scope.buyVcFunding = function(amount) {
		if(amount <= playerService.knowledge) {
			playerService.knowledge -= amount;
			playerService.vcFunding += amount;
			playerService.money += playerService.vcPointsToMoney(amount);
		}
	}

	$scope.buyBusinessConnections = function(amount) {
		var bcPrice = 2;
		var cost = amount * bcPrice;

		if(cost <= playerService.knowledge) {
			playerService.knowledge -= cost;
			playerService.businessConnections += amount;
			$rootScope.$broadcast('updateCache');
		}
	}

	$scope.getBcBoost = function() {
		return cacheService.cachedBcBoost;
	}

	$scope.getMaxBcBoost = function() {
		return cacheService.cachedMaxBcBoost;
	}
};