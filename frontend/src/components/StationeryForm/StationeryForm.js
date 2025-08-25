import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, Button, Select, MenuItem, FormControl, InputLabel, Checkbox, FormControlLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Divider, Alert } from '@mui/material';
import { Business, Phone, Email, Description, Add, Delete, GetApp } from '@mui/icons-material';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const FormalStationeryForm = () => {
  const [formData, setFormData] = useState({
    directorate: '',
    section: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
  });

  const [currentItem, setCurrentItem] = useState({
    description: '',
    unit: '',
    quantity: '',
    estimatedBudget: '',
    budgetAvailable: false,
  });

  const [items, setItems] = useState([]);
  const [itemPicture, setItemPicture] = useState(null);
  const [errors, setErrors] = useState({});

  const fileToDataUrl = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result); // data:image/...;base64,XXXX
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const handlePictureChange = async (event) => {
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  const dataUrl = await fileToDataUrl(file);
  setItemPicture({
    name: file.name,
    type: file.type, // image/png
    dataUrl,         // data:image/png;base64,XXXX
  });
};

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.directorate) newErrors.directorate = 'Directorate is required';
    if (!formData.section) newErrors.section = 'Section is required';
    if (!formData.contactName) newErrors.contactName = 'Contact name is required';
    if (!formData.contactPhone) newErrors.contactPhone = 'Phone number is required';
    if (!formData.contactEmail) newErrors.contactEmail = 'Email is required';
    
    if (items.length === 0) {
      newErrors.items = 'At least one item must be added';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateCurrentItem = () => {
    return currentItem.description && currentItem.unit && currentItem.quantity && currentItem.estimatedBudget;
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleItemChange = (field, value) => {
    setCurrentItem(prev => ({ ...prev, [field]: value }));
  };

  const handleAddItem = () => {
    if (validateCurrentItem()) {
      const newItem = {
        ...currentItem,
        picture: itemPicture ? { ...itemPicture } : null,
      };
      setItems(prev => [...prev, newItem]);
      setCurrentItem({
        description: '',
        unit: '',
        quantity: '',
        estimatedBudget: '',
        budgetAvailable: false,
      });
      setItemPicture(null);
      if (errors.items) {
        setErrors(prev => ({ ...prev, items: '' }));
      }
    }
  };

  const handleRemoveItem = (index) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

 



const generateExcel = async () => {
  if (!validateForm()) return;

  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('Stationery Requirements');

  
  ws.columns = [
    { header: 'St. No', key: 'sno', width: 8 },
    { header: 'Item Description', key: 'desc', width: 40 },
    { header: 'Unit', key: 'unit', width: 12 },
    { header: 'Quantity', key: 'qty', width: 10 },
    { header: 'Estimated Budget (BD)', key: 'budget', width: 22 },
    { header: 'Budget Available', key: 'avail', width: 16 },
    { header: 'Picture', key: 'pic', width: 18 }, // مكان الصورة
  ];

 
  ws.mergeCells('A1:G1');
  ws.getCell('A1').value = 'Electricity and Water Authority';
  ws.getCell('A1').font = { bold: true, size: 16 };
  ws.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };

  ws.mergeCells('A2:G2');
  ws.getCell('A2').value = 'STATIONERY REQUIREMENTS FORM';
  ws.getCell('A2').font = { bold: true, size: 14 };
  ws.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };

 
  const infoStart = 4;
  ws.getCell(`A${infoStart}`).value = 'Directorate:'; ws.getCell(`B${infoStart}`).value = formData.directorate;
  ws.getCell(`A${infoStart+1}`).value = 'Section:'; ws.getCell(`B${infoStart+1}`).value = formData.section;
  ws.getCell(`A${infoStart+2}`).value = 'Contact Person:'; ws.getCell(`B${infoStart+2}`).value = formData.contactName;
  ws.getCell(`A${infoStart+3}`).value = 'Tel No.:'; ws.getCell(`B${infoStart+3}`).value = formData.contactPhone;
  ws.getCell(`A${infoStart+4}`).value = 'Email:'; ws.getCell(`B${infoStart+4}`).value = formData.contactEmail;

  
  const headerRowIdx = infoStart + 6;
  const headerRow = ws.getRow(headerRowIdx);
  headerRow.values = ['St. No', 'Item Description', 'Unit', 'Quantity', 'Estimated Budget', 'Budget Available', 'Picture'];
  headerRow.font = { bold: true };
  headerRow.alignment = { horizontal: 'center' };
  headerRow.eachCell((cell) => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEFEFEF' } };
    cell.border = { top: {style:'thin'}, left:{style:'thin'}, bottom:{style:'thin'}, right:{style:'thin'} };
  });

  
  let currentRow = headerRowIdx + 1;

  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    const row = ws.getRow(currentRow);
    row.values = [
      i + 1,
      it.description,
      it.unit,
      Number(it.quantity) || 0,
      `${it.estimatedBudget} BD`,
      it.budgetAvailable ? 'Y' : 'N',
      '' 
    ];
    row.alignment = { vertical: 'middle' };
    row.height = 70; 

   
    row.eachCell((cell) => {
      cell.border = { top: {style:'thin'}, left:{style:'thin'}, bottom:{style:'thin'}, right:{style:'thin'} };
      if (cell.col === 6) cell.alignment = { horizontal: 'center', vertical: 'middle' };
    });

    // add image if exists
    if (it.picture && it.picture.dataUrl) {
      // ExcelJS  
      const base64 = it.picture.dataUrl.split(',')[1];
      
      const ext = (it.picture.type || '').includes('png') ? 'png'
                : (it.picture.type || '').includes('jpeg') ? 'jpeg'
                : 'png';

      const imageId = wb.addImage({
        base64, 
        extension: ext,
      });

      
      ws.addImage(imageId, {
        tl: { col: 6.1, row: currentRow - 1 + 0.15 }, 
        br: { col: 6.9, row: currentRow - 1 + 0.95 }, 
        editAs: 'oneCell',
      });
    }

    currentRow++;
  }

  // generate buffer and trigger download
  const buf = await wb.xlsx.writeBuffer();
  const filename = `Stationery_Requirements_${new Date().toISOString().slice(0,10)}.xlsx`;
  saveAs(new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), filename);
};


  return (
    <Box sx={{ 
      minHeight: '100vh', 
      backgroundColor: '#f5f7fa',
      py: 4
    }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: 3 }}>
        {/* Header */}
        <Card sx={{ mb: 4, boxShadow: 3 }}>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <Business sx={{ fontSize: 40, color: '#1976d2', mr: 2 }} />
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#1976d2' }}>
                Electricity and Water Authority
              </Typography>
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#424242', mb: 1 }}>
              STATIONERY REQUIREMENTS FORM
            </Typography>
            <Typography variant="body1" sx={{ color: '#666' }}>
              Please fill out all required fields and add items to generate the requirements sheet
            </Typography>
          </CardContent>
        </Card>

        {/* Contact Information Section */}
        <Card sx={{ mb: 4, boxShadow: 2 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#1976d2', borderBottom: '2px solid #1976d2', pb: 1 }}>
              CONTACT INFORMATION
            </Typography>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
              <TextField
                label="Directorate"
                value={formData.directorate}
                onChange={(e) => handleFormChange('directorate', e.target.value)}
                error={!!errors.directorate}
                helperText={errors.directorate}
                variant="outlined"
                fullWidth
                required
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                InputProps={{
                  startAdornment: <Business sx={{ mr: 1, color: '#1976d2' }} />
                }}
              />

              <TextField
                label="Section"
                value={formData.section}
                onChange={(e) => handleFormChange('section', e.target.value)}
                error={!!errors.section}
                helperText={errors.section}
                variant="outlined"
                fullWidth
                required
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />

              <TextField
                label="Contact Person Name"
                value={formData.contactName}
                onChange={(e) => handleFormChange('contactName', e.target.value)}
                error={!!errors.contactName}
                helperText={errors.contactName}
                variant="outlined"
                fullWidth
                required
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />

              <TextField
                label="Phone Number"
                value={formData.contactPhone}
                onChange={(e) => handleFormChange('contactPhone', e.target.value)}
                error={!!errors.contactPhone}
                helperText={errors.contactPhone}
                variant="outlined"
                fullWidth
                required
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                InputProps={{
                  startAdornment: <Phone sx={{ mr: 1, color: '#1976d2' }} />
                }}
              />

              <TextField
                label="Email Address"
                type="email"
                value={formData.contactEmail}
                onChange={(e) => handleFormChange('contactEmail', e.target.value)}
                error={!!errors.contactEmail}
                helperText={errors.contactEmail}
                variant="outlined"
                fullWidth
                required
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 }, gridColumn: { md: 'span 2' } }}
                InputProps={{
                  startAdornment: <Email sx={{ mr: 1, color: '#1976d2' }} />
                }}
              />
            </Box>
          </CardContent>
        </Card>

        {/* Item Addition Section */}
        <Card sx={{ mb: 4, boxShadow: 2 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#1976d2', borderBottom: '2px solid #1976d2', pb: 1 }}>
              ADD STATIONERY ITEMS
            </Typography>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr 1fr 1fr' }, gap: 2, mb: 3 }}>
              <TextField
                label="Item Description"
                value={currentItem.description}
                onChange={(e) => handleItemChange('description', e.target.value)}
                variant="outlined"
                fullWidth
                multiline
                rows={2}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                InputProps={{
                  startAdornment: <Description sx={{ mr: 1, color: '#1976d2', alignSelf: 'flex-start', mt: 1 }} />
                }}
              />

              <FormControl variant="outlined" fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}>
                <InputLabel>Unit</InputLabel>
                <Select
                  value={currentItem.unit}
                  onChange={(e) => handleItemChange('unit', e.target.value)}
                  label="Unit"
                >
                  <MenuItem value="Piece">Piece</MenuItem>
                  <MenuItem value="Box">Box</MenuItem>
                  <MenuItem value="Pack">Pack</MenuItem>
                  <MenuItem value="Set">Set</MenuItem>
                  <MenuItem value="Ream">Ream</MenuItem>
                  <MenuItem value="Carton">Carton</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Quantity"
                type="number"
                value={currentItem.quantity}
                onChange={(e) => handleItemChange('quantity', e.target.value)}
                variant="outlined"
                fullWidth
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />

              <TextField
                label="Budget (BD)"
                type="number"
                value={currentItem.estimatedBudget}
                onChange={(e) => handleItemChange('estimatedBudget', e.target.value)}
                variant="outlined"
                fullWidth
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={currentItem.budgetAvailable}
                      onChange={(e) => handleItemChange('budgetAvailable', e.target.checked)}
                      sx={{ color: '#1976d2' }}
                    />
                  }
                  label="Budget Available"
                />

                <Button
                  variant="outlined"
                  component="label"
                  sx={{ borderRadius: 2 }}
                >
                  Upload Picture
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePictureChange}
                    style={{ display: 'none' }}
                  />
                </Button>

                {itemPicture && (
                  <Typography variant="body2" sx={{ color: '#4caf50' }}>
                    📷 {itemPicture.name}
                  </Typography>
                )}
              </Box>

              <Button
                variant="contained"
                onClick={handleAddItem}
                disabled={!validateCurrentItem()}
                startIcon={<Add />}
                sx={{ 
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  fontWeight: 600
                }}
              >
                Add Item
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Items Table */}
        {items.length > 0 && (
          <Card sx={{ mb: 4, boxShadow: 2 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#1976d2', borderBottom: '2px solid #1976d2', pb: 1 }}>
                ITEMS LIST ({items.length} items)
              </Typography>

              <TableContainer component={Paper} sx={{ boxShadow: 1, borderRadius: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell sx={{ fontWeight: 600 }}>S.No</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Unit</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Quantity</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Budget (BD)</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Budget Available</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Picture</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {items.map((item, index) => (
                      <TableRow key={index} sx={{ '&:nth-of-type(even)': { backgroundColor: '#fafafa' } }}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{item.description}</TableCell>
                        <TableCell>{item.unit}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.estimatedBudget}</TableCell>
                        <TableCell>
                          <Box sx={{ 
                            color: item.budgetAvailable ? '#4caf50' : '#f44336',
                            fontWeight: 600
                          }}>
                            {item.budgetAvailable ? '✓ Yes' : '✗ No'}
                          </Box>
                        </TableCell>
                        <TableCell>
                          {item.picture ? '📷 Yes' : '❌ No'}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => handleRemoveItem(index)}
                            startIcon={<Delete />}
                            sx={{ borderRadius: 2 }}
                          >
                            Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box sx={{ mt: 2, p: 2, backgroundColor: '#e3f2fd', borderRadius: 2 }}>
                <Typography variant="body2" sx={{ color: '#1976d2' }}>
                  <strong>Total Items:</strong> {items.length} | 
                  <strong> Total Estimated Budget:</strong> {items.reduce((sum, item) => sum + parseFloat(item.estimatedBudget || 0), 0).toFixed(2)} BD
                </Typography>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Error Messages */}
        {errors.items && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {errors.items}
          </Alert>
        )}

        {/* Generate Button */}
        <Card sx={{ boxShadow: 3 }}>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Button
              variant="contained"
              size="large"
              onClick={generateExcel}
              disabled={items.length === 0}
              startIcon={<GetApp />}
              sx={{
                px: 6,
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 700,
                borderRadius: 3,
                textTransform: 'uppercase',
                boxShadow: 3,
                '&:hover': {
                  boxShadow: 6,
                },
                '&:disabled': {
                  backgroundColor: '#ccc',
                  color: '#666'
                }
              }}
            >
              Generate Official Excel Report
            </Button>
            
            <Typography variant="body2" sx={{ mt: 2, color: '#666' }}>
              This will generate an official Excel document with all the stationery requirements
            </Typography>
          </CardContent>
        </Card>

        {/* Footer */}
        <Box sx={{ mt: 6, textAlign: 'center', py: 3, borderTop: '1px solid #ddd' }}>
          <Typography variant="body2" sx={{ color: '#666' }}>
            © 2025 Government Authority - Stationery Requirements Management System
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default FormalStationeryForm;