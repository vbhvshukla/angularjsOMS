var mainApp = angular
  .module("mainApp", ["ui.router","ngAnimate"])
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
      })
      .state("login", {
        url: "/login",
        templateUrl: "/components/auth/login.html",
        controller: "authController",
      })
      .state("register", {
        url: "/register",
        templateUrl: "/components/auth/register.html",
        controller: "authController",
      })
      .state("admin", {
        url: "/admin",
        templateUrl: "/components/admin/admin.html",
        controller: "adminController",
        resolve: {
          auth: function ($q, authService, $state) {
            if (!authService.isAuthenticated()) {
              $state.go("login");
              return $q.reject("Not authenticated");
            } else if (authService.getUser().role !== "admin") {
              $state.go("landing");
              return $q.reject("Not authorized");
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
            console.log("gya");
          })
          .catch(function () {
            event.preventDefault();
          });
        console.log("chal ja bhai");
      }
    });
  },
]);
