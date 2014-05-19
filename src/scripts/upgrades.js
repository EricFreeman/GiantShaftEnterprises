function UpgradesController($scope, gameService, playerService) {
	$scope.upgrades = gameService.upgrades;
	$scope.boughtUpgrades = playerService.upgrades;

	$scope.alreadyBought = function(id) {
		return playerService.getUpgrade(id).id != -1;
	}

	$scope.cantBuy = function(id) {
		var notEnoughMoney = gameService.getUpgrade(id).price > playerService.money;
		return notEnoughMoney || $scope.alreadyBought(id);
	};
	
	$scope.buy = function(id) {
		if(!$scope.cantBuy(id)) {
			var upgrade = gameService.getUpgrade(id);
			playerService.money -= upgrade.price;
			playerService.buyUpgrade(upgrade);
		}
	};

	// Get the name of the item the upgrade applies to.
	// id is the itemId
	$scope.getItemName = function(id) {
		return gameService.getItem(id).name;
	}

	// Only show upgrades for items you've actually bought
	$scope.canShow = function(upgrade) {
		// Make sure you own all pre requisit upgrades for this specific upgrade
		var haveAllPrereq = true;
		if(gameService.getUpgrade(upgrade.id).showAfter) {
			haveAllPrereq = gameService.getUpgrade(upgrade.id).showAfter.reduce(function(prev, cur) {
				return prev && $scope.alreadyBought(cur);
			}, true);
		}

		return haveAllPrereq && (playerService.getItem(upgrade.itemId).count > 0 || upgrade.itemId == "business");
	}
};