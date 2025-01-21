mainApp.service('adminService', function($http, $q, indexedDbService) {
    const adminService = {};
    adminService.getUsers = function() {
        const deferred = $q.defer();
        indexedDbService.getAllItems('users').then(function(users) {
            deferred.resolve(users);
        }).catch(function(error) {
            deferred.reject('Failed to get users: ' + error);
        });
        return deferred.promise;
    };
    adminService.deleteUser = function(userId) {
        const deferred = $q.defer();
        indexedDbService.deleteItem('users', userId).then(function() {
            deferred.resolve('User deleted successfully!');
        }).catch(function(error) {
            deferred.reject('Failed to delete user: ' + error);
        });
        return deferred.promise;
    };

    adminService.addUser = function(user) {
        const deferred = $q.defer();
        indexedDbService.addItem('users', user).then(function() {
            deferred.resolve('User added successfully!');
        }).catch(function(error) {
            deferred.reject('Failed to add user: ' + error);
        });
        return deferred.promise;
    };

    adminService.updateUser = function(user) {
        const deferred = $q.defer();
        indexedDbService.updateItem('users', user).then(function() {
            deferred.resolve('User updated successfully!');
        }).catch(function(error) {
            deferred.reject('Failed to update user: ' + error);
        });
        return deferred.promise;
    };

    return adminService;
});