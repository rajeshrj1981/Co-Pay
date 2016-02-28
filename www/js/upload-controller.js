angular.module("starter").controller("UploadController", function($scope, $ionicHistory, $firebaseArray, $cordovaCamera,$state,$firebaseObject,$rootScope,$firebaseAuth,DataService) {
	$ionicHistory.clearHistory();
	$scope.images = [];
	$scope.userData = {};
	$scope.states = [];
	var syncArray;
	var userReference;
	var userDetails;
	var statesArray;
	var userDataRef;
	//$scope.$on("$stateChangeSuccess", function() {
		$rootScope.show('Please wait..');
		var fbAuth = fb.getAuth();
		if(fbAuth) {
			userReference = fb.child("users/" + fbAuth.uid);
			statesArray = $firebaseArray(fb.child('states')); 
			$scope.states = statesArray;
			statesArray.$loaded().then(function(x) {
				$rootScope.hide();
			}).catch(function(error) {
				console.log("Error:", error);
				$rootScope.notify('Error getting States');
				$rootScope.hide();
			});
		} else {
			$state.go("login");
		}		
	//});		


	$scope.flipImage = function () {
		if($scope.userData.showFront == true){
		$scope.userData.showFront = false;
		} else {
			$scope.userData.showFront = true;
		}
	}
	
	$scope.save = function(){	
		userDataRef = userReference.child("userData");
		userDataRef.set({
			state:$scope.userData.state,
			dob:$scope.userData.dob
		});
		userDetails = $firebaseObject(userDataRef);	
		$scope.userData = userDetails;
		$rootScope.hide();
		$state.go("app.done");
	}
	
	$scope.logOut = function() {
		//syncArray.$destroy();
		$state.go("login");
    }	
	
	$scope.redo = function(){	
		$scope.userData.imageReady = false;
		var item1 = $scope.images[0];
		syncArray.$remove(item1).then(function(ref) {
		});	
		var item2 = $scope.images[1];
		syncArray.$remove(item2).then(function(ref) {
		  $rootScope.showAlert("Photos deleted");
		});			
	}
	
    $scope.upload = function(language) {
		syncArray = $firebaseArray(userReference.child("images"));
		$scope.userData.showFront = true;
		if(syncArray.length >= 2) {
			$rootScope.showAlert("Already two photos available");
		} else {
			var options = {
				quality : 75,
				destinationType : Camera.DestinationType.DATA_URL,
				sourceType : Camera.PictureSourceType.CAMERA,
				allowEdit : true,
				encodingType: Camera.EncodingType.JPEG,
				popoverOptions: CameraPopoverOptions,
				targetWidth: 500,
				targetHeight: 500,
				saveToPhotoAlbum: false
			};
			$cordovaCamera.getPicture(options).then(function(imageData) {
				syncArray.$add({image: imageData
				}).then(function() {
					$scope.userData.imageReady = true;
					$scope.userData.showFront = true;
					$rootScope.showAlert("Photo uploaded");
				});
			}, function(error) {
				console.error(error);
			});
			$scope.images = syncArray;
		}
    }


});