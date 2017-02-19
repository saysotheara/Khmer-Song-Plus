// This is a JavaScript file

app.controller('LiveController', ['$rootScope', '$scope', 'service', 'localStorageService', function($rootScope, $scope, service, localStorageService) {

    $scope.$on('refresh: loadAllTV', function(){
        $scope.choice = 'tv';
        $scope.pageTitle = "កម្មវិធីទូរទស្សន៍ផ្សាយផ្ទាល់";
        $scope.liveItems = (service.liveItems) ? service.liveItems : '';
    });

    $scope.$on('refresh: loadAllRadio', function(){
        $scope.choice = 'radio';
        $scope.pageTitle = "កម្មវិធីវិទ្យុខ្មែរ";
        $scope.liveItems = (service.liveItems) ? service.liveItems : '';
    });
    
    $scope.onLiveItemSelect = function(live) {
        if (navigator.connection.type === Connection.NONE) {
            window.plugins.toast.showShortCenter(service.messageNoInternet);
            return;
        }
        if (live.type !== 'archive') {
            $rootScope.$broadcast('refresh: stopPlayer');
            service.cloudAPI.liveViewAdd( { id: live.id, uuid: device.uuid } );
        }
        if (live.type === 'tv' || live.type === 'air') {
            var videoUrl = live.url;
            var options = {
                successCallback: function() {
                },
                errorCallback: function(errMsg) {
                    window.plugins.toast.showShortCenter('សូមព្យាយាមម្ដងទៀតពេលក្រោយ');
                }
            };
            window.plugins.streamingMedia.playVideo(videoUrl, options);
        }
        else if (live.type.indexOf("youtube") > -1) {
            YoutubeVideoPlayer.openVideo(live.url);
        }
        else if (live.type === 'archive') {
            // detail page
            service.liveItem = live;
            service.detail = 'radio_archive';
            app.navi.pushPage('detail.html');
        }
        else {
            var audioUrl = live.url;
            var options = {
                bgColor: "#28292a",
                bgImage: $scope.viewPath + '/' + live.thumb,
                bgImageScale: "center",
                successCallback: function() {
                },
                errorCallback: function(errMsg) {
                    window.plugins.toast.showShortCenter('សូមព្យាយាមម្ដងទៀតពេលក្រោយ');
                }
            };
            window.plugins.streamingMedia.playAudio(audioUrl, options);
        }
    };

    $scope.$on('refresh: loadArchive', function(){
        $scope.choice = "archive";
        
        $scope.liveItems = [];
        $scope.pageTitle = 'ការផ្សាយប្រចាំថ្ងៃ';
        $scope.radioName = service.liveItem.name;
        
        var currentDate = new Date();
        
        for( i=1; i<=10; i++) {
            var url  = '';
            var date = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - i);
            if (service.liveItem.name.indexOf("RFI") > -1) {
                url  = service.liveItem.url + date.getFullYear() + ("0" + (date.getMonth() + 1)).slice(-2) + ("0" + date.getDate()).slice(-2) + '.mp3';
            }
            else if(service.liveItem.name.indexOf("RFA") > -1) {
                url  = service.liveItem.url + date.getFullYear() + '-' + ("0" + (date.getMonth() + 1)).slice(-2) + ("0" + date.getDate()).slice(-2) + '-2230.mp3';
            }
            else if(service.liveItem.name.indexOf("Post") > -1) {
                url  = service.liveItem.url + ("0" + date.getDate()).slice(-2) + '-' + ("0" + (date.getMonth() + 1)).slice(-2) + '-' + date.getFullYear() + '.mp3';
            }
            else if(service.liveItem.name.indexOf("VOA") > -1) {
                url  = service.liveItem.url + date.getFullYear() + '/' + ("0" + (date.getMonth() + 1)).slice(-2) + '/' + ("0" + date.getDate()).slice(-2) + '/' + date.getFullYear() + ("0" + (date.getMonth() + 1)).slice(-2) + ("0" + date.getDate()).slice(-2) + '-220000-VKH075-program.mp3';
            }
            else if(service.liveItem.name.indexOf("Australia") > -1) {
                url  = service.liveItem.url + date.getFullYear() + ("0" + (date.getMonth() + 1)).slice(-2) + ("0" + date.getDate()).slice(-2) + '.mp3';
            }
            else if(service.liveItem.name.indexOf("VOD") > -1) {
                url  = service.liveItem.url + ("0" + date.getFullYear()).slice(-2) + ("0" + (date.getMonth() + 1)).slice(-2) + ("0" + date.getDate()).slice(-2) + '-vod-thy-live-evening-news-' + date.getFullYear() + '-' + ("0" + (date.getMonth() + 1)).slice(-2) + '-' + ("0" + date.getDate()).slice(-2) + '.mp3';
            }
            else if(service.liveItem.name.indexOf("National") > -1) {
                url  = service.liveItem.url + date.getFullYear() + '/' + ("0" + (date.getMonth() + 1)).slice(-2) + '/' + ("0" + date.getDate()).slice(-2) + '-' + ("0" + (date.getMonth() + 1)).slice(-2) + '-' + date.getFullYear() + '%20PM.mp3';
            }
            else if(service.liveItem.name.indexOf("World") > -1) {
                url  = service.liveItem.url + ("0" + (date.getMonth() + 1)).slice(-2) + '-' + ("0" + date.getDate()).slice(-2) + '-' + ("0" + date.getFullYear()).slice(-2) + '_WKR_ALL_NEWS.mp3';
            }
            var liveItem = { 
                date    : date, 
                url     : url,
                id      : service.liveItem.id,
                name    : service.liveItem.name,
                thumb   : service.liveItem.thumb
            };
            $scope.liveItems.push( liveItem );
        }
    });
    
    $scope.onRadioSelect = function(live) {
        $rootScope.$broadcast('refresh: stopPlayer');
        var audioUrl = live.url;
        var options = {
            bgColor: "#28292a",
            bgImage: $scope.viewPath + '/' + live.thumb,
            bgImageScale: "center",
            successCallback: function() {
            },
            errorCallback: function(errMsg) {
                window.plugins.toast.showShortCenter('សូមព្យាយាមម្ដងទៀតពេលក្រោយ');
            }
        };
        window.plugins.streamingMedia.playAudio(audioUrl, options);
        service.cloudAPI.liveViewAdd( { id: live.id, uuid: device.uuid } );
    };

    $scope.onPlaySelect = function(item) {
        if (navigator.connection.type === Connection.NONE) {
            window.plugins.toast.showShortCenter(service.messageNoInternet);
            return;
        }
        $rootScope.$broadcast('refresh: stopPlayer');        
        YoutubeVideoPlayer.openVideo( item.url );
        service.cloudAPI.liveSerieDetailViewAdd( { id: item.id, uuid: device.uuid } );
    };
    
}]);


