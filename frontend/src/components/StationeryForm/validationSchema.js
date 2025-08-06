import * as Yup from 'yup';

export const getValidationSchema = (items) => Yup.object({
  directorate: Yup.string().required('Required'),
  section: Yup.string().required('Required'),
  contactName: Yup.string().required('Required'),
  contactPhone: Yup.string().required('Required'),
  contactEmail: Yup.string()
    .email('Invalid email address')
    .matches(/@ewa\.bh$/, 'Only EWA email addresses are allowed')
    .required('Required'),
  itemDescription: Yup.string().test(
    'at-least-one-item',
    'At least one item is required',
    function(value) {
      return items.length > 0 || Boolean(value);
    }
  ),
  unit: Yup.string().test(
    'unit-required',
    'Required',
    function(value) {
      return items.length > 0 || Boolean(value);
    }
  ),
  quantity: Yup.number().test(
    'quantity-required',
    'Required',
    function(value) {
      return items.length > 0 || Boolean(value);
    }
  ).positive('Must be positive'),
  estimatedBudget: Yup.number().test(
    'budget-required',
    'Required',
    function(value) {
      return items.length > 0 || Boolean(value);
    }
  ).positive('Must be positive'),
});