function OverlayController($scope, $timeout, playerService) {
	$scope.messages = [];
	$scope.spawn = [];
	
	$scope.showTutorial = function() {
		return playerService.showTutorial;
	}

	$scope.tutorialStep = function() {
		if(playerService.tutorialStep == 0) {
			var pos = $('.opportunity').position();
			$('.tutorial').css({left: pos.left - 100, top: pos.top + 24});
		}
		else if(playerService.tutorialStep == 1) {
			var pos = $('.store').children().first().position();
			$('.tutorial').css({left: pos.left - 100, top: pos.top + 24});
		}

		return playerService.tutorialStep;
	}

	$scope.$on('displayMessage', function(event, data) { 
		$scope.messages.push({ text: data, dateCreated: new Date() });

		// Wait to make sure DOM element has been added
		$timeout(function() { 
			$('.messageStart').addClass('messageEnd');
		}, 500);

		// Remove it after four and a half seconds
		$timeout(function() {
			$scope.messages.shift();
		}, 4500);
	});

	$scope.$on('spawnText', function(event, data) {
		$scope.spawn.push({ data: data, dateCreated: new Date() });

		// Wait to make sure DOM element has been added
		$timeout(function() { 
			var item = $(".numberPop").last();
			item.addClass('noSelect');
			item.css({"top": data.y, "left": data.x});
			item.animate({top: (data.y - 100) + 'px', opacity: 0}, 2000, "linear");
		}, 10);

		// Remove it after two seconds
		$timeout(function() {
			$scope.spawn.shift();
		}, 2000);
	});
};