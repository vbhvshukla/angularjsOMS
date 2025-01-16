mainApp.factory("authService", function ($q, $state) {
  const authService = {};
  const defaultAdmin = {
    username: "admin",
    password: CryptoJS.SHA256("admin").toString(),
    role: "admin",
  };

  function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [defaultAdmin];
  }

  function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
  }

  function isUsernameTaken(username) {
    const users = getUsers();
    return users.some((u) => u.username === username);
  }

  function isValidCredentials(username, password) {
    const users = getUsers();
    const hashedPassword = CryptoJS.SHA256(password).toString();
    return users.find(
      (u) => u.username === username && u.password === hashedPassword
    );
  }

  authService.register = function (credentials) {
    const deferred = $q.defer();
    const users = getUsers();
    if (isUsernameTaken(credentials.username)) {
      deferred.reject("Username is already taken");
    } else {
      credentials.password = CryptoJS.SHA256(credentials.password).toString();
      credentials.role = "user";
      users.push(credentials);
      saveUsers(users);
      deferred.resolve("Registration successful");
    }
    return deferred.promise;
  };

  authService.login = function (credentials) {
    const deferred = $q.defer();
    const user = isValidCredentials(credentials.username, credentials.password);
    if (user) {
      const { password, ...userWithoutPassword } = user;
      localStorage.setItem("user", JSON.stringify(userWithoutPassword));
      deferred.resolve(userWithoutPassword);
    } else {
      deferred.reject("Invalid username or password");
    }
    return deferred.promise;
  };

  authService.logout = function () {
    const deferred = $q.defer();
    localStorage.removeItem("user");
    $state.go("login").then(() => {
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

  return authService;
});
