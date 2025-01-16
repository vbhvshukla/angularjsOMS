mainApp.factory("ordersService", function ($q,productsService) {
  const ordersService = {};
  const user = JSON.parse(localStorage.getItem("user"));
  const username = user ? user.username : null;
  let orders = JSON.parse(localStorage.getItem("orders")) || [];

  function saveOrders() {
    localStorage.setItem("orders", JSON.stringify(orders));
  }

  ordersService.getUserOrders = function () {
    const deferred = $q.defer();
    if (username) {
      const userOrders = orders.filter((order) => order.username === username);
      const orderPromises = userOrders.map((order) => {
        return productsService
          .getProductsByIds(order.productId)
          .then((products) => {
            order.items = products;
            return order;
          });
      });
      $q.all(orderPromises).then((resolvedOrders) => {
        deferred.resolve(resolvedOrders);
      });
    } else {
      deferred.reject("User not logged in");
    }
    return deferred.promise;
  };

  ordersService.getOrderById = function (orderId) {
    const deferred = $q.defer();
    const order = orders.find((order) => order.orderId === orderId);
    if (order) {
      deferred.resolve(order);
    } else {
      deferred.reject("Order not found");
    }
    return deferred.promise;
  };

  ordersService.getAllOrders = function () {
    const deferred = $q.defer();
    const orderPromises = orders.map(order => {
        return productsService.getProductsByIds(order.productId).then(products => {
            order.items = products;
            return order;
        });
    });
    $q.all(orderPromises).then(resolvedOrders => {
        deferred.resolve(resolvedOrders);
    });
    return deferred.promise;
};

ordersService.placeOrder = function (productIds) {
    const deferred = $q.defer();
    if (username) {
        const newOrder = {
            username: username,
            productId: productIds,
            orderId: Date.now(),
            placedAt: new Date().toISOString()
        };
        orders.push(newOrder);
        saveOrders();
        deferred.resolve(newOrder);
    } else {
        deferred.reject("Unable to place order");
    }
    return deferred.promise;
};
ordersService.cancelOrder = function (orderId) {
    const deferred = $q.defer();
    const orderIndex = orders.findIndex(order => order.orderId === orderId && order.username === username);
    if (orderIndex !== -1) {
        orders.splice(orderIndex, 1);
        saveOrders();
        deferred.resolve("Order cancelled successfully");
    } else {
        deferred.reject("Order not found");
    }
    return deferred.promise;
};

  return ordersService;
});
