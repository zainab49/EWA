import React from 'react';
import { Grid, TextField } from '@mui/material';

export const FormFields = ({ formik }) => (
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
);