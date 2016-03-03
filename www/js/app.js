// Ionic Starter App
var fb = new Firebase("https://co-pay.firebaseio.com/");
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

var imageApp = angular.module('starter', ['ionic','ngCordova','firebase','ionic-datepicker'])

.run(function($ionicPlatform,$rootScope,$ionicLoading,$window,$firebaseAuth,$http,$ionicPopup) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
	//set labels from properties file
	$http.get('properties/application.json').then(function (response) {
		$rootScope.title = response.data.title;
		$rootScope.redoLabel = response.data.redoLabel;
		$rootScope.scanCardLabel = response.data.scanCardLabel;
		$rootScope.doneLabel = response.data.doneLabel;
		$rootScope.coverageText = response.data.coverageText;
		$rootScope.menuClearCard = response.data.menuClearCard;
		$rootScope.menuAboutUs = response.data.menuAboutUs;
	});
	
	$rootScope.hide = function() {
       $ionicLoading.hide();
    };
	
	$rootScope.notify = function(text) {
		$rootScope.show(text);
		$window.setTimeout(function() {
			$rootScope.hide();
		}, 1999);
	};

	$rootScope.show = function(text) {
		$rootScope.loading = $ionicLoading.show({
			template: text ? text : 'Loading..',
			animation: 'fade-in',
			showBackdrop: true,
			maxWidth: 200,
			showDelay: 0
		});
	};	
	
	$rootScope.showAlert = function(text) {
		$ionicPopup.alert({
		  //title: '',
		  content: text,
		  cssClass: 'custom-popup',
		}).then(function(res) {
		  console.log('Alert Box');
		});
	};
	
  });
  
})
.config(function($stateProvider, $urlRouterProvider) {
	  $stateProvider
        .state("login", {
            url: "/login",
            templateUrl: "templates/login.html",
            controller: "LoginController",
			cache: false
        })	  
		.state('app', {
		  url: "/app",
		  abstract: true,
		  templateUrl: "templates/app.html",
		  cache: false
		})	
		.state('app.upload', {
		  url: "/upload",
		  views: {
			'appContent' :{
			  templateUrl: "templates/upload.html",
			  controller : "UploadController",
			  cache: false
			}
		  }
		})
		.state('app.home', {
		  url: "/home",
		  views: {
			'appContent' :{
			  templateUrl: "templates/home.html",
			  controller : "SecureController",
			  cache: false
			}
		  }
		})		
		.state('app.clear', {
		  url: "/clear",
		  views: {
			'appContent' :{
			  templateUrl: "templates/clear.html",
			  controller : "SecureController",
			  cache: false
			}
		  }
		})	
		.state('app.about', {
		  url: "/about",
		  views: {
			'appContent' :{
			  templateUrl: "templates/about.html",
			  controller : "SecureController",
			  cache: false
			}
		  }
		})		
		.state('app.done', {
		  url: "/done",
		  views: {
			'appContent' :{
			  templateUrl: "templates/done.html",
			  controller : "UploadController",
			  cache: false
			}
		  }
		});	
	$urlRouterProvider.otherwise('login');
});