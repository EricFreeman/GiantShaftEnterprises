function MessageController($scope, $timeout) {
	$scope.$on('displayMessage', function(event, data) { 
		$scope.messages.push({ text: data, dateCreated: new Date() });

		$timeout(function() { 
			$('.messageStart').addClass('messageEnd');
		}, 500);
		$timeout(function() {
			$scope.messages.shift();
		}, 4500);
	});

	$scope.messages = [];
};