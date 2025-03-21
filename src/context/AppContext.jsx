import React, { createContext, useState } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [role, setRole] = useState("user");
  const [snackbar, setSnackbar] = useState({ open:false, severity: "success", message: "" });



  return (
    <AppContext.Provider value={{role, setRole, snackbar, setSnackbar }}>
      {children}
    </AppContext.Provider>
  );
};
