describe("StoreController", function() {
	var $scope;
    var $provide;

    beforeEach(angular.mock.module('idleGame'));

    beforeEach(angular.mock.module(function (_$provide_) {
        $provide = _$provide_;
    }));

    beforeEach(angular.mock.inject(function($rootScope, $controller, $q){
        $scope = $rootScope.$new();
        $controller('StoreController', { $scope: $scope });
        $rootScope.$apply();
    }));

	it("should actually exist", function() {
		expect($scope).not.toBeNull();
	});

	it("should not be able to buy stuff you have less money than the item costs", function() {
		inject(function(playerService) {
			expect($scope.getCount(0)).toBe(0);
			playerService.items = [];
			playerService.money = 0;
		 	$scope.buy({shiftKey: false}, 0);
		 	expect($scope.getCount(0)).toBe(0);
		});
	});

	it("should not be able to buy stuff in bulk when you have less money than the item costs", function() {
		inject(function(playerService) {
			expect($scope.getCount(0)).toBe(0);
			playerService.items = [];
			playerService.money = 0;
		 	$scope.buy({shiftKey: true}, 0);
		 	expect($scope.getCount(0)).toBe(0);
		});
	});

	it("should be able to buy stuff when you have as much money as the item costs", function() {
		inject(function(playerService, gameService) {
			expect($scope.getCount(0)).toBe(0);
			playerService.items = [];
			playerService.money = gameService.getItem(0).price;
		 	$scope.buy({shiftKey: false}, 0);
		 	expect($scope.getCount(0)).toBe(1);
		});
	});

	it("should be able to buy stuff in bulk when you have enough money for all of them", function() {
		inject(function(playerService, gameService) {
			expect($scope.getCount(0)).toBe(0);
			playerService.items = [];
			// multiply by 50 instead of 10 to make up for price increase as you buy more of particular item
			playerService.money = gameService.getItem(0).price * 50;
		 	$scope.buy({shiftKey: true}, 0);
		 	expect($scope.getCount(0)).toBe(10);
		});
	});
});