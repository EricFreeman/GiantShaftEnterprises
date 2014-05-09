function GameController($scope, $timeout) {
	$scope.money = 0;
	$scope.fps = 10;

	// All base items (not upgrades) you can purchase are defined here
	$scope.items = [
		{ "name" : "minimum wage worker", "count" : 1, "mps" : 1 },
		{ "name" : "cubicals", "count" : 5, "mps" : 5 },
		{ "name" : "salary employee", "count" : 2, "mps" : 50}
	];

	// Your cumulitive mps (money per second) is the combination of the 
	// count of each item multiplied by the item's individual mps
	$scope.mps = function() {
		rtn = $scope.items.reduce(function (prev, cur) {
			return prev += cur.mps * cur.count;
		}, 0);
	};
	
	// Game Loop
	$scope.update = function() {
		$scope.money += ($scope.mps() / $scope.fps);
		$timeout($scope.update, 1000 / $scope.fps);
	};
	
	// Start game loop
	$scope.update();
}