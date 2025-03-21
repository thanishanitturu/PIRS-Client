import React, { createContext, useState } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [role, setRole] = useState("user");
  const [snackbar, setSnackbar] = useState({ open:false, severity: "success", message: "" });
  

  const [notifications, setNotifications] = useState([
    { id: 1, department: "Sanitation", message: "Your garbage collection issue  is under review.", time: "10:30 AM", date: "Jan 30, 2025", read: false },
    { id: 2, department: "Electricity Board", message: "Power outage in your area has been reported.", time: "09:15 AM", date: "Jan 30, 2025", read: false },
    { id: 3, department: "Water Department", message: "Your water leakage complaint is being addressed.", time: "08:45 AM", date: "Jan 30, 2025", read: false },
    { id: 4, department: "Traffic Police", message: "Your traffic signal issue has been forwarded.", time: "07:30 AM", date: "Jan 29, 2025", read: false },
    { id: 5, department: "Municipality", message: "Streetlight repair request is in progress.", time: "06:20 AM", date: "Jan 29, 2025", read: false },
  ]);
  
  return (
    <AppContext.Provider value={{role, setRole, snackbar, setSnackbar,notifications,setNotifications }}>
      {children}
    </AppContext.Provider>
  );
};
