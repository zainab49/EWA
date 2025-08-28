import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, Button, Select, MenuItem, FormControl, InputLabel, Checkbox, FormControlLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box,  Alert } from '@mui/material';
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
      reader.onload = () => resolve(reader.result);
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
      type: file.type,
      dataUrl,
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
    return currentItem.description && currentItem.unit && currentItem.quantity && currentItem.estimatedBudget && itemPicture;
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
    if (!itemPicture) {
      setErrors((prev) => ({ ...prev, itemPicture: 'Picture is required' }));
      return;
    }
    if (!validateCurrentItem()) return;

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
    setErrors(prev => ({ ...prev, items: '', itemPicture: '' }));
  };

  const handleRemoveItem = (index) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const generateCSV = () => {
    if (!validateForm()) return;

    const headers = ['S.No', 'Item Description', 'Unit', 'Quantity', 'Estimated Budget (BD)', 'Budget Available'];
    const csvData = [
      ['ELECTRICITY AND WATER AUTHORITY'],
      ['STATIONERY REQUIREMENTS FORM'],
      [`Date: ${new Date().toLocaleDateString('en-GB')}`],
      [],
      ['CONTACT INFORMATION'],
      [`Directorate: ${formData.directorate}`],
      [`Section: ${formData.section}`],
      [`Contact Person: ${formData.contactName}`],
      [`Phone Number: ${formData.contactPhone}`],
      [`Email Address: ${formData.contactEmail}`],
      [],
      headers,
      ...items.map((item, index) => [
        index + 1,
        item.description,
        item.unit,
        item.quantity,
        `${item.estimatedBudget} BD`,
        item.budgetAvailable ? 'Yes' : 'No'
      ]),
      [],
      ['SUMMARY'],
      [`Total Items: ${items.length}`],
      [`Items with Budget Available: ${items.filter(item => item.budgetAvailable).length} of ${items.length}`],
      [`Total Estimated Budget: ${items.reduce((sum, item) => sum + parseFloat(item.estimatedBudget || 0), 0).toFixed(3)} BD`]
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `EWA_Stationery_Requirements_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f7fafc',
      padding: '2rem 0',
      fontFamily: 'Georgia, serif'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
        
        {/* Header - Formal Styling */}
        <div style={{
          marginBottom: '2rem',
          backgroundColor: '#ffffff',
          border: '1px solid #cbd5e0',
          borderRadius: '4px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          padding: '2.5rem',
          textAlign: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <svg style={{ width: '36px', height: '36px', marginRight: '1rem', fill: '#1a365d' }} viewBox="0 0 24 24">
              <path d="M12,7V3H2V21H22V7H12M6,19H4V17H6V19M6,15H4V13H6V15M6,11H4V9H6V11M6,7H4V5H6V7M10,19H8V17H10V19M10,15H8V13H10V15M10,11H8V9H10V11M10,7H8V5H10V7M20,19H12V17H20V19M20,15H12V13H20V15M20,11H12V9H20V11Z"/>
            </svg>
            <h1 style={{ 
              fontSize: '2rem',
              fontWeight: '700', 
              color: '#1a365d',
              margin: '0',
              letterSpacing: '0.5px'
            }}>
              ELECTRICITY AND WATER AUTHORITY
            </h1>
          </div>
          <h2 style={{ 
            fontSize: '1.5rem',
            fontWeight: '600', 
            color: '#2d3748', 
            margin: '0.5rem 0',
          }}>
            STATIONERY REQUIREMENTS FORM
          </h2>
          <p style={{ color: '#4a5568', margin: '0', fontSize: '0.9rem' }}>
            Official Form for Stationery Procurement Requests
          </p>
        </div>

        {/* Contact Information Section */}
        <div style={{
          marginBottom: '2rem',
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '4px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
          padding: '2rem'
        }}>
          <h3 style={{ 
            marginBottom: '1.5rem', 
            fontWeight: '600', 
            color: '#1a365d', 
            borderBottom: '2px solid #4a5568', 
            paddingBottom: '0.5rem',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            fontSize: '1.1rem'
          }}>
            Contact Information
          </h3>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '1.5rem' 
          }}>
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                color: '#4a5568', 
                fontWeight: '600',
                fontSize: '0.9rem'
              }}>
                Directorate *
              </label>
              <input
                type="text"
                value={formData.directorate}
                onChange={(e) => handleFormChange('directorate', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: errors.directorate ? '2px solid #e53e3e' : '1px solid #cbd5e0',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  backgroundColor: '#ffffff',
                  fontFamily: 'Georgia, serif'
                }}
              />
              {errors.directorate && (
                <p style={{ color: '#e53e3e', fontSize: '0.8rem', margin: '0.25rem 0 0 0' }}>
                  {errors.directorate}
                </p>
              )}
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                color: '#4a5568', 
                fontWeight: '600',
                fontSize: '0.9rem'
              }}>
                Section *
              </label>
              <input
                type="text"
                value={formData.section}
                onChange={(e) => handleFormChange('section', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: errors.section ? '2px solid #e53e3e' : '1px solid #cbd5e0',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  backgroundColor: '#ffffff',
                  fontFamily: 'Georgia, serif'
                }}
              />
              {errors.section && (
                <p style={{ color: '#e53e3e', fontSize: '0.8rem', margin: '0.25rem 0 0 0' }}>
                  {errors.section}
                </p>
              )}
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                color: '#4a5568', 
                fontWeight: '600',
                fontSize: '0.9rem'
              }}>
                Contact Person Name *
              </label>
              <input
                type="text"
                value={formData.contactName}
                onChange={(e) => handleFormChange('contactName', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: errors.contactName ? '2px solid #e53e3e' : '1px solid #cbd5e0',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  backgroundColor: '#ffffff',
                  fontFamily: 'Georgia, serif'
                }}
              />
              {errors.contactName && (
                <p style={{ color: '#e53e3e', fontSize: '0.8rem', margin: '0.25rem 0 0 0' }}>
                  {errors.contactName}
                </p>
              )}
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                color: '#4a5568', 
                fontWeight: '600',
                fontSize: '0.9rem'
              }}>
                Phone Number *
              </label>
              <input
                type="tel"
                value={formData.contactPhone}
                onChange={(e) => handleFormChange('contactPhone', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: errors.contactPhone ? '2px solid #e53e3e' : '1px solid #cbd5e0',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  backgroundColor: '#ffffff',
                  fontFamily: 'Georgia, serif'
                }}
              />
              {errors.contactPhone && (
                <p style={{ color: '#e53e3e', fontSize: '0.8rem', margin: '0.25rem 0 0 0' }}>
                  {errors.contactPhone}
                </p>
              )}
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                color: '#4a5568', 
                fontWeight: '600',
                fontSize: '0.9rem'
              }}>
                Email Address *
              </label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => handleFormChange('contactEmail', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: errors.contactEmail ? '2px solid #e53e3e' : '1px solid #cbd5e0',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  backgroundColor: '#ffffff',
                  fontFamily: 'Georgia, serif'
                }}
              />
              {errors.contactEmail && (
                <p style={{ color: '#e53e3e', fontSize: '0.8rem', margin: '0.25rem 0 0 0' }}>
                  {errors.contactEmail}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Item Addition Section */}
        <div style={{
          marginBottom: '2rem',
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '4px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
          padding: '2rem'
        }}>
          <h3 style={{ 
            marginBottom: '1.5rem', 
            fontWeight: '600', 
            color: '#1a365d', 
            borderBottom: '2px solid #4a5568', 
            paddingBottom: '0.5rem',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            fontSize: '1.1rem'
          }}>
            Add Stationery Items
          </h3>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '1rem', 
            marginBottom: '1.5rem' 
          }}>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                color: '#4a5568', 
                fontWeight: '600',
                fontSize: '0.9rem'
              }}>
                Item Description
              </label>
              <textarea
                value={currentItem.description}
                onChange={(e) => handleItemChange('description', e.target.value)}
                rows="2"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #cbd5e0',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  backgroundColor: '#ffffff',
                  fontFamily: 'Georgia, serif',
                  resize: 'vertical'
                }}
              />
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                color: '#4a5568', 
                fontWeight: '600',
                fontSize: '0.9rem'
              }}>
                Unit
              </label>
              <select
                value={currentItem.unit}
                onChange={(e) => handleItemChange('unit', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #cbd5e0',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  backgroundColor: '#ffffff',
                  fontFamily: 'Georgia, serif'
                }}
              >
                <option value="">Select Unit</option>
                <option value="Piece">Piece</option>
                <option value="Box">Box</option>
                <option value="Pack">Pack</option>
                <option value="Set">Set</option>
                <option value="Ream">Ream</option>
                <option value="Carton">Carton</option>
              </select>
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                color: '#4a5568', 
                fontWeight: '600',
                fontSize: '0.9rem'
              }}>
                Quantity
              </label>
              <input
                type="number"
                value={currentItem.quantity}
                onChange={(e) => handleItemChange('quantity', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #cbd5e0',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  backgroundColor: '#ffffff',
                  fontFamily: 'Georgia, serif'
                }}
              />
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                color: '#4a5568', 
                fontWeight: '600',
                fontSize: '0.9rem'
              }}>
                Budget (BD)
              </label>
              <input
                type="number"
                step="0.001"
                value={currentItem.estimatedBudget}
                onChange={(e) => handleItemChange('estimatedBudget', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #cbd5e0',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  backgroundColor: '#ffffff',
                  fontFamily: 'Georgia, serif'
                }}
              />
            </div>
          </div>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            flexWrap: 'wrap', 
            gap: '1rem' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                color: '#4a5568',
                fontSize: '0.9rem'
              }}>
                <input
                  type="checkbox"
                  checked={currentItem.budgetAvailable}
                  onChange={(e) => handleItemChange('budgetAvailable', e.target.checked)}
                  style={{ marginRight: '0.5rem' }}
                />
                Budget Available
              </label>

              <label style={{
                padding: '0.5rem 1rem',
                border: '1px solid #4a5568',
                borderRadius: '4px',
                backgroundColor: '#ffffff',
                cursor: 'pointer',
                color: '#4a5568',
                fontSize: '0.9rem'
              }}>
                Upload Picture
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePictureChange}
                  style={{ display: 'none' }}
                />
              </label>

              {itemPicture && (
                <span style={{ color: '#38a169', fontSize: '0.9rem' }}>
                  📷 {itemPicture.name}
                </span>
              )}

              {errors.itemPicture && (
                <span style={{ color: '#e53e3e', fontSize: '0.8rem' }}>
                  {errors.itemPicture}
                </span>
              )}
            </div>

            <button
              onClick={handleAddItem}
              disabled={!validateCurrentItem()}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: validateCurrentItem() ? '#2d3748' : '#a0aec0',
                color: '#ffffff',
                border: 'none',
                borderRadius: '4px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: validateCurrentItem() ? 'pointer' : 'not-allowed',
                fontFamily: 'Georgia, serif'
              }}
            >
              + Add Item
            </button>
          </div>
        </div>

        {/* Items Table */}
        {items.length > 0 && (
          <div style={{
            marginBottom: '2rem',
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '4px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            padding: '2rem'
          }}>
            <h3 style={{ 
              marginBottom: '1.5rem', 
              fontWeight: '600', 
              color: '#1a365d', 
              borderBottom: '2px solid #4a5568', 
              paddingBottom: '0.5rem',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              fontSize: '1.1rem'
            }}>
              Items List ({items.length} items)
            </h3>

            <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '4px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#2d3748' }}>
                    <th style={{ 
                      padding: '1rem', 
                      textAlign: 'left', 
                      color: '#ffffff', 
                      fontWeight: '600',
                      fontSize: '0.9rem'
                    }}>S.No</th>
                    <th style={{ 
                      padding: '1rem', 
                      textAlign: 'left', 
                      color: '#ffffff', 
                      fontWeight: '600',
                      fontSize: '0.9rem'
                    }}>Description</th>
                    <th style={{ 
                      padding: '1rem', 
                      textAlign: 'left', 
                      color: '#ffffff', 
                      fontWeight: '600',
                      fontSize: '0.9rem'
                    }}>Unit</th>
                    <th style={{ 
                      padding: '1rem', 
                      textAlign: 'left', 
                      color: '#ffffff', 
                      fontWeight: '600',
                      fontSize: '0.9rem'
                    }}>Quantity</th>
                    <th style={{ 
                      padding: '1rem', 
                      textAlign: 'left', 
                      color: '#ffffff', 
                      fontWeight: '600',
                      fontSize: '0.9rem'
                    }}>Budget (BD)</th>
                    <th style={{ 
                      padding: '1rem', 
                      textAlign: 'left', 
                      color: '#ffffff', 
                      fontWeight: '600',
                      fontSize: '0.9rem'
                    }}>Budget Available</th>
                    <th style={{ 
                      padding: '1rem', 
                      textAlign: 'left', 
                      color: '#ffffff', 
                      fontWeight: '600',
                      fontSize: '0.9rem'
                    }}>Picture</th>
                    <th style={{ 
                      padding: '1rem', 
                      textAlign: 'left', 
                      color: '#ffffff', 
                      fontWeight: '600',
                      fontSize: '0.9rem'
                    }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={index} style={{ 
                      backgroundColor: index % 2 === 0 ? '#f7fafc' : '#ffffff',
                      borderBottom: '1px solid #e2e8f0'
                    }}>
                      <td style={{ padding: '1rem', fontSize: '0.9rem' }}>{index + 1}</td>
                      <td style={{ padding: '1rem', fontSize: '0.9rem' }}>{item.description}</td>
                      <td style={{ padding: '1rem', fontSize: '0.9rem' }}>{item.unit}</td>
                      <td style={{ padding: '1rem', fontSize: '0.9rem' }}>{item.quantity}</td>
                      <td style={{ padding: '1rem', fontSize: '0.9rem', fontWeight: '600' }}>{item.estimatedBudget}</td>
                      <td style={{ 
                        padding: '1rem', 
                        fontSize: '0.9rem',
                        color: item.budgetAvailable ? '#38a169' : '#e53e3e',
                        fontWeight: '600'
                      }}>
                        {item.budgetAvailable ? 'Yes' : 'No'}
                      </td>
                      <td style={{ padding: '1rem', fontSize: '0.9rem' }}>
                        {item.picture ? '📷 Yes' : '❌ No'}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <button
                          onClick={() => handleRemoveItem(index)}
                          style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: '#e53e3e',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '0.8rem',
                            cursor: 'pointer'
                          }}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ 
              marginTop: '1rem', 
              padding: '1rem', 
              backgroundColor: '#edf2f7', 
              borderRadius: '4px',
              border: '1px solid #cbd5e0'
            }}>
              <p style={{ color: '#2d3748', margin: '0', fontSize: '0.9rem' }}>
                <strong>Total Items:</strong> {items.length} | {' '}
                <strong>Total Estimated Budget:</strong> {items.reduce((sum, item) => sum + parseFloat(item.estimatedBudget || 0), 0).toFixed(3)} BD
              </p>
            </div>
          </div>
        )}

        {/* Error Messages */}
        {errors.items && (
          <div style={{
            marginBottom: '1.5rem',
            padding: '1rem',
            backgroundColor: '#fed7d7',
            border: '1px solid #e53e3e',
            borderRadius: '4px',
            color: '#c53030'
          }}>
            {errors.items}
          </div>
        )}

        {/* Generate Button */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '4px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          padding: '2.5rem',
          textAlign: 'center'
        }}>
          <button
            onClick={generateCSV}
            disabled={items.length === 0}
            style={{
              padding: '1rem 2.5rem',
              fontSize: '1.1rem',
              fontWeight: '700',
              backgroundColor: items.length === 0 ? '#a0aec0' : '#1a365d',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              cursor: items.length === 0 ? 'not-allowed' : 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              fontFamily: 'Georgia, serif',
              boxShadow: items.length === 0 ? 'none' : '0 4px 12px rgba(0,0,0,0.15)'
            }}
          >
            📄 Generate Official Report
          </button>
          
          <p style={{ 
            marginTop: '1rem', 
            color: '#4a5568', 
            fontSize: '0.9rem',
            margin: '1rem 0 0 0'
          }}>
            This will generate an official CSV document with all the stationery requirements
          </p>
        </div>

        {/* Footer */}
        <div style={{ 
          marginTop: '3rem', 
          textAlign: 'center', 
          padding: '1.5rem', 
          borderTop: '1px solid #cbd5e0' 
        }}>
          <p style={{ color: '#4a5568', margin: '0', fontSize: '0.8rem' }}>
            © 2025 Electricity and Water Authority - Stationery Requirements Management System
          </p>
        </div>
      </div>
    </div>
  );
};

export default FormalStationeryForm;