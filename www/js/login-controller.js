angular.module("starter").controller("LoginController", function($scope, $state,$rootScope,$firebaseAuth,DataService) {
	$scope.data = {};
	$scope.$on("$stateChangeSuccess", function() {
		$scope.data.username='';
		$scope.data.password ='';
	});	
    $scope.login = function(username, password) {	 	
		var fbAuth = $firebaseAuth(fb);
		$rootScope.show('Please wait.. Authenticating');
		fbAuth.$authWithPassword({
			email: username,
			password: password
		}).then(function(authData) {
			$rootScope.hide();
			$state.go("app.home");
		}).catch(function(error) {
			$rootScope.hide();
			if (error.code == 'INVALID_EMAIL') {
				$rootScope.notify('Invalid Email Address');
			} else if (error.code == 'INVALID_PASSWORD') {
				$rootScope.notify('Invalid Password');
			} else if (error.code == 'INVALID_USER') {
				$rootScope.notify('Invalid User');
			} else {
				$rootScope.notify('Oops something went wrong. Please try again later');
			}			
		});
	}
		
    $scope.register = function(username, password) {
		var fbAuth = $firebaseAuth(fb);
		$rootScope.show('Please wait.. Registering');
        fbAuth.$createUser({email: username, password: password}).then(function(userData) {
            return fbAuth.$authWithPassword({
                email: username,
                password: password
            });
        }).then(function(authData) {
			$rootScope.hide();
            $state.go("app.upload");
        }).catch(function(error) {
			$rootScope.hide();
			if (error.code == 'INVALID_EMAIL') {
				$rootScope.notify('Invalid Email Address');
			} else if (error.code == 'EMAIL_TAKEN') {
				$rootScope.notify('Email Address already taken');
			} else {
				$rootScope.notify('Oops something went wrong. Please try again later');
			}
        });
    }		
	
});