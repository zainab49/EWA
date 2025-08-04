import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import * as XLSX from 'xlsx';
import { Button, TextField, Checkbox, FormControlLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Grid, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

const StationeryForm = () => {
  const [items, setItems] = useState([]);
  const [itemPicture, setItemPicture] = useState(null);

  const formik = useFormik({
    initialValues: {
      directorate: '',
      section: '',
      contactName: '',
      contactPhone: '',
      contactEmail: '',
      itemDescription: '',
      unit: '',
      quantity: '',
      estimatedBudget: '',
      budgetAvailable: false,
    },
    validationSchema: Yup.object({
      directorate: Yup.string().required('Required'),
      section: Yup.string().required('Required'),
      contactName: Yup.string().required('Required'),
      contactPhone: Yup.string().required('Required'),
      contactEmail: Yup.string().email('Invalid email address').required('Required'),
      itemDescription: Yup.string().when('items', {
        is: (items) => items.length === 0,
        then: Yup.string().required('At least one item is required'),
      }),
      unit: Yup.string().when('items', {
        is: (items) => items.length === 0,
        then: Yup.string().required('Required'),
      }),
      quantity: Yup.number().when('items', {
        is: (items) => items.length === 0,
        then: Yup.number().required('Required').positive('Must be positive'),
      }),
      estimatedBudget: Yup.number().when('items', {
        is: (items) => items.length === 0,
        then: Yup.number().required('Required').positive('Must be positive'),
      }),
    }),
    onSubmit: (values) => {
      generateExcel();
    },
  });

  const handleAddItem = () => {
    if (
      formik.values.itemDescription &&
      formik.values.unit &&
      formik.values.quantity &&
      formik.values.estimatedBudget
    ) {
      const newItem = {
        description: formik.values.itemDescription,
        unit: formik.values.unit,
        quantity: formik.values.quantity,
        estimatedBudget: formik.values.estimatedBudget,
        budgetAvailable: formik.values.budgetAvailable,
        picture: itemPicture ? itemPicture.name : null,
      };

      setItems([...items, newItem]);
      formik.setFieldValue('itemDescription', '');
      formik.setFieldValue('unit', '');
      formik.setFieldValue('quantity', '');
      formik.setFieldValue('estimatedBudget', '');
      formik.setFieldValue('budgetAvailable', false);
      setItemPicture(null);
    }
  };

  const handleRemoveItem = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handlePictureChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setItemPicture(event.target.files[0]);
    }
  };

  const generateExcel = () => {
    // Prepare data for Excel
    const excelData = [
      ['Directorate:', formik.values.directorate],
      ['Section:', formik.values.section],
      ['Contact Person:', formik.values.contactName],
      ['Tel No.:', formik.values.contactPhone],
      ['Email:', formik.values.contactEmail],
      [],
      ['St. No', 'Item Description', 'Unit', 'Quantity', 'Estimated Budget', 'Budget availability confirmation (Y/N)', 'Picture Available']
    ];

    items.forEach((item, index) => {
      excelData.push([
        index + 1,
        item.description,
        item.unit,
        item.quantity,
        `${item.estimatedBudget} BD`,
        item.budgetAvailable ? 'Y' : 'N',
        item.picture ? '✅' : '❌'
      ]);
    });

    // Create workbook
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(excelData);
    XLSX.utils.book_append_sheet(wb, ws, 'Stationery Requirements');

    // Generate Excel file
    XLSX.writeFile(wb, 'Stationery_Requirements.xlsx');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom>
        Stationery Requirements Form
      </Typography>

      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              id="directorate"
              name="directorate"
              label="Directorate"
              value={formik.values.directorate}
              onChange={formik.handleChange}
              error={formik.touched.directorate && Boolean(formik.errors.directorate)}
              helperText={formik.touched.directorate && formik.errors.directorate}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              id="section"
              name="section"
              label="Section"
              value={formik.values.section}
              onChange={formik.handleChange}
              error={formik.touched.section && Boolean(formik.errors.section)}
              helperText={formik.touched.section && formik.errors.section}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              id="contactName"
              name="contactName"
              label="Contact Person Name"
              value={formik.values.contactName}
              onChange={formik.handleChange}
              error={formik.touched.contactName && Boolean(formik.errors.contactName)}
              helperText={formik.touched.contactName && formik.errors.contactName}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              id="contactPhone"
              name="contactPhone"
              label="Contact Phone"
              value={formik.values.contactPhone}
              onChange={formik.handleChange}
              error={formik.touched.contactPhone && Boolean(formik.errors.contactPhone)}
              helperText={formik.touched.contactPhone && formik.errors.contactPhone}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              id="contactEmail"
              name="contactEmail"
              label="Contact Email"
              value={formik.values.contactEmail}
              onChange={formik.handleChange}
              error={formik.touched.contactEmail && Boolean(formik.errors.contactEmail)}
              helperText={formik.touched.contactEmail && formik.errors.contactEmail}
            />
          </Grid>
        </Grid>

        <Typography variant="h6" style={{ marginTop: '30px', marginBottom: '15px' }}>
          Add Items
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              id="itemDescription"
              name="itemDescription"
              label="Item Description"
              value={formik.values.itemDescription}
              onChange={formik.handleChange}
              error={formik.touched.itemDescription && Boolean(formik.errors.itemDescription)}
              helperText={formik.touched.itemDescription && formik.errors.itemDescription}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              id="unit"
              name="unit"
              label="Unit (pcs, box, etc.)"
              value={formik.values.unit}
              onChange={formik.handleChange}
              error={formik.touched.unit && Boolean(formik.errors.unit)}
              helperText={formik.touched.unit && formik.errors.unit}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              id="quantity"
              name="quantity"
              label="Quantity"
              type="number"
              value={formik.values.quantity}
              onChange={formik.handleChange}
              error={formik.touched.quantity && Boolean(formik.errors.quantity)}
              helperText={formik.touched.quantity && formik.errors.quantity}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              id="estimatedBudget"
              name="estimatedBudget"
              label="Estimated Budget (BD)"
              type="number"
              value={formik.values.estimatedBudget}
              onChange={formik.handleChange}
              error={formik.touched.estimatedBudget && Boolean(formik.errors.estimatedBudget)}
              helperText={formik.touched.estimatedBudget && formik.errors.estimatedBudget}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControlLabel
              control={
                <Checkbox
                  id="budgetAvailable"
                  name="budgetAvailable"
                  checked={formik.values.budgetAvailable}
                  onChange={formik.handleChange}
                />
              }
              label="Budget Available"
            />
          </Grid>
          <Grid item xs={12}>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="item-picture"
              type="file"
              onChange={handlePictureChange}
            />
            <label htmlFor="item-picture">
              <Button
                variant="outlined"
                component="span"
                startIcon={<PhotoCamera />}
                style={{ marginRight: '10px' }}
              >
                Add Picture
              </Button>
            </label>
            {itemPicture && (
              <span>{itemPicture.name}</span>
            )}
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddItem}
              style={{ marginLeft: '10px' }}
            >
              Add Item
            </Button>
          </Grid>
        </Grid>

        {items.length > 0 && (
          <>
            <Typography variant="h6" style={{ marginTop: '30px', marginBottom: '15px' }}>
              Items List
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Item Description</TableCell>
                    <TableCell>Unit</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Estimated Budget</TableCell>
                    <TableCell>Budget Available</TableCell>
                    <TableCell>Picture</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>{item.unit}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.estimatedBudget} BD</TableCell>
                      <TableCell>{item.budgetAvailable ? 'Yes' : 'No'}</TableCell>
                      <TableCell>{item.picture ? '✅' : '❌'}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleRemoveItem(index)}>
                          <DeleteIcon color="error" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          style={{ marginTop: '30px' }}
          disabled={items.length === 0}
        >
          Generate Excel Sheet
        </Button>
      </form>
    </div>
  );
};

export default StationeryForm;