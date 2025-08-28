# 📑 Stationery Requirements Management System

A web-based application for managing stationery requests across authority directorates.  
This system allows staff to submit official requests, attach item images, and generate professional Excel reports automatically.

---

## 🚀 Features

- **Contact Information Form**
  - Directorate, Section, Contact Person, Phone, Email
  - Required field validation

- **Item Management**
  - Add multiple stationery items (description, unit, quantity, budget, availability)
  - Upload an image (required) for each item
  - Preview images before submission
  - View all added items in a structured table
  - Remove items easily

- **Excel Report Generation**
  - Generates an **official Excel (.xlsx)** file with:
    - Government header and title
    - Contact information
    - Styled table of all items
    - Embedded item images in their rows
    - Auto-calculated summary (total items, budgets, availability count)
    - Timestamp footer
  - Professional formatting with modern colors, zebra striping, and borders

- **Validation**
  - All form fields required
  - At least one item must be added
  - Each item must include a picture

---

## 🛠️ Tech Stack

- **Frontend:** React (with Hooks & Functional Components)
- **UI Framework:** [Material-UI (MUI)](https://mui.com/)
- **Excel Export:** [ExcelJS](https://github.com/exceljs/exceljs)
- **File Saving:** [FileSaver.js](https://github.com/eligrey/FileSaver.js)

---

## 📂 Project Structure

```
src/
├── components/
│   ├── StationeryForm/
│   │   └── StationeryForm.js   # Main form component
│   ├── ItemForm.js             # Item input component (if used separately)
│   ├── ItemsTable.js           # Items list display
│   └── ...
├── constants.js                 # Static constants (units, etc.)
├── FormFields.js                # Contact form fields
├── validationSchema.js          # Form validation rules (Yup schema)
├── index.js                     # Entry point
```

---

## ⚙️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/zainab49/EWA.git
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm start
   ```
   The app will be available at [http://localhost:3000](http://localhost:3000).

---

## 📊 Usage

1. Fill in **contact information** (all required).
2. Add stationery items:
   - Enter description, unit, quantity, budget
   - Tick budget availability
   - Upload a **required picture**
   - Click **Add Item**
3. Repeat for multiple items.
4. Click **Generate Official Excel Report** to download the formatted file.

---

## 🖼️ Example Excel Output

- Government title and subtitle
- Contact info
- Items table with pictures
- Totals & summary
- Timestamped footer



---

## 📜 License

This project is licensed under the MIT License.  
You are free to use, modify, and distribute this software.

---

## ✨ Acknowledgements

- [Material-UI](https://mui.com/) for UI components
- [ExcelJS](https://github.com/exceljs/exceljs) for Excel generation
- [FileSaver.js](https://github.com/eligrey/FileSaver.js) for file download support
