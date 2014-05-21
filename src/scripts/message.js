function MessageController($scope) {
	$scope.$on('displayMessage', function(event, data) { 
		$scope.messages.push(data);
		$('.messageStart').addClass('messageEnd');
	});

	$scope.messages = [];
};