mainApp.controller("navbarController", [
  "$scope",
  "$rootScope",
  "$state",
  "$location",
  "authService",
  function ($scope, $rootScope, $state, $location, authService) {
    $scope.isAuthenticated = authService.isAuthenticated();
    $scope.showNavbar = $scope.isAuthenticated && 
      ["/cart", "/orders", "/products"].includes($location.path());

    $scope.$on("$locationChangeSuccess", function () {
      $scope.isAuthenticated = authService.isAuthenticated();
      $scope.showNavbar = $scope.isAuthenticated && 
        ["/cart", "/orders", "/products"].includes($location.path());
    });

    $scope.isActive = function (viewLocation) {
      return viewLocation === $location.path();
    };

    $scope.logout = async function () {
      await authService.logout();
      $rootScope.user = null; 
      $state.go("landing"); 
    };
  }
]);