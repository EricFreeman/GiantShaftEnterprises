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
};