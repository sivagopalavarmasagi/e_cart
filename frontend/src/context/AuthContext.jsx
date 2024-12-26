import { createContext, useState } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null); // Loading state
  const [loggedIn, setLoggedIn] = useState(false); // Loading state
  return (
    <AuthContext.Provider value={{ token, setToken, loggedIn, setLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
export { AuthProvider };
