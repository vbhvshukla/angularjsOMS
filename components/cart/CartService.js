mainApp.factory("cartService", function ($q, indexedDbService) {
  const cartService = {};

  cartService.getCart = function () {
    const deferred = $q.defer();
    indexedDbService.openDb().then(() => {
      indexedDbService.getAllItems("cart").then((cartItems) => {
        deferred.resolve(cartItems);
      }).catch((error) => {
        deferred.reject("Failed to get cart items: " + error);
      });
    }).catch((error) => {
      deferred.reject("Failed to open database: " + error);
    });
    return deferred.promise;
  };

  cartService.addToCart = function (cartItem) {
    const deferred = $q.defer();
    indexedDbService.openDb().then(() => {
      indexedDbService.getItem("cart", cartItem.id).then((existingItem) => {
        if (existingItem) {
          existingItem.quantity = cartItem.quantity;
          indexedDbService.updateItem("cart", existingItem).then(() => {
            deferred.resolve("Updated cart item successfully");
          }).catch((error) => {
            deferred.reject("Failed to update item: " + error);
          });
        } else {
          indexedDbService.addItem("cart", cartItem).then(() => {
            deferred.resolve("Added to cart successfully");
          }).catch((error) => {
            deferred.reject("Failed to add item: " + error);
          });
        }
      }).catch((error) => {
        deferred.reject("Failed to get item: " + error);
      });
    }).catch((error) => {
      deferred.reject("Failed to open database: " + error);
    });
    return deferred.promise;
  };

  cartService.removeFromCart = function (cartItemId) {
    const deferred = $q.defer();
    indexedDbService.openDb().then(() => {
      indexedDbService.deleteItem("cart", cartItemId).then(() => {
        deferred.resolve("Removed from cart successfully");
      }).catch((error) => {
        deferred.reject("Failed to remove item: " + error);
      });
    }).catch((error) => {
      deferred.reject("Failed to open database: " + error);
    });
    return deferred.promise;
  };

  cartService.clearCart = function () {
    const deferred = $q.defer();
    indexedDbService.openDb().then(() => {
      indexedDbService.getAllItems("cart").then((items) => {
        const deletePromises = items.map((item) => indexedDbService.deleteItem("cart", item.id));
        $q.all(deletePromises).then(() => {
          deferred.resolve("Cleared cart successfully");
        }).catch((error) => {
          deferred.reject("Failed to clear cart: " + error);
        });
      }).catch((error) => {
        deferred.reject("Failed to get cart items: " + error);
      });
    }).catch((error) => {
      deferred.reject("Failed to open database: " + error);
    });
    return deferred.promise;
  };

  cartService.getTotal = function () {
    const deferred = $q.defer();
    cartService.getCart().then((cart) => {
      const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      deferred.resolve(total);
    }).catch((error) => {
      deferred.reject("Failed to calculate total: " + error);
    });
    return deferred.promise;
  };

  return cartService;
});