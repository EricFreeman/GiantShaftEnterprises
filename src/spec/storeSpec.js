describe("StoreController", function() {
	var $scope;
    var $provide;

    beforeEach(angular.mock.module('idleGame'));

    beforeEach(angular.mock.module(function (_$provide_) {
        $provide = _$provide_;
    }));

    beforeEach(angular.mock.inject(function($rootScope, $controller, $q){
        var mockPlayerService = {
            money: 0,
            items: [],
            getItem: function(id) { return {count: sessionStorage["money"]}; }
        };

        $provide.value('playerService', mockPlayerService);
        $scope = $rootScope.$new();
        $controller('StoreController', { $scope: $scope });
        $rootScope.$apply();
    }));

	it("should actually exist", function() {
		expect($scope).not.toBeNull();
	});

	it("should not be able to buy stuff when broke", function() {
		expect($scope.boughtItems.length).toBe(0);
		sessionStorage["money"] = 0;
	 	$scope.buy({shiftKey: false}, 0);
	 	expect($scope.boughtItems.length).toBe(0);
	});

	it("should be able to buy stuff when you're rich", function() {
		expect($scope.boughtItems.length).toBe(0);
		sessionStorage["money"] = 500;
	 	$scope.buy({shiftKey: false}, 0);
	 	expect($scope.boughtItems.length).toBe(1);
	});
});