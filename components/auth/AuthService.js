mainApp.factory("authService", function ($q, $state, indexedDbService) {
  const authService = {};
  const defaultAdmin = {
    username: "admin",
    password: CryptoJS.SHA256("admin").toString(),
    role: "admin",
  };

  indexedDbService.openDb().then(() => {
    indexedDbService.getItem("users", defaultAdmin.username).then((user) => {
      if (!user) {
        indexedDbService.addItem("users", defaultAdmin);
      }
    });
  });

  function isUsernameTaken(username) {
    const deferred = $q.defer();
    indexedDbService.getItem("users", username).then((user) => {
      deferred.resolve(!!user);
    });
    return deferred.promise;
  }

  function isValidCredentials(username, password) {
    const deferred = $q.defer();
    indexedDbService.getItem("users", username).then((user) => {
      const hashedPassword = CryptoJS.SHA256(password).toString();
      if (user && user.password === hashedPassword) {
        deferred.resolve(user);
      } else {
        deferred.reject("Invalid username or password");
      }
    });
    return deferred.promise;
  }

  authService.register = function (credentials) {
    const deferred = $q.defer();
    isUsernameTaken(credentials.username).then((isTaken) => {
      if (isTaken) {
        deferred.reject("Username is already taken");
      } else {
        credentials.password = CryptoJS.SHA256(credentials.password).toString();
        credentials.role = "user";
        indexedDbService.addItem("users", credentials).then(() => {
          deferred.resolve("Registration successful");
        });
      }
    });
    return deferred.promise;
  };

  authService.login = function (credentials) {
    const deferred = $q.defer();
    isValidCredentials(credentials.username, credentials.password).then(
      (user) => {
        const { password, ...userWithoutPassword } = user;
        localStorage.setItem("user", JSON.stringify(userWithoutPassword));
        deferred.resolve(userWithoutPassword);
      },
      (error) => {
        deferred.reject(error);
      }
    );
    return deferred.promise;
  };

  authService.logout = function () {
    const deferred = $q.defer();
    localStorage.removeItem("user");
    $state.go("landing").then(() => {
      deferred.resolve();
    });
    return deferred.promise;
  };

  authService.isAuthenticated = function () {
    return !!localStorage.getItem("user");
  };

  authService.getUser = function () {
    return JSON.parse(localStorage.getItem("user"));
  };

  authService.init = function () {
  };

  return authService;
});