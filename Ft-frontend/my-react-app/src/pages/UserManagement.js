import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import axios from "axios";
import { alignProperty } from '@mui/material/styles/cssUtils';
import { useNavigate } from "react-router-dom";
import Navbar from '../components/Navbar';
function UserManagement() {

  const [rows, setRows] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const navigate = useNavigate();

  // Define columns
  const columns = [
    { field: 'id', headerName: 'ID', width: 90, editable: false },
    { field: 'username', headerName: 'Username', width: 150, editable: true },
    { field: 'password', headerName: 'Password', width: 150, editable: true },
    { field: 'gender', headerName: 'Gender', width: 110, editable: true },
    { field: 'privilege', headerName: 'Privilege', width: 160, editable: true },
  ];

  const fetchUsers = async () => {


    try {
      const response = await axios.get('http://127.0.0.1:8000/users/');
      setRows(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  // Fetch users on mount
  useEffect(() => {
    const token = localStorage.getItem("token");  

    if (token) {  
        const decoded = JSON.parse(atob(token.split(".")[1])); 
        if (decoded.privilege === "admin") { 
            navigate("/UserManagement"); 
        } else {
          alert("Access Denied! Please log in as an admin."); 
            navigate("/login"); 
        }
    }

    fetchUsers();
  }, []);


  const handleRowEditCommit = async (params) => {
    try {
      console.log(params)
      const updateData = JSON.parse(JSON.stringify(params)); // Updating only the edited field
  
      
    await axios.put(`http://127.0.0.1:8000/userupdate/${params.id}/`, updateData, {
      headers: { "Content-Type": "application/json" },
    });

    setRows(prevRows =>
      prevRows.map(row => (row.id === params.id ? { ...row, ...updateData } : row))
    );

  } catch (error) {
    console.error("Error updating user:", error);
  }
  };
  
  
  
  

  // Handle delete selected users
  const handleDelete = async () => {
    if (selectedIds.length === 0) return;

    try {
      await axios.post('http://127.0.0.1:8000/userdelete/', { ids: selectedIds });
      setRows(rows.filter(row => !selectedIds.includes(row.id))); // Remove deleted rows from UI
      setSelectedIds([]); // Clear selection
    } catch (error) {
      console.error("Error deleting users:", error);
    }
  };
  return (<> <Navbar/>
    <Box sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "60vh", // Full viewport height for vertical centering
      flexDirection: "column", // Stack items vertically
    }}>
    <Box sx={{ height: 400, width: '60%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
        onRowSelectionModelChange={(ids) => setSelectedIds(ids)}
        processRowUpdate={(updatedRow) => {
          handleRowEditCommit(updatedRow); // Pass the entire updated row
          return updatedRow;
        }}
      />
      <Button
        variant="contained"
        color="secondary"
        onClick={handleDelete}
        disabled={selectedIds.length === 0}
      >
        Delete Selected
      </Button>
    </Box></Box>
    </>);
}

  

export default UserManagement;
