import React, { createContext, useEffect, useState } from "react";
import { getUserNotifications } from "../firebase/notifications/notifyFuncs";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [role, setRole] = useState(localStorage.getItem("role")|| "empty");
  const[useremail,setUseremail] = useState(localStorage.getItem("useremail")|| null);
  const [username,setUsername] = useState(localStorage.getItem("username") || null);
  const [token,setToken] = useState(localStorage.getItem("uid") || null);
  const[deptName,setDeptName] = useState("water");
  const [snackbar, setSnackbar] = useState({ open:false, severity: "success", message: "" });
  const[allReports,setAllReports] = useState([]);
  const[isRender,setIsRender] = useState(false);  
  const[notifications,setNotifications] = useState([]);

  useEffect(()=>{
      
    const getNofications = async()=>{
        const res  = await getUserNotifications(localStorage.getItem("uid"));
        // console.log(res);
        // console.log("hello world")
        setNotifications(res);
    }

    getNofications();
  },[role]);

  


  
  
  return (
    <AppContext.Provider value={{setUseremail,setUsername,role, setRole, snackbar, setSnackbar,notifications,setNotifications,deptName,setDeptName,token,setToken,allReports,setAllReports,isRender,setIsRender}}>
      {children}
    </AppContext.Provider>
  );
};
