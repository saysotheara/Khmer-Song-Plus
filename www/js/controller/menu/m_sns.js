// This is a JavaScript file

app.controller('SNSController', ['$rootScope', '$scope', 'service', 'localStorageService', function($rootScope, $scope, service, localStorageService) {

    var schemeFacebook  = '';
    if (ons.platform.isIOS()) {
        $scope.store    = "App Store";
        schemeFacebook  = 'fb://';
    }
    else if (ons.platform.isAndroid()) {
        $scope.store    = "Google Play Store";
        schemeFacebook  = 'com.facebook.katana';
    }
    else {
        $scope.store = "Not available!";
    }
        
    $scope.onRateClick = function() {
        var reviewUrl;
        if (ons.platform.isIOS()) {
            reviewUrl = 'https://itunes.apple.com/app/id1091988840';
        }
        else if (ons.platform.isAndroid()) {
            reviewUrl = 'market://details?id=com.rabbee.me';
        }
        else {
            reviewUrl = '';
        }
        window.open(reviewUrl, '_system');
    };
    
    $scope.onLikeClick = function() {
        window.open('https://www.facebook.com/OnlineSuperean', '_blank');
    };
    
    $scope.onFacebookClick = function() {
        appAvailability.check(
            schemeFacebook, 
            function() {  // Success callback
                window.open('fb://profile/384416715092514', '_system', 'location=yes');
            },
            function() {  // Error callback
                window.open('https://www.facebook.com/OnlineSuperean', '_blank');
            }
        );
    };
        
    $scope.onAppleClick = function() {
        window.open('https://itunes.apple.com/app/id1091988840', '_system');
    };

    $scope.onGoogleClick = function() {
        if (ons.platform.isAndroid()) {
            $scope.onRateClick();
        }
        else {
            window.open('https://play.google.com/store/apps/details?id=com.rabbee.me', '_system');
        }
    };
    
}]);

