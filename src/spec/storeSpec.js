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

	it("should not be able to buy stuff when broke", function() {
		inject(function(playerService) {
			expect($scope.getCount(0)).toBe(0);
			playerService.items = [];
			playerService.money = 0;
		 	$scope.buy({shiftKey: false}, 0);
		 	expect($scope.getCount(0)).toBe(0);
		});
	});

	it("should not be able to buy stuff in bulk when you're broke", function() {
		inject(function(playerService) {
			expect($scope.getCount(0)).toBe(0);
			playerService.items = [];
			playerService.money = 0;
		 	$scope.buy({shiftKey: true}, 0);
		 	expect($scope.getCount(0)).toBe(0);
		});
	});

	it("should be able to buy stuff when you're rich", function() {
		inject(function(playerService) {
			expect($scope.getCount(0)).toBe(0);
			playerService.items = [];
			playerService.money = 500;
		 	$scope.buy({shiftKey: false}, 0);
		 	expect($scope.getCount(0)).toBe(1);
		});
	});

	it("should be able to buy stuff in bulk when you're rich", function() {
		inject(function(playerService) {
			expect($scope.getCount(0)).toBe(0);
			playerService.items = [];
			playerService.money = 500;
		 	$scope.buy({shiftKey: true}, 0);
		 	expect($scope.getCount(0)).toBe(10);
		});
	});
});