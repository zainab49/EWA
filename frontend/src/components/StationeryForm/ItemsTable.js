import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export const ItemsTable = ({ items, handleRemoveItem }) => (
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
              <TableCell>
                {item.picture ? (
                  <img
                    src={item.picture.dataUrl}
                    alt={item.picture.name}
                    style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 8 }}
                  />
                ) : '❌'}
              </TableCell>
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
);