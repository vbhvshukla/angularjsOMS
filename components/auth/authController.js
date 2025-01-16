mainApp.controller("authController", [
  "$scope",
  "$rootScope",
  "$state",
  "authService",
  function ($scope, $rootScope, $state, authService) {
    $scope.clearError = function () {
      $scope.errorMessage = null;
    };

    $scope.register = function (credentials) {
      $scope.clearError();

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
      $scope.clearError();

      authService.login(credentials).then(
        function (response) {
          $rootScope.user = response;
          $state.go("products");
        },
        function (error) {
          $scope.errorMessage = error;
        }
      );
    };
  },
]);
