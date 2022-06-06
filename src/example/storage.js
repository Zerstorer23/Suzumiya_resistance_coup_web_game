import { useCallback, useState } from "react";
import React from "react";

let logoutTimer = null;

const AuthContext = React.createContext({
  idToken: "",
  isLoggedIn: false,
  login(token) {},
  logout() {},
});
export default AuthContext;

function calculateRemainingTime(expirationTime) {
  //return remain in milliseconds.
  const currentTime = new Date().getTime();
  const adjExpire = new Date(expirationTime).getTime();

  const remainingDurations = adjExpire - currentTime;
  return remainingDurations;
}
function retrieveStoredToken() {
  const token = localStorage.getItem("token");
  const expire = localStorage.getItem("expire");

  const remain = calculateRemainingTime(expire);
  if (remain <= 60 * 1000) {
    localStorage.removeItem("token");
    localStorage.removeItem("expire");
    return null;
  }
  return {
    token,
    expire,
  };
}

export const AuthContextProvider = (props) => {
  const logout = useCallback(() => {
    setToken(null);
    localStorage.removeItem("token");

    if (logoutTimer) {
      clearTimeout(logoutTimer);
      logoutTimer = null;
    }
  }, []);

  let tokenData = retrieveStoredToken();
  let initToken = null;
  if (tokenData) {
    initToken = tokenData.token;
    const remain = calculateRemainingTime(tokenData.expire);
    logoutTimer = setTimeout(logout, remain);
    console.log("FOUND", tokenData, remain);
  }
  const [token, setToken] = useState(initToken);

  const userIsLoggedIn = !!token;

  function login(token, expirationTime) {
    setToken(token);
    localStorage.setItem("token", token);
    localStorage.setItem("expire", expirationTime);
    const remain = calculateRemainingTime(expirationTime);
    logoutTimer = setTimeout(logout, remain);
  }
  const contextValue = {
    idToken: token,
    isLoggedIn: userIsLoggedIn,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};
