// This is a JavaScript file

app.factory('service', [ '$rootScope', '$http', '$q', 'localStorageService', function($rootScope, $http, $q, localStorageService) {

    var serverUrl = 'http://music.nakket.com/files';
    
    var cloudAPI = new CloudAPI($http);

    var sharedPopover;
    var setPopover = function(pop){
        sharedPopover = pop;
    };
    var getPopover = function(){
        return sharedPopover;
    };
  
    var getLocalStorageItems = function(key) {
        if (localStorageService.get(key) !== null) {
            return JSON.parse( JSON.stringify(localStorageService.get(key)) );
        }
        return '';
    };
    
    return {
        version     : '1.3.1',
        platform    : 'iOS',
        mvPath      : serverUrl + '/mv',
        musicPath   : serverUrl + '/music',
        seriePath   : serverUrl + '/serie',
        thumbPath   : serverUrl + '/station',
        viewPath    : serverUrl + '/station/view',
        artistPath  : serverUrl + '/music/All-Artist',
        sponsorPath : serverUrl + '/sponsor',
        productionPath  : serverUrl + '/music/All-Production',

        serverUrl   : serverUrl,
        cloudAPI    : cloudAPI, 

        messageNoInternet : 'សូមភ្ជាប់ទៅកាន់ Internet',
        messageNoMusic : 'មិនមានបទចម្រៀងនោះទេ',

        showSpinnerAuto : function() {
            modal.show();
            setTimeout('modal.hide()', 10000);
        },
        showSpinnerTimer : function(timer) {
            modal.show();
            setTimeout('modal.hide()', timer);
        },
        showSpinner : function() {
            modal.show();
        },
        hideSpinner : function() {
            modal.hide();
        },

        setPopover : setPopover,
        getPopover : getPopover,
        getLocalStorageItems : getLocalStorageItems
    };

}]);


app.factory('authInterceptor', function ($rootScope, $q, localStorageService) {
    return {
        request: function (config) {
            config.headers = config.headers || {};
            if (localStorageService.get('token')) {
                config.headers.Authorization = 'Bearer ' + localStorageService.get('token');
            }
            return config;
        },
        responseError: function (rejection) {
            if (rejection.status === 401) {
                // handle the case where the user is not authenticated
            }
            return $q.reject(rejection);
        }
    };
});

app.config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
});


