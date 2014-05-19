describe("UpgradesController", function() {
	var $scope;
    var $provide;

    beforeEach(angular.mock.module('idleGame'));

    beforeEach(angular.mock.module(function (_$provide_) {
        $provide = _$provide_;
    }));

    beforeEach(angular.mock.inject(function($rootScope, $controller, $q){
        $scope = $rootScope.$new();
        $controller('UpgradesController', { $scope: $scope });
        $rootScope.$apply();
    }));

    it("should actually exist", function() {
		expect($scope).not.toBeNull();
	});

	it("can't buy upgrade if you have less money than the item costs", function() {
		inject(function(playerService) {
			playerService.items = [{id: 0, count: 1}];
			playerService.upgrades = [];
			playerService.money = 0;
		 	expect($scope.cantBuy(0)).toBe(true);
		});
	});

	it("can buy upgrade if you have as much money as the item costs", function() {
		inject(function(playerService, gameService) {
			playerService.items = [{id: 0, count: 1}];
			playerService.upgrades = [];
			playerService.money = gameService.getUpgrade(0).price;
		 	expect($scope.cantBuy(0)).toBe(false);
		});
	});

	it("tells you when you already bought item", function() {
		inject(function(playerService, gameService) {
			playerService.items = [{id: 0, count: 1}];
			playerService.upgrades = [];
			playerService.money = gameService.getUpgrade(0).price;
		 	expect($scope.cantBuy(0)).toBe(false);
		 	$scope.buy(0);
		 	expect($scope.cantBuy(0)).toBe(true);
		 	expect($scope.alreadyBought(0)).toBe(true);
		});
	});

	it("doesn't show upgrade for item you don't own", function() {
		inject(function(playerService) {
			playerService.items = [];
			playerService.upgrades = [];
		 	expect($scope.canShow({itemId: 0})).toBe(false);
		});
	});

	it("does show upgrade for item you own", function() {
		inject(function(playerService) {
			playerService.items = [{id: 0, count: 1}];
			playerService.upgrades = [];
		 	expect($scope.canShow({itemId: 0})).toBe(true);
		});
	});
});