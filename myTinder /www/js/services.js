angular.module('starter')
    .service('api', function($http){
        var _urlApi = 'http://10.100.254.244:1337/';

        return {
            getUsers: function(id){
                return $http.get(_urlApi + 'users/' + id);
            },
            getUser: function(email){
                return $http.get(_urlApi + 'user?email=' + email)
            },
            getLogin: function(email, password){
                var login = {
                    method: 'POST',
                    url: _urlApi,
                    headers: {
                        'Content-type': 'application/json'
                    },
                    data: { email: email,
                            password: password
                    }
                };
                return $http.post(_urlApi + 'login', login.data);
            },
            createAction: function(mId, yId, bool){
                var action = {
                    method: 'POST',
                    url: _urlApi,
                    headers: {
                        'Content-type': 'application/json'
                    },
                    data: {
                        mId: mId,
                        yId: yId,
                        action: bool
                    }
                };
                return $http.post(_urlApi + 'action/create/', action.data);
            },
            createUser: function(name, email, password, birthday, img){
                var user = {
                    method: 'POST',
                    url: _urlApi,
                    headers: {
                        'Content-type': 'application/json'
                    },
                    data: {
                        email: email,
                        password: password,
                        name: name,
                        birthday: birthday,
                        image: img
                    }
                };
                return $http.post(_urlApi + 'user/create/', user.data);
            },
            updateImage: function(id, img){
                var user = {
                    method: 'POST',
                    url: _urlApi,
                    headers: {
                        'Content-type': 'application/json'
                    },
                    data: {
                        image: img
                    }
                };
                return $http.post(_urlApi + 'user/update/' + id, user.data);
            },
            updatePassword: function(id, password){
                var user = {
                    method: 'POST',
                    url: _urlApi,
                    headers: {
                        'Content-type': 'application/json'
                    },
                    data: {
                        password: password
                    }
                };
                return $http.post(_urlApi + 'user/update/' + id, user.data);
            },
            uploadImage: function(image, id){
                var file = {
                    method: 'POST',
                    url: _urlApi,
                    headers: {
                        'Content-type': 'application/json'
                    },
                    data: {
                        uploadFile: image,
                        id: id
                    }
                };
                return $http.post(_urlApi + 'file/upload', file.data);
            },
            like: function(id){
                return $http.get(_urlApi + 'like/' + id)
            },
            dislike: function(id){
                return $http.get(_urlApi + 'dislike/' + id)
            },
            deleteAction: function(mId, yId){
                return $http.get(_urlApi + 'action/delete/' + mId + '/' + yId)
            }
        };

    });