mainApp.controller("productsController", [
  "$scope",
  "$state",
  "authService",
  "productsService",
  "cartService",
  "ordersService",
  function (
    $scope,
    $state,
    authService,
    productsService,
    cartService,
    ordersService
  ) {
    productsService.getProducts().then((products) => {
      $scope.products = products;
    });

    cartService.getCart().then((cart) => ($scope.cart = cart));
    cartService.getTotal().then((total) => {
      $scope.totalAmount = total;
    });

    $scope.viewCart = function () {
      $state.go("cart");
    };

    $scope.goToProducts = function () {
      $state.go("products");
    };

    $scope.addToCart = function (product) {
      const cartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        selectedAddon: product.selectedAddon,
      };
      cartService.addToCart(cartItem).then(
        (message) => {
          product.inCart = true;
          product.quantity = 1;
          calculateTotal();
        },
        (error) => {
          console.error(error);
        }
      );
    };

    $scope.increaseQuantity = function (product) {
      product.quantity++;
      updateCart(product);
    };

    $scope.decreaseQuantity = function (product) {
      if (product.quantity > 1) {
        product.quantity--;
        updateCart(product);
      } else {
        $scope.removeFromCart(product);
      }
    };

    $scope.removeFromCart = function (product) {
      cartService.removeFromCart(product).then(
        (message) => {
          product.inCart = false;
          product.quantity = 0;
          $scope.cart = $scope.cart.filter((item) => item.id !== product.id);
          calculateTotal();
          console.log(message);
        },
        (error) => {
          console.error(error);
        }
      );
    };

    function updateCart(product) {
      const cartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: product.quantity,
        selectedAddon: product.selectedAddon,
      };
      cartService.addToCart(cartItem).then(
        (message) => {
          calculateTotal(); // Recalculate total after updating cart
          console.log(message);
        },
        (error) => {
          console.error(error);
        }
      );
    }

    $scope.isInCart = function (product) {
      return $scope.cart.some((item) => item.id === product.id);
    };

    function calculateTotal() {
      cartService.getTotal().then((total) => {
        $scope.totalAmount = total;
      });
    }

    $scope.placeOrder = function () {
      const productIds = $scope.cart.map((item) => item.id);
      ordersService.placeOrder(productIds).then(
        (message) => {
          cartService.clearCart().then(() => {
            $scope.cart = [];
            calculateTotal();
            $state.go("orders");
          });
        },
        (error) => {
          console.error(error);
        }
      );
    };
  },
]);
