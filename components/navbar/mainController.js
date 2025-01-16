mainApp.controller("mainController", [
    "$scope",
    "$rootScope",
    "$state",
    "$location",
    "authService",
    function ($scope,$rootScope, $state, $location, authService) {
      $scope.showNavbar = ["/cart", "/orders", "/products"].includes(
       $location.path()
      );
      $scope.logout = async function () {
         await authService.logout();
         $rootScope.user=null
      };
    },
  ]);