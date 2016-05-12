// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', [,'ionic', 'ngCookies', 'ngCordova', 'ionic.contrib.ui.tinderCards2', 'ngOpenFB'])

    .run(function($ionicPlatform, ngFB, $state, $window) {
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
        });
    })
    .run(function ($rootScope, $state, $window) {
        // Check login session
        $rootScope.$on('$stateChangeStart', function (event, next, current) {
            var userInfo = $window.localStorage.getItem('userInfo');


            if (!userInfo) {
                // user not logged in | redirect to login
                if (next.name !== "login") {
                    // not going to #welcome, we should redirect now
                    event.preventDefault();
                    $state.go('login');
                }
            } else if (next.name === "login") {
                event.preventDefault();
                $state.go('home');
            }
        });
    })

    .config(function($stateProvider, $urlRouterProvider) {

        $stateProvider

            .state('home', {
                url: '/home',
                cache: false,
                templateUrl: 'templates/home.html',
                controller: 'HomeCtrl'
            })

            .state('settings', {
                url: '/settings',
                templateUrl: 'templates/settings.html',
                controller: 'SettingsCtrl'

            })
            .state('login', {
                url: '/login',
                templateUrl: 'templates/login.html',
                controller: 'LoginCtrl'
            })

            .state('register', {
                url: '/register',
                templateUrl: 'templates/register.html',
                controller: 'RegisterCtrl'
            })
            .state('like', {
                url: '/like',
                cache: false,
                templateUrl: 'templates/like.html',
                controller: 'LikeCtrl'
            })
            .state('Cards', {
                cache: false,
                controller: 'CardsCtrl'
            })
            .state('dislike', {
                url: '/dislike',
                cache: false,
                templateUrl: 'templates/dislike.html',
                controller: 'DislikeCtrl'
            });


        $urlRouterProvider.otherwise('/login')
    })

    .directive('noScroll', function($document) {

        return {
            restrict: 'A',
            link: function($scope, $element, $attr) {

                $document.on('touchmove', function(e) {
                    e.preventDefault();
                });
            }
        }
    });


