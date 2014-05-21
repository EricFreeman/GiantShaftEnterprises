function MessageController($scope, $timeout) {
	$scope.$on('displayMessage', function(event, data) { 
		$scope.messages.push(data);
		$timeout(function() { $('.messageStart').addClass('messageEnd'); }, 500);
	});

	$scope.messages = [];
};