function UpgradesController($scope, gameService, playerService) {
	$scope.upgrades = gameService.upgrades;
	$scope.boughtUpgrades = playerService.upgrades;

	$scope.cantBuy = function(id) {
		var notEnoughMoney = gameService.getUpgrade(id).price > playerService.money;
		var alreadyOwn = playerService.getUpgrade(id).id != -1;
		return notEnoughMoney || alreadyOwn;
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
	$scope.canShow = function(id) {
		return playerService.getItem(id).count > 0;
	}
};