export const users = [
  { id: 1, name: "John Doe", email: "john@example.com", phoneNumber: "9876543210", address: "123 Main St" },
  { id: 2, name: "Emma Brown", email: "emma@example.com", phoneNumber: "8765432109", address: "456 Oak St" }
];

export const deleteCitizen = (id, setUsers, setLoading, closeDeleteModal, setSnackbar) => {
  setLoading(true);

  setTimeout(() => {
    setUsers((prevUsers) => prevUsers.filter(user => user.id !== id));
    setLoading(false);
    closeDeleteModal();

    // Show success snackbar
    setSnackbar({ open: true, severity: "success", message: "Citizen deleted successfully!" });
  }, 1000);
};

export const editCitizen = (id, updatedData, setUsers, setLoading, closeEditModal, setSnackbar) => {
  setLoading(true);

  setTimeout(() => {
    setUsers((prevUsers) => prevUsers.map(user => (user.id === id ? { ...user, ...updatedData } : user)));
    setLoading(false);
    closeEditModal();

    // Show success snackbar
    setSnackbar({ open: true, severity: "success", message: "Citizen details updated successfully!" });
  }, 1000);
};
