describe("GameLoopController", function() {
	var $scope;
    var $provide;

    beforeEach(angular.mock.module('idleGame'));

    beforeEach(angular.mock.module(function (_$provide_) {
        $provide = _$provide_;
    }));

    beforeEach(angular.mock.inject(function($rootScope, $controller, $q){
        $scope = $rootScope.$new();
        $controller('GameLoopController', { $scope: $scope });
        $rootScope.$apply();
    }));

    it("should actually exist", function() {
		expect($scope).not.toBeNull();
	});

	it("mps should be 0 with no items", function() {
		inject(function(playerService) {
			playerService.items = [];
		 	expect($scope.getMps()).toBe(0);
		});
	});

	it("mps should be over 0 with no items", function() {
		inject(function(playerService, gameService) {
			playerService.items = [{id: 0, count: 1}];
		 	expect($scope.getMps()).not.toBe(0);
		});
	});

	it("no upgrades doesn't change your mps", function() {
		inject(function(playerService, gameService) {
			playerService.items = [{id: 0, count: 1}];
			playerService.upgrades = [];
		 	expect($scope.getMps()).toBe(gameService.getItem(0).mps);
		});
	});

	it("having upgrades does change your mps", function() {
		inject(function(playerService, gameService) {
			playerService.items = [{id: 0, count: 1}];
			playerService.upgrades = [{id: 0}];
		 	expect($scope.getMps()).not.toBe(gameService.getItem(0).mps);
		});
	});
});