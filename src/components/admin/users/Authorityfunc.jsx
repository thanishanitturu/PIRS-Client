import { deleteUserAccount } from "../../../firebase/admin/manageUserFuncs";

  export const deleteAuthority = (id, setAuthorities, setDelAuthLoading, closeDeleteModal, setSnackbar) => {
    setDelAuthLoading(true);
    // console.log(id)
    setTimeout(async() => {
      setAuthorities((prevAuthorities) => prevAuthorities.filter(authority => authority.id !== id));
      const res = await deleteUserAccount(id);
      // console.log(res);
      setDelAuthLoading(false);
      closeDeleteModal(); 
  
      // Show success snackbar
      setSnackbar({ open: true, severity: "success", message: "Authority deleted successfully!" });
    }, 1500);
  };
  
  export const editAuthority = (id, updatedData, setAuthorities, setEditAuthLoading, closeEditModal, setSnackbar) => {
    setEditAuthLoading(true);
    
    setTimeout(() => {
      setAuthorities((prevAuthorities) => prevAuthorities.map(authority => (authority.id === id ? { ...authority, ...updatedData } : authority)));
      setEditAuthLoading(false);
      closeEditModal();
  
      // Show success snackbar
      setSnackbar({ open: true, severity: "success", message: "Authority details updated successfully!" });
    }, 1500);
  };

  
  