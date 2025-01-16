mainApp.factory("cartService", function ($q, $state) {
  const cartService = {};
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  cartService.addToCart = function (cartItem) {
    const deferred = $q.defer();
    try {
      const existingItem = cart.find((item) => item.id === cartItem.id);
      if (existingItem) {
        existingItem.quantity =cartItem.quantity;
      } else {
        cart.push(cartItem);
      }
      saveCart();
      deferred.resolve("Added to cart sucessfully");
    } catch (error) {
      deferred.reject("Failed to add item : " + error);
    }
    return deferred.promise;
  };

  cartService.removeFromCart = function (cartItem) {
    const deferred = $q.defer();
    try {
      cart = cart.filter((item) => item.id !== cartItem.id);
      saveCart();
      deferred.resolve("Item removed from cart");
    } catch (error) {
      deferred.reject("Failed to remove item : " + error);
    }
    return deferred.promise;
  };

  cartService.clearCart = function () {
    const deferred = $q.defer();
    try {
      cart = [];
      localStorage.removeItem("cart");
      deferred.resolve("Cart cleared!");
    } catch (error) {
      deferred.reject("Cart couldn't be cleared: " + error);
    }
    return deferred.promise;
  };

  cartService.getCart = function () {
    const deferred = $q.defer();
    try {
      deferred.resolve(cart);
    } catch (error) {
      deferred.reject("Cart couldn't be get: " + error);
    }
    return deferred.promise;
  };
  cartService.getTotal = function () {
    const deferred = $q.defer();
    try {
      const totalValue = cart.reduce(
        (acc, curr) => acc + curr.price * curr.quantity,
        0
      );
      deferred.resolve(totalValue);
    } catch (error) {
      deferred.reject("failed to get total price: " + error);
    }
    return deferred.promise;
  };
  return cartService;
});
