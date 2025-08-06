import React from 'react';
import { 
  Grid,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { unitOptions } from './constants';

export const ItemForm = ({ 
  formik, 
  itemPicture, 
  handlePictureChange, 
  handleAddItem 
}) => (
  <>
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
        <FormControl fullWidth>
          <InputLabel id="unit-label">Unit</InputLabel>
          <Select
            labelId="unit-label"
            id="unit"
            name="unit"
            label="Unit"
            value={formik.values.unit}
            onChange={formik.handleChange}
            error={formik.touched.unit && Boolean(formik.errors.unit)}
          >
            {unitOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
          {formik.touched.unit && formik.errors.unit && (
            <Typography color="error" variant="caption">
              {formik.errors.unit}
            </Typography>
          )}
        </FormControl>
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
  </>
);