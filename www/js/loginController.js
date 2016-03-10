var povmt = angular.module('starter');

povmt.controller('LoginCtrl',
	function($scope, $stateParams, $state, $timeout, $ionicLoading, $firebaseAuth, FirebaseService)
	{
		$scope.addUsuarioGoogle = function()
		{
			var ref = new Firebase("https://povmt.firebaseio.com/");
			ref.authWithOAuthPopup("google", function(error, authData) {
			  if (error) {
			    console.log("Login Failed!", error);
			  } else {
			    console.log("Authenticated successfully with payload:", authData);
			  }
			});
		}

});