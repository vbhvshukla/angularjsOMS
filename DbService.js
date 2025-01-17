//basically this indexedDB is in clients browser so,
//we dont have fulltime access to it. So when we publish a new
//version of our app and the user visits our webpage we may need to update th DB.
//if the localDB version is less than specified in open then onupgradeneeded function is trigged
//we can compare versions and upgrade data structures as needed
//An object store can only be created/modified while updating the DB version, in upgradeneeded handler.
mainApp.factory("indexedDbService", function ($q) {
  const dbName = "AngularOMS";
  const dbVersion = 1;
  let db;
  const initialProducts = [
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
  ];

  function openDb() {
    const deferred = $q.defer();
    const request = indexedDB.open(dbName, dbVersion);

    request.onupgradeneeded = function (event) {
      db = event.target.result;
      if (!db.objectStoreNames.contains("users")) {
        db.createObjectStore("users", { keyPath: "username" });
      }
      if (!db.objectStoreNames.contains("orders")) {
        db.createObjectStore("orders", { keyPath: "orderId" });
      }
      if (!db.objectStoreNames.contains("products")) {
        const productsStore = db.createObjectStore("products", { keyPath: "id" });
        initialProducts.forEach((product) => {
          productsStore.add(product);
        });
      }
      if (!db.objectStoreNames.contains("cart")) {
        db.createObjectStore("cart", { keyPath: "id" });
      }
    };

    request.onsuccess = function (event) {
      db = event.target.result;
      deferred.resolve(db);
    };

    request.onerror = function (event) {
      deferred.reject(event.target.error);
    };

    return deferred.promise;
  }

  function getObjectStore(storeName, mode) {
    if (!db) {
      throw new Error("Database is not initialized");
    }
    return db.transaction(storeName, mode).objectStore(storeName);
  }

  function addItem(storeName, item) {
    const deferred = $q.defer();
    openDb().then(() => {
      const store = getObjectStore(storeName, "readwrite");
      const request = store.add(item);

      request.onsuccess = function () {
        deferred.resolve(item);
      };

      request.onerror = function (event) {
        deferred.reject(event.target.error);
      };
    }).catch((error) => {
      deferred.reject(error);
    });

    return deferred.promise;
  }

  function getItem(storeName, key) {
    const deferred = $q.defer();
    openDb().then(() => {
      const store = getObjectStore(storeName, "readonly");
      const request = store.get(key);

      request.onsuccess = function (event) {
        deferred.resolve(event.target.result);
      };

      request.onerror = function (event) {
        deferred.reject(event.target.error);
      };
    }).catch((error) => {
      deferred.reject(error);
    });

    return deferred.promise;
  }

  function getAllItems(storeName) {
    const deferred = $q.defer();
    openDb().then(() => {
      const store = getObjectStore(storeName, "readonly");
      const request = store.getAll();

      request.onsuccess = function (event) {
        deferred.resolve(event.target.result);
      };

      request.onerror = function (event) {
        deferred.reject(event.target.error);
      };
    }).catch((error) => {
      deferred.reject(error);
    });

    return deferred.promise;
  }

  function updateItem(storeName, item) {
    const deferred = $q.defer();
    openDb().then(() => {
      const store = getObjectStore(storeName, "readwrite");
      const request = store.put(item);

      request.onsuccess = function () {
        deferred.resolve(item);
      };

      request.onerror = function (event) {
        deferred.reject(event.target.error);
      };
    }).catch((error) => {
      deferred.reject(error);
    });

    return deferred.promise;
  }

  function deleteItem(storeName, key) {
    const deferred = $q.defer();
    openDb().then(() => {
      const store = getObjectStore(storeName, "readwrite");
      const request = store.delete(key);

      request.onsuccess = function () {
        deferred.resolve();
      };

      request.onerror = function (event) {
        deferred.reject(event.target.error);
      };
    }).catch((error) => {
      deferred.reject(error);
    });

    return deferred.promise;
  }

  return {
    openDb,
    addItem,
    getItem,
    getAllItems,
    updateItem,
    deleteItem,
  };
});