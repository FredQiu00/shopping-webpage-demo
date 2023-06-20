import { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Load user data from local storage on mount
    const storedUserData = localStorage.getItem('user');
    if (storedUserData) {
      setUser(JSON.parse(storedUserData));
    }
  }, []);

  useEffect(() => {
    // Save user data to local storage whenever it changes
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const logOut = () => {
    if (user) {
      fetch(`http://localhost:8000/api/logout/${user._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(response => response.json()
        .then(data => {
          if (!response.ok) {
            throw new Error(data.error);
          }
          setUser(null);
        }))
      .catch(error => {
        alert(`Logout failed: ${error.message}`);
      });
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, logOut }}>
      {children}
    </UserContext.Provider>
  );
};
