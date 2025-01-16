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

  authService.register = function (credentials) {
    var deferred = $q.defer();
    const users = getUsers();
    const isUsernameTaken = users.some(
      (u) => u.username === credentials.username
    );

    if (isUsernameTaken) {
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
    var deferred = $q.defer();
    const users = getUsers();
    const hashedPassword = CryptoJS.SHA256(credentials.password).toString();
    const user = users.find(
      (u) =>
        u.username === credentials.username && u.password === hashedPassword
    );
    const { password, ...userWithoutPassword } = user;
    if (user) {
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

  authService.init = function () {
    // const storedUser = JSON.parse(localStorage.getItem('user'));
    // if(storedUser){
    //   user = storedUser;
    // }
  };

  return authService;
});
