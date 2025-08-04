import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import { AddCircle, Delete, Save, FileDownload } from '@mui/icons-material';

function ExcelForm() {
  const [rows, setRows] = useState([{ name: '', email: '', age: '' }]);
  const [fileName, setFileName] = useState('exported_data');

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const updatedRows = [...rows];
    updatedRows[index][name] = value;
    setRows(updatedRows);
  };

  const addRow = () => {
    setRows([...rows, { name: '', email: '', age: '' }]);
  };

  const deleteRow = (index) => {
    if (rows.length > 1) {
      const updatedRows = [...rows];
      updatedRows.splice(index, 1);
      setRows(updatedRows);
    }
  };

  const exportToExcel = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/export', {
        data: rows,
        fileName: fileName
      }, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${fileName}.xlsx`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  const saveToDatabase = async () => {
    try {
      await axios.post('http://localhost:5000/api/save', {
        data: rows
      });
      alert('Data saved to database successfully!');
    } catch (error) {
      console.error('Save error:', error);
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <TextField
        label="File Name"
        value={fileName}
        onChange={(e) => setFileName(e.target.value)}
        fullWidth
        margin="normal"
      />
      
      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                <TableCell>
                  <TextField
                    name="name"
                    value={row.name}
                    onChange={(e) => handleChange(index, e)}
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    name="email"
                    value={row.email}
                    onChange={(e) => handleChange(index, e)}
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    name="age"
                    type="number"
                    value={row.age}
                    onChange={(e) => handleChange(index, e)}
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => deleteRow(index)} color="error">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ marginTop: 2, display: 'flex', gap: 2 }}>
        <Button variant="contained" startIcon={<AddCircle />} onClick={addRow}>
          Add Row
        </Button>
        <Button variant="contained" color="success" startIcon={<Save />} onClick={saveToDatabase}>
          Save to DB
        </Button>
        <Button variant="contained" color="primary" startIcon={<FileDownload />} onClick={exportToExcel}>
          Export to Excel
        </Button>
      </Box>
    </Box>
  );
}

export default ExcelForm;