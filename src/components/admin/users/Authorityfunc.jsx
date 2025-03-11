export const authorities = [
    { id: 1, name: "Alice Johnson", email: "alice@example.com", password: "auth123", phoneNumber: "9988776655", department: "Health", role: "authority" },
    { id: 2, name: "Robert Smith", email: "robert@example.com", password: "secure456", phoneNumber: "8877665544", department: "Transport", role: "authority" }
  ];
  
  export const deleteAuthority = (id, setAuthorities, setDelAuthLoading, closeDeleteModal, setSnackbar) => {
    setDelAuthLoading(true);
    
    setTimeout(() => {
      setAuthorities((prevAuthorities) => prevAuthorities.filter(authority => authority.id !== id));
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

  
  