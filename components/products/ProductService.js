mainApp.factory("productsService", function ($q, $state) {
  const productsService = {};
  let products = JSON.parse(localStorage.getItem("products"));
  if (!products) {
    localStorage.setItem(
      "products",
      JSON.stringify([
        {
          id: 1,
          name: "Pizza",
          price: 12.99,
          addons: ["Extra Cheese", "Pepperoni", "Olives"],
          image: "/assets/images/pizza.jpg",
        },
        {
          id: 2,
          name: "Burger",
          price: 8.99,
          addons: ["Lettuce", "Tomato", "Bacon"],
          image: "/assets/images/burger.jpg",
        },
        {
          id: 3,
          name: "Pasta",
          price: 10.99,
          addons: ["Mushrooms", "Garlic", "Parmesan"],
          image: "/assets/images/pasta.jpg",
        },
      ])
    );
  }

  function saveProducts() {
    localStorage.setItem("products", JSON.stringify(products));
  }

  productsService.getProducts = function () {
    const deferred = $q.defer();
    try {
      deferred.resolve(products);
    } catch (error) {
      deferred.reject("Couldn't get products");
    }
    return deferred.promise;
  };

  productsService.addProduct = function (product) {
    const deferred = $q.defer();
    try {
      if (!product.name || product.price <= 0) {
        throw new Error("Invalid product details");
      }
      product.id = Math.floor(1000 + Math.random() * 9000);
      product.price = parseFloat(product.price);
      products.push(product);
      saveProducts();
      deferred.resolve("Product added sucesfully!");
    } catch (error) {
      deferred.reject("Product couldn't be added");
    }
    return deferred.promise;
  };

  productsService.removeProduct = function (productId) {
    const deferred = $q.defer();
    try {
      const prodIndex = products.findIndex(
        (product) => product.id === productId
      );
      if (prodIndex === -1) {
        throw new Error("Product not found");
      }
      products.splice(prodIndex, 1);
      saveProducts();
      deferred.resolve("Product removed successfully!");
    } catch (error) {
      deferred.reject("Couldn't remove product: " + error);
    }
    return deferred.promise;
  };
  productsService.getProductsByIds = function (productIds) {
    const deferred = $q.defer();
    const filteredProducts = products.filter((product) =>
      productIds.includes(product.id)
    );
    deferred.resolve(filteredProducts);
    return deferred.promise;
  };

  return productsService;
});
