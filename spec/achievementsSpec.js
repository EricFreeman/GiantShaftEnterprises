describe("StatsController", function() {
	var $scope;
    var $provide;

    beforeEach(angular.mock.module('idleGame'));

    beforeEach(angular.mock.module(function (_$provide_) {
        $provide = _$provide_;
    }));

    beforeEach(angular.mock.inject(function($rootScope, $controller, $q){
        $scope = $rootScope.$new();
        $controller('AchievementsController', { $scope: $scope });
        $rootScope.$apply();
    }));

    it("should actually exist", function() {
		expect($scope).not.toBeNull();
	});

	it("should be able to award achievements", function() {
		inject(function(playerService) {
			playerService.achievements = [];
			playerService.awardAchievement(0);
		 	expect($scope.hasEarned(0)).toBe(true);
		});
	});

	it("should not award achievements more than once", function() {
		inject(function(playerService) {
			playerService.achievements = [];
			playerService.awardAchievement(0);
			playerService.awardAchievement(0);
		 	expect($scope.hasEarned(0)).toBe(true);
		 	expect(playerService.achievements.length).toBe(1);
		});
	});
});