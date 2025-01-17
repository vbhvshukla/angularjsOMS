mainApp.factory("productsService", function ($q, indexedDbService) {
  const productsService = {};

  indexedDbService.openDb();

  productsService.getProducts = function () {
    return indexedDbService.getAllItems("products");
  };

  productsService.getProductsByIds = function (productIds) {
    const deferred = $q.defer();
    indexedDbService.getAllItems("products").then((products) => {
      const filteredProducts = products.filter((product) => productIds.includes(product.id));
      deferred.resolve(filteredProducts);
    }).catch((error) => {
      deferred.reject("Couldn't get products: " + error);
    });
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
      indexedDbService.addItem("products", product).then(() => {
        deferred.resolve("Product added successfully!");
      }).catch((error) => {
        deferred.reject("Product couldn't be added: " + error);
      });
    } catch (error) {
      deferred.reject("Product couldn't be added: " + error);
    }
    return deferred.promise;
  };

  productsService.removeProduct = function (productId) {
    const deferred = $q.defer();
    indexedDbService.getItem("products", productId).then((product) => {
      if (!product) {
        deferred.reject("Product not found");
        return;
      }
      indexedDbService.deleteItem("products", productId).then(() => {
        deferred.resolve("Product removed successfully!");
      }).catch((error) => {
        deferred.reject("Couldn't remove product: " + error);
      });
    }).catch((error) => {
      deferred.reject("Couldn't remove product: " + error);
    });
    return deferred.promise;
  };

  return productsService;
});