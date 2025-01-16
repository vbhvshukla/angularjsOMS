mainApp.controller("authController", [
    "$scope",
    "$rootScope",
    "$state",
    "authService",
    function ($scope,$rootScope, $state, authService) {
      $scope.register = function (credentials) {
        authService.register(credentials).then(
          function (response) {
            console.log(response);
            $state.go("login");
          },
          function (error) {
            $scope.errorMessage = error;
          }
        );
      };
      $scope.login = function (credentials) {
        authService.login(credentials).then(
          function (response) {
            $rootScope.user=response;
            $state.go("products");
          },
          function (error) {
            $scope.errorMessage = error;
          }
        );
      };
    },
  ])
  