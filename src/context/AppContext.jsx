import React, { createContext, useState, useContext } from "react";

// Create Context
const AppContext = createContext();

// Create Provider Component
export const AppProvider = ({ children }) => {
  const [count, setCount] = useState(0);

  // Function to update state
  const increment = () => setCount((prev) => prev + 1);

  return (
    <AppContext.Provider value={{ count, increment }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom Hook for easy access
export const useAppContext = () => useContext(AppContext);
