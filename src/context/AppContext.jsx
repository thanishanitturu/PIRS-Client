import { Tune } from "@mui/icons-material";
import React, { createContext, useState } from "react";

// Create Context
export const AppContext = createContext();

// Create Provider Component
export const AppProvider = ({ children }) => {
  const [count, setCount] = useState(0);
  const [role, setRole] = useState("admin");
  const [snackbar, setSnackbar] = useState({ open:false, severity: "success", message: "" });

  // Function to update state
  const increment = () => setCount((prev) => prev + 1);

  return (
    <AppContext.Provider value={{ count, setCount, role, setRole, snackbar, setSnackbar }}>
      {children}
    </AppContext.Provider>
  );
};
