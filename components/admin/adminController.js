angular.module('mainApp').controller('adminController', function($scope, $state, adminService, productsService, ordersService, authService) {
  $scope.orders = [];
  $scope.newProduct = { addons: [] };

  $scope.loadOrders = function() {
      ordersService.getAllOrders().then(function(response) {
          $scope.orders = response.map(order => {
              order.totalAmount = order.items.reduce((total, item) => total + item.price * item.quantity, 0);
              return order;
          });
      }, function(error) {
          console.error('Error loading orders:', error);
      });
  };

  $scope.cancelOrder = function(order) {
      ordersService.cancelOrder(order.orderId).then(function(response) {
          $scope.loadOrders();
      }, function(error) {
          console.error('Error canceling order:', error);
      });
  };

  $scope.addProduct = function() {
      const product = {
          name: $scope.newProduct.name,
          price: $scope.newProduct.price,
          image: $scope.newProduct.image,
          addons: $scope.newProduct.addons
      };
      productsService.addProduct(product).then(function(response) {
          alert(response);
          $scope.newProduct = { addons: [] };
      }, function(error) {
          console.error('Error adding product:', error);
      });
  };

  $scope.addAddon = function() {
      $scope.newProduct.addons.push('');
  };

  $scope.removeAddon = function(index) {
      $scope.newProduct.addons.splice(index, 1);
  };

  $scope.logout = function() {
      authService.logout();
      $state.go('login');
  };

  $scope.loadOrders();
});