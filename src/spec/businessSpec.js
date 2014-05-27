describe("BusinessController", function() {
	var $scope;
    var $provide;

    beforeEach(angular.mock.module('idleGame'));

    beforeEach(angular.mock.module(function (_$provide_) {
        $provide = _$provide_;
    }));

    beforeEach(angular.mock.inject(function($rootScope, $controller, $q){
        $scope = $rootScope.$new();
        $controller('BusinessController', { $scope: $scope });
        $rootScope.$apply();
    }));

    it("should actually exist", function() {
		expect($scope).not.toBeNull();
	});

	// BUSINESS

	it("should be able to do business", function() {
		inject(function(playerService) {
			playerService.money = 0;
			$scope.doBusiness();
		 	expect(playerService.money).not.toBe(0);
		});
	});

	it("should change opportunity when you do business", function() {
		inject(function(playerService) {
			var previousOpportunity = $scope.opportunity;
			$scope.doBusiness(previousOpportunity);
		 	expect($scope.opportunity).not.toBe(previousOpportunity);
		});
	});

	// STORE

	it("should not be able to buy stuff you have less money than the item costs", function() {
		inject(function(playerService) {
			expect($scope.getCount(0)).toBe(0);
			playerService.items = [];
			playerService.money = 0;
		 	$scope.buyStoreItem({shiftKey: false}, 0);
		 	expect($scope.getCount(0)).toBe(0);
		});
	});

	it("should not be able to buy stuff in bulk when you have less money than the item costs", function() {
		inject(function(playerService) {
			expect($scope.getCount(0)).toBe(0);
			playerService.items = [];
			playerService.money = 0;
		 	$scope.buyStoreItem({shiftKey: true}, 0);
		 	expect($scope.getCount(0)).toBe(0);
		});
	});

	it("should be able to buy stuff when you have as much money as the item costs", function() {
		inject(function(playerService, gameService) {
			expect($scope.getCount(0)).toBe(0);
			playerService.items = [];
			playerService.money = gameService.getItem(0).price;
		 	$scope.buyStoreItem({shiftKey: false}, 0);
		 	expect($scope.getCount(0)).toBe(1);
		});
	});

	it("should be able to buy stuff in bulk when you have enough money for all of them", function() {
		inject(function(playerService, gameService) {
			expect($scope.getCount(0)).toBe(0);
			playerService.items = [];
			// multiply by 50 instead of 10 to make up for price increase as you buy more of particular item
			playerService.money = gameService.getItem(0).price * 50;
		 	$scope.buyStoreItem({shiftKey: true}, 0);
		 	expect($scope.getCount(0)).toBe(10);
		});
	});

	// UPGRADES

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
		 	expect($scope.cantBuyUpgrade(0)).toBe(false);
		});
	});

	it("tells you when you already bought item", function() {
		inject(function(playerService, gameService) {
			playerService.items = [{id: 0, count: 1}];
			playerService.upgrades = [];
			playerService.money = gameService.getUpgrade(0).price;
		 	expect($scope.cantBuyUpgrade(0)).toBe(false);
		 	$scope.buy(0);
		 	expect($scope.cantBuyUpgrade(0)).toBe(true);
		 	expect($scope.alreadyBought(0)).toBe(true);
		});
	});

	it("doesn't show upgrade for item you don't own", function() {
		inject(function(playerService) {
			playerService.items = [];
			playerService.upgrades = [];
		 	expect($scope.canShowUpgrade({itemId: 0})).toBe(false);
		});
	});

	it("does show upgrade for item you own", function() {
		inject(function(playerService) {
			playerService.items = [{id: 0, count: 1}];
			playerService.upgrades = [];
		 	expect($scope.canShowUpgrade({itemId: 0})).toBe(true);
		});
	});
});