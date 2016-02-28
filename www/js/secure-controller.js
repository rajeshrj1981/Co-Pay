angular.module("starter").controller("SecureController", function($scope, $ionicHistory, 
$firebaseArray, $cordovaCamera,$state,$firebaseObject,$rootScope,$firebaseAuth,DataService) {

	$scope.showPortaitDiv = true;
	// Listen for orientation changes
	window.addEventListener("orientationchange", function() {
	  // Announce the new orientation number
        var ua = navigator.userAgent.toLowerCase();
		//alert("oreientation changed = "+window.orientation+" Device "+ua+"Before"+$rootScope.showLandDiv.value);
        var isAndroid = ua.indexOf("android") > -1; // Detect Android devices
        if (isAndroid) {
            //window.orientation is different for iOS and Android
            if (window.orientation == 0 || window.orientation == 180) { //Portrait Mode
				$scope.showPortaitDiv = true;
            }
            else if (window.orientation == 90 || window.orientation == -90) { //Landscape Mode
				$scope.showPortaitDiv = false;
            }
        }
        else {
            if (window.orientation == 90 || window.orientation == -90) { //Landscape Mode
				$scope.showPortaitDiv = false;
            }
            else if (window.orientation == 0 || window.orientation == 180) { //Portrait Mode
				$scope.showPortaitDiv = true;
            }
        }
		//alert("after "+$scope.showPortaitDiv);
		$scope.$apply();		
	}, false);	

	$ionicHistory.clearHistory();
	
	$scope.images = [];
	$scope.userData = {};
	$scope.states = [];
	var syncArray;
	$scope.$on("$stateChangeSuccess", function() {
		$scope.foo=true;
		if($state.includes('app.home')){
			$rootScope.show('Please wait..');
			$scope.userData.imageReady = false;
			var fbAuth = fb.getAuth();
			if(fbAuth) {
				var userReference = fb.child("users/" + fbAuth.uid);
				syncArray = $firebaseArray(userReference.child("images"));		
				$scope.images = syncArray;
				$scope.userData.showFront = true;		
				DataService.findAll().then(function (data) {
					$scope.userData.age = data.age;
					$scope.userData.urgentCare = data.urgentCare;
					$scope.userData.copay = data.copay;
					$scope.userData.er = data.er;
				});				
				syncArray.$loaded().then(function(x) {
					$scope.userData.imageReady = true;
					$rootScope.hide();
				}).catch(function(error) {
					console.log("Error:", error);
					$rootScope.notify('Error getting data');
					$rootScope.hide();
				});
			} else {
				$state.go("login");
			}		
		}
	});

	$scope.logOut = function() {
		//delete $scope.images;
		//var fbAuth = fb.getAuth();
		//var userReference = fb.child("users/" + fbAuth.uid);
		//syncArray.$destroy();
		//var userDetails = $firebaseObject(userReference.child('userData'));	
		//userDetails.$destroy();		
		//$firebaseAuth(fb).$unauth();
		$state.go("login");
    }
	
	$scope.clear = function() {
		$rootScope.showAlert("Card Cleared");
    }	

	$scope.flipImage = function () {
		if($scope.userData.showFront == true){
		$scope.userData.showFront = false;
		} else {
			$scope.userData.showFront = true;
		}
	}
	
});