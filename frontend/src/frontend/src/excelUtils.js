import * as XLSX from 'xlsx';

export const generateExcel = (formikValues, items) => {
  const excelData = [
    ['Directorate:', formikValues.directorate],
    ['Section:', formikValues.section],
    ['Contact Person:', formikValues.contactName],
    ['Tel No.:', formikValues.contactPhone],
    ['Email:', formikValues.contactEmail],
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