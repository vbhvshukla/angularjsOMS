var mainApp = angular
  .module("mainApp", ["ui.router", "ngAnimate"])
  .config(function (
    $stateProvider,
    $urlMatcherFactoryProvider,
    $urlRouterProvider,
    $locationProvider
  ) {
    // $locationProvider.html5Mode(true);
    $urlMatcherFactoryProvider.caseInsensitive(true);
    $urlRouterProvider.otherwise("/");

    $stateProvider
      .state("landing", {
        url: "/",
        templateUrl: "/components/landing/landing.html",
        resolve: {
          auth: function ($q, authService, $state) {
            if (authService.isAuthenticated()) {
              const user = authService.getUser();
              if (user.role === "admin") {
                $state.go("admin");
              } else {
                $state.go("products");
              }
              return $q.reject("Already authenticated");
            }
          },
        },
      })
      .state("login", {
        url: "/login",
        templateUrl: "/components/auth/login.html",
        controller: "authController",
        resolve: {
          auth: function ($q, authService, $state) {
            if (authService.isAuthenticated()) {
              const user = authService.getUser();
              if (user.role === "admin") {
                $state.go("admin");
              } else {
                $state.go("products");
              }
              return $q.reject("Already authenticated");
            }
          },
        },
      })
      .state("register", {
        url: "/register",
        templateUrl: "/components/auth/register.html",
        controller: "authController",
        resolve: {
          auth: function ($q, authService, $state) {
            if (authService.isAuthenticated()) {
              const user = authService.getUser();
              if (user.role === "admin") {
                $state.go("admin");
              } else {
                $state.go("products");
              }
              return $q.reject("Already authenticated");
            }
          },
        },
      })
      .state("admin", {
        url: "/admin",
        templateUrl: "/components/admin/admin.html",
        controller: "adminController",
        resolve: {
          auth: function ($q, authService, $state) {
            const user = authService.getUser();
            if (!authService.isAuthenticated() || user.role !== "admin") {
              $state.go("login");
              return $q.reject("Not authenticated or not authorized");
            }
          },
        },
      })
      .state("cart", {
        url: "/cart",
        templateUrl: "/components/cart/cart.html",
        controller: "productsController",
        resolve: {
          auth: function ($q, authService, $state) {
            const user = authService.getUser();
            if (user.role === "admin") {
              $state.go("admin");
              return $q.reject("Admins are not allowed to access this page");
            }
            if (!authService.isAuthenticated()) {
              $state.go("login");
              return $q.reject("Not authenticated");
            }
          },
        },
      })
      .state("orders", {
        url: "/orders",
        templateUrl: "/components/orders/orders.html",
        controller: "ordersController",
        resolve: {
          auth: function ($q, authService, $state) {
            const user = authService.getUser();
            if (user.role === "admin") {
              $state.go("admin");
              return $q.reject("Admins are not allowed to access this page");
            }
            if (!authService.isAuthenticated()) {
              $state.go("login");
              return $q.reject("Not authenticated");
            }
          },
        },
      })
      .state("products", {
        url: "/products",
        templateUrl: "/components/products/products.html",
        controller: "productsController",
        resolve: {
          auth: function ($q, authService, $state) {
            const user = authService.getUser();
            if (user.role === "admin") {
              $state.go("admin");
              return $q.reject("Admins are not allowed to access this page");
            }
            if (!authService.isAuthenticated()) {
              $state.go("login");
              return $q.reject("Not authenticated");
            }
          },
        },
      });
  });

mainApp.run([
  "$rootScope",
  function ($rootScope, authService) {
    $rootScope.user = JSON.parse(localStorage.getItem("user")) || null;
    $rootScope.$on("$stateChangeStart", function (event, toState) {
      if (toState.resolve && toState.resolve.auth) {
        toState.resolve.auth
          .then(function () {
            console.log("Authorized");
          })
          .catch(function () {
            event.preventDefault();
          });
      }
    });
  },
]);

mainApp.directive('fileModel', ['$parse', function ($parse) {
  return {
      restrict: 'A',
      link: function (scope, element, attrs) {
          var model = $parse(attrs.fileModel);
          var modelSetter = model.assign;

          element.bind('change', function () {
              scope.$apply(function () {
                  modelSetter(scope, element[0].files[0]);
              });
          });
      }
  };
}]);