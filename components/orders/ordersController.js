mainApp.controller("ordersController", [
    "$scope",
    "$state",
    "ordersService",
    function ($scope, $state, ordersService) {
      ordersService.getUserOrders().then(
        (orders) => {
          $scope.orders = orders;
          console.log(orders);
        },
        (error) => {
          console.log(error);
        }
      );
      $scope.cancelOrder = function (order) {
        ordersService.cancelOrder(order.orderId).then(
          (message) => {
            $scope.orders = $scope.orders.filter(
              (o) => o.orderId !== order.orderId
            );
            console.log(message);
          },
          (error) => {
            console.log(error);
          }
        );
      };
      $scope.goToProducts = function () {
        $state.go("products");
      };
    },
  ])
  