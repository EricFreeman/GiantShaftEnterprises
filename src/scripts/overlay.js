function OverlayController($scope, $timeout, playerService) {
	$scope.messages = [];
	$scope.spawn = [];
	$scope.tutorialText = "";
	
	$scope.showTutorial = function() {
		return playerService.showTutorial;
	}

	$scope.tutorialInit = function() {
		if(playerService.money >= 15) playerService.tutorialStep = 1;
		if(playerService.tutorialStep == 1 && playerService.items.length > 0) playerService.tutorialStep = 2;
		if(playerService.tutorialStep == 2 && playerService.upgrades.length > 0) playerService.tutorialStep = 3;
		if(playerService.tutorialStep == 3 && playerService.achievements.length > 3) playerService.tutorialStep = 4;

		if(playerService.tutorialStep == 0) {
			$('.mainContent').hide();

			var pos = $('.opportunity').position();
			$('.tutorial').css({left: pos.left - 330, top: pos.top + 24});
			$scope.tutorialText = "Do BUSINESS OPPORTUNITIES to earn money.";
		}
		else if(playerService.tutorialStep == 1) {
			$('.mainContent').show();
			$('.upgrade').hide();
			$('.achievementsContainer').hide();

			var pos = $('.store').children().first().position();
			if(pos != undefined) {
				$('.tutorial').css({left: pos.left - 330, top: pos.top});
				$scope.tutorialText = "Purchase items to earn money for you automatically.";
			}
			else {
				pos = $('.links').children('a').first().position();
				$('.tutorial').css({left: pos.left - 360, top: pos.top - 16});
				$scope.tutorialText = "Go back to the Business tab!";
			}
		}
		else if(playerService.tutorialStep == 2) {
			$('.upgrade').show();

			var pos = $('.upgrade').position();
			if(pos != undefined) {
				$('.tutorial').css({left: pos.left - 330, top: pos.top});
				$scope.tutorialText = "Purchase upgrades to increase the power of your items, business opportunities, and passive bonuses!";
			}
			else {
				pos = $('.links').children('a').first().position();
				$('.tutorial').css({left: pos.left - 360, top: pos.top - 16});
				$scope.tutorialText = "Go back to the Business tab!";
			}
		}
		else if(playerService.tutorialStep == 3) {
			$('.achievementsContainer').show();

			var pos = $('.achievementsContainer').position();
			if(pos != undefined) {
				$('.tutorial').css({left: pos.left - 330, top: pos.top});
				$scope.tutorialText = "These are the achievements you've earned thus far.  You can get them in a variety of ways.  The next easy one for you to earn is by owning 10 Minimum Wage Workers, or doing BUSINESS OPPORTUNITIES 100 times.  Earn one more achievement to complete this tutorial.";
			}
			else {
				pos = $('.links').children('a').first().position();
				$('.tutorial').css({left: pos.left - 360, top: pos.top - 16});
				$scope.tutorialText = "Go back to the Business tab!";
			}
		}
		else {
			$('.tutorial').remove();
		}

		if(playerService.tutorialStep < 4)
			$timeout($scope.tutorialInit, 50);
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