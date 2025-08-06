# Stationery Requirements Form

This project is a React application that provides a form for entering stationery requirements. It allows users to input details such as directorate, section, contact information, and a list of items needed. The application utilizes Formik for form handling and Yup for validation.

## Project Structure

```
frontend
├── src
│   ├── App.js               # Main component containing the StationeryForm
│   ├── excelUtils.js        # Utility functions for generating Excel files
│   └── index.js             # Entry point for the React application
├── package.json             # npm configuration file
└── README.md                # Documentation for the project
```

## Features

- **Form Handling**: Uses Formik to manage form state and validation.
- **Validation**: Implements Yup for validating user inputs.
- **Excel Export**: Generates an Excel file containing the entered stationery requirements.
- **Dynamic Item List**: Allows users to add multiple items with descriptions, units, quantities, and estimated budgets.

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd frontend
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Usage

To start the application, run:
```
npm start
```
This will launch the application in your default web browser.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.