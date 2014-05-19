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
});