angular.module('starter')
    .controller('LoginCtrl', function ($scope, $state, api, $ionicHistory, $ionicPopup, $ionicModal, $window) {



        $scope.fbLogin = function () {
            FB.login(function (response) {
                if (response.authResponse) {
                    getUserInfo();
                } else {
                    console.log('User cancelled login or did not fully authorize.');
                }
            }, {scope: 'email,user_photos'});

            function getUserInfo() {
                // get basic info
                FB.api('/me?fields=first_name,birthday,email', function (response) {
                    console.log('Facebook Login RESPONSE: ' + angular.toJson(response));
                    // get profile picture
                    FB.api('/me/picture?type=normal', function (picResponse) {
                        console.log('Facebook Login RESPONSE: ' + picResponse.data.url);

                        response.imageUrl = picResponse.data.url;
                        // store data to DB - Call to API
                        api.createUser(response.first_name, response.email, 'facebook', '000-00-00T22:00:00.000Z', picResponse.data.url).then(function(result){
                            console.log(result);
                            $scope.modal.hide();
                        }, function(error){
                            console.log(error);
                        });


                        // After posting user data to server successfully store user data locally
                        var user = {};

                        api.getUser(response.email).then(function(result){
                            user.id = result.data[0].id;

                            user.image = result.data[0].image;


                        user.name = response.name;
                        user.email = response.email;
                        if(response.gender) {
                            response.gender.toString().toLowerCase() === 'male' ? user.gender = 'M' : user.gender = 'F';
                        } else {
                            user.gender = '';
                        }
                        user.image = picResponse.data.url;
                            $window.localStorage.setItem('userInfo', JSON.stringify(user));

                        $ionicHistory.nextViewOptions({
                            disableBack: true
                        });

                        $state.go('home');

                        });

                    });
                });
            }
        };
        $scope.login = function (email, password) {
            api.getLogin(email, password).then(function(result){
                if (result.data.user) {


                    $ionicHistory.nextViewOptions({
                        disableBack: true
                    });
                    $window.localStorage.setItem('userInfo', JSON.stringify(result.data.user));
                    $state.go('home');
                }
                else{
                    console.log(result.data.message);
                    $ionicPopup.alert({
                            title: 'Erreur',
                            template: result.data.message
                        });

                }

            }, function(error){
                console.log(error);
            });

        };

        $ionicModal.fromTemplateUrl('templates/register.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });
        $scope.openModal = function() {
            $scope.modal.show();
        };
        $scope.closeModal = function() {
            $scope.modal.hide();
        };
        // Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
            $scope.modal.remove();
        });
        // Execute action on hide modal
        $scope.$on('modal.hidden', function() {
            // Execute action
        });
        // Execute action on remove modal
        $scope.$on('modal.removed', function() {
            // Execute action
        });
    })
    .controller('HomeCtrl', function($scope, $http, api, $window, $state){
        $scope.users = [];


        $scope.user = JSON.parse($window.localStorage.getItem('userInfo'));




        $scope.logout = function () {
            $window.localStorage.removeItem('userInfo');

            $state.go('login');
            $window.location.reload();
        };

    })
    .controller('RegisterCtrl', function($scope, api, $ionicPopup){



        $scope.create = function(name, email, password, birthday, image){

            var olday = new Date(birthday);
            var today = new Date();

            age = new Number((today.getTime() - olday.getTime()) / 31536000000).toFixed(0);

            if (age < 18)
            {
                $ionicPopup.alert({
                    title: 'Erreur',
                    template: 'Vous devez avoir + de 18ans'
                });
            }
            else {

                api.createUser(name, email, password, birthday, image).then(function (result) {
                    console.log(result);
                    $scope.modal.hide();
                }, function (error) {
                    console.log(error);
                });
            }
        }

    })
    .controller('CardsCtrl', function($scope, TDCardDelegate, $timeout, api, $window) {

        mId = JSON.parse($window.localStorage.getItem('userInfo')).id;

        console.log(mId);


        var cardTypes = [];


        api.getUsers(mId).then(function(result){
            cardTypes = result.data;


            $scope.cards = {
                master: Array.prototype.slice.call(cardTypes, 0),
                active: Array.prototype.slice.call(cardTypes, 0),
                discards: [],
                liked: [],
                disliked: []
            }

        }, function(error){
            console.log(error);
        });

        console.log(cardTypes);




        $scope.cardDestroyed = function(index) {
            $scope.cards.active.splice(index, 1);
        };

        $scope.addCard = function() {
            var newCard = cardTypes[0];
            $scope.cards.active.push(angular.extend({}, newCard));
        }

        $scope.refreshCards = function() {
            // Set $scope.cards to null so that directive reloads
            $scope.cards.active = null;
            $timeout(function() {
                $scope.cards.active = Array.prototype.slice.call($scope.cards.master, 0);
            });
        }

        $scope.$on('removeCard', function(event, element, card) {
            var discarded = $scope.cards.master.splice($scope.cards.master.indexOf(card), 1);
            $scope.cards.discards.push(discarded);
        });

        $scope.cardSwipedLeft = function(index) {
            console.log('LEFT SWIPE');
            var card = $scope.cards.active[index];
            console.log(card);
            api.createAction(mId, card.id, false).then(function(result){
                console.log('DISLIKE EFFECTUER')
            }, function(error){
                console.log(error);
            });
            $scope.cards.disliked.push(card);
        };
        $scope.cardSwipedRight = function(index) {
            console.log('RIGHT SWIPE');
            var card = $scope.cards.active[index];
            console.log(card);
            api.createAction(mId, card.id, true).then(function(result){
                console.log('LIKE EFFECTUER')
            }, function(error){
                console.log(error);
            });
            $scope.cards.liked.push(card);
        };

    })

    .controller('CardCtrl', function($scope, TDCardDelegate, $window) {

    })
    .controller('LikeCtrl', function($scope, $http, api, $window){

        $scope.likes = [];


        mId = JSON.parse($window.localStorage.getItem('userInfo')).id;

        api.like(mId).then(function(res){

            $scope.likes  = res.data;
            console.log($scope.likes);
        }, function(error){
            console.log(error);
        });

        $scope.delete = function(index){
            var card = $scope.likes[index];
            $scope.likes.splice(index, 1);
            console.log(card);

            api.deleteAction(mId, card.yId).then(function(res){
                console.log('ok');
            })
        };

    })
    .controller('DislikeCtrl', function($scope, $http, api, $window){

        $scope.dislikes = [];

        mId = JSON.parse($window.localStorage.getItem('userInfo')).id;
        console.log(JSON.parse($window.localStorage.getItem('userInfo')).id);


        api.dislike(mId).then(function(res){

            $scope.dislikes  = res.data;
            console.log($scope.dislikes);
        }, function(error){
            console.log(error);
        });

        $scope.delete = function(index){
            var card = $scope.dislikes[index];
            $scope.dislikes.splice(index, 1);
            console.log(card);

            api.deleteAction(mId, card.yId).then(function(res){
                console.log('ok');
            })
        };

    })
    .controller('SettingsCtrl', function($scope, $http, api, $window, $state){


        $scope.name = JSON.parse($window.localStorage.getItem('userInfo')).name;
        $scope.image = JSON.parse($window.localStorage.getItem('userInfo')).image;

        mId = JSON.parse($window.localStorage.getItem('userInfo')).id;

        $scope.changeImage = function(image){

            api.updateImage(mId, image).then(function(res){

                $state.go('settings')
            })
        };
        $scope.changePassword = function(password){

            api.updatePassword(mId, password).then(function(res){

                $state.go('settings')
            })
        }


    });