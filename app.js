var mainApp = angular
  .module("mainModule", ["ui.router"])
  .config([
    "$stateProvider",
    "$urlMatcherFactoryProvider",
    "$urlRouterProvider",
    "$locationProvider",
    function (
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
        })
        .state("cart", {
          url: "/cart",
          templateUrl: "/components/cart/cart.html",
          controller: "productsController",
        })
        .state("orders", {
          url: "/orders",
          templateUrl: "/components/orders/orders.html",
          controller: "ordersController",
        })
        .state("products", {
          url: "/products",
          templateUrl: "/components/products/products.html",
          controller: "productsController",
        });
    },
  ])
  .run([
    "$rootScope",
    "authService",
    function ($rootScope) {
      $rootScope.user = JSON.parse(localStorage.getItem("user")) || null;
    },
  ]);
