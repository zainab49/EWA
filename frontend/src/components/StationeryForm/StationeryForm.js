import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as XLSX from 'xlsx';
import { Button, Typography } from '@mui/material';
import { FormFields } from './FormFields';
import { ItemForm } from './ItemForm';
import { ItemsTable } from './ItemsTable';
import { getValidationSchema } from './validationSchema';

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
    validationSchema: getValidationSchema(items),
    onSubmit: (values) => {
      if (items.length === 0) {
        formik.setFieldError('itemDescription', 'At least one item is required');
        return;
      }
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

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(excelData);
    XLSX.utils.book_append_sheet(wb, ws, 'Stationery Requirements');
    XLSX.writeFile(wb, 'Stationery_Requirements.xlsx');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom>
        Stationery Requirements Form
      </Typography>

      <form onSubmit={formik.handleSubmit}>
        <FormFields formik={formik} />
        
        <ItemForm 
          formik={formik} 
          itemPicture={itemPicture} 
          handlePictureChange={handlePictureChange} 
          handleAddItem={handleAddItem} 
        />

        {items.length > 0 && (
          <ItemsTable items={items} handleRemoveItem={handleRemoveItem} />
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