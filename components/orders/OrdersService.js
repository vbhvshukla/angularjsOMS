mainApp.factory("ordersService", function ($q, indexedDbService, productsService) {
  const ordersService = {};
  const user = JSON.parse(localStorage.getItem("user"));
  const username = user ? user.username : null;

  indexedDbService.openDb();

  ordersService.getUserOrders = function () {
    const deferred = $q.defer();
    if (username) {
      indexedDbService.getAllItems("orders").then((orders) => {
        const userOrders = orders.filter((order) => order.username === username);
        if (userOrders.length === 0) {
          deferred.reject("No orders found for this user.");
          return;
        }

        const orderPromises = userOrders.map((order) => {
          return productsService.getProductsByIds(order.productId).then((products) => {
            order.items = products;
            return order;
          });
        });

        $q.all(orderPromises).then((resolvedOrders) => {
          deferred.resolve(resolvedOrders);
        });
      }).catch((error) => {
        deferred.reject("Failed to get orders: " + error);
      });
    } else {
      deferred.reject("User not logged in");
    }
    return deferred.promise;
  };

  ordersService.getOrderById = function (orderId) {
    const deferred = $q.defer();
    indexedDbService.getItem("orders", orderId).then((order) => {
      if (order) {
        productsService.getProductsByIds(order.productId).then((products) => {
          order.items = products;
          deferred.resolve(order);
        }).catch((error) => {
          deferred.reject("Failed to get products: " + error);
        });
      } else {
        deferred.reject("Order not found");
      }
    }).catch((error) => {
      deferred.reject("Failed to get order: " + error);
    });
    return deferred.promise;
  };

  ordersService.getAllOrders = function () {
    const deferred = $q.defer();
    indexedDbService.getAllItems("orders").then((orders) => {
      const orderPromises = orders.map((order) => {
        return productsService.getProductsByIds(order.productId).then((products) => {
          order.items = products;
          return order;
        });
      });

      $q.all(orderPromises).then((resolvedOrders) => {
        deferred.resolve(resolvedOrders);
      }).catch((error) => {
        deferred.reject("Failed to get orders: " + error);
      });
    }).catch((error) => {
      deferred.reject("Failed to get orders: " + error);
    });
    return deferred.promise;
  };

  ordersService.placeOrder = function (cartItems) {
    const deferred = $q.defer();
    if (username) {
      const newOrder = {
        username: username,
        items: cartItems.map(item => ({
          productId: item.id,
          name: item.name,
          quantity: item.quantity,
          selectedAddons: item.selectedAddons
        })),
        orderId: Date.now(),
        placedAt: new Date().toISOString()
      };
      indexedDbService.addItem("orders", newOrder).then(() => {
        deferred.resolve(newOrder);
      }).catch((error) => {
        deferred.reject("Failed to place order: " + error);
      });
    } else {
      deferred.reject("Unable to place order");
    }
    return deferred.promise;
  };

  ordersService.cancelOrder = function (orderId) {
    const deferred = $q.defer();
    indexedDbService.getItem("orders", orderId).then((order) => {
      if (order && order.username === username) {
        indexedDbService.deleteItem("orders", orderId).then(() => {
          deferred.resolve("Order cancelled successfully");
        }).catch((error) => {
          deferred.reject("Failed to cancel order: " + error);
        });
      } else {
        deferred.reject("Order not found");
      }
    }).catch((error) => {
      deferred.reject("Failed to get order: " + error);
    });
    return deferred.promise;
  };

  return ordersService;
});