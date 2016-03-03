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
			syncArray = $firebaseArray(userReference.child("images"));
			statesArray = $firebaseArray(fb.child('states')); 
			$scope.states = statesArray;
			statesArray.$loaded().then(function(x) {
				$scope.userData.state = "AA";
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
	
    $scope.datepickerObject = {
      titleLabel: 'DOB',  //Optional
      todayLabel: 'Today',  //Optional
      closeLabel: 'Close',  //Optional
      setLabel: 'Select',  //Optional
      setButtonType : 'button-balanced',  //Optional
      todayButtonType : 'button-balanced',  //Optional
      closeButtonType : 'button-balanced',  //Optional
      //inputDate: new Date(),  //Optional
      mondayFirst: true,  //Optional
      //disabledDates: disabledDates, //Optional
      //weekDaysList: weekDaysList, //Optional
      //monthList: monthList, //Optional
      templateType: 'popup', //Optional
      showTodayButton: 'true', //Optional
      modalHeaderColor: 'bar-balanced', //Optional
      modalFooterColor: 'bar-balanced', //Optional
      from: new Date(2012, 8, 2), //Optional
      to: new Date(2018, 8, 25),  //Optional
      callback: function (val) {  //Mandatory
        datePickerCallback(val);
      },
      dateFormat: 'MM/dd/yyyy', //Optional
      closeOnSelect: false, //Optional
    };
	
	datePickerCallback = function(val){
		$scope.datepickerObject.inputDate = val;
		//var dateStr = val.toISOString().slice(0, 10);
		var datestring = (val.getMonth()+1)  + "/" +  val.getDate()+ "/" + val.getFullYear();
		$scope.userData.dob = datestring;
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