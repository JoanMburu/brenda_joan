// // src/context/UserContext.js
// import React, { createContext, useContext, useState, useEffect } from 'react';

// const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const [user, setUser] = useState(() => {
//     try {
//       const savedUser = localStorage.getItem('user');
//       return savedUser ? JSON.parse(savedUser) : null;
//     } catch {
//       return null;
//     }
//   });

//   const [token, setToken] = useState(() => localStorage.getItem('token') || null);

//   const login = (userData, authToken) => {
//     setUser(userData);
//     setToken(authToken);
//     localStorage.setItem('user', JSON.stringify(userData));
//     localStorage.setItem('token', authToken);
//   };

//   const logout = () => {
//     setUser(null);
//     setToken(null);
//     localStorage.removeItem('user');
//     localStorage.removeItem('token');
//   };

//   useEffect(() => {
//     const savedUser = localStorage.getItem('user');
//     const savedToken = localStorage.getItem('token');
//     if (savedUser && savedToken) {
//       try {
//         setUser(JSON.parse(savedUser));
//         setToken(savedToken);
//       } catch (error) {
//         console.error("Error parsing user data:", error);
//         logout();
//       }
//     }
//   }, []);

//   return (
//     <UserContext.Provider value={{ user, token, login, logout }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// export const useUserContext = () => useContext(UserContext);


// src/context/UserContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);

  const login = (userData) => {
    const { access_token, ...userWithoutToken } = userData;
    setUser(userWithoutToken);
    setToken(access_token);

    localStorage.setItem('user', JSON.stringify(userWithoutToken));
    localStorage.setItem('token', access_token);

    console.log("Token stored in UserContext:", access_token);  // Debug log
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, token, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);

