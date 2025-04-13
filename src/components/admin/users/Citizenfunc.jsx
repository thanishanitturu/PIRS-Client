import { deleteUserAccount, editUserDetails } from "../../../firebase/admin/manageUserFuncs";


export const deleteCitizen = (id, setUsers, setLoading, closeDeleteModal, setSnackbar) => {
  setLoading(true);

  setTimeout(async() => {
    setUsers((prevUsers) => prevUsers.filter(user => user.id !== id));
    const res = await deleteUserAccount(id);
    console.log(res);
    setLoading(false);
    closeDeleteModal();

    // Show success snackbar
    setSnackbar({ open: true, severity: "success", message: "Citizen deleted successfully!" });
  }, 1000);
};

export const editCitizen = (id, updatedData, setUsers, setLoading, closeEditModal, setSnackbar) => {
  setLoading(true);

  setTimeout(async() => {
    setUsers((prevUsers) => prevUsers.map(user => (user.id === id ? { ...user, ...updatedData } : user)));
    const res = await editUserDetails(id,updatedData);
    console.log(res);
    setLoading(false);
    closeEditModal();

    // Show success snackbar
    setSnackbar({ open: true, severity: "success", message: "Citizen details updated successfully!" });
  }, 1000);
};
