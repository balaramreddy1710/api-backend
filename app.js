const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());

// Check if Base64 string is valid (non-empty)
const isValidBase64 = (fileBase64) => {
  return typeof fileBase64 === "string" && fileBase64.length > 0;
};

// Determine MIME type based on Base64 string content
const getMimeType = (base64String) => {
  const hasAlpha = /[A-Za-z]/.test(base64String); // Check for letters
  const hasDigits = /\d/.test(base64String); // Check for numbers

  if (hasAlpha && hasDigits) {
    return "image/png"; // Treat as image
  } else if (!hasAlpha && hasDigits) {
    return "doc/pdf"; // Treat as document (pdf/doc)
  } else {
    return null; // Invalid or unrecognized Base64 content
  }
};

// Calculate file size in KB
const calculateFileSizeKB = (base64String) => {
  const cleanBase64String = base64String.split(",").pop(); // Remove prefix
  let paddingBytes = 0;

  if (cleanBase64String.endsWith("==")) {
    paddingBytes = 2;
  } else if (cleanBase64String.endsWith("=")) {
    paddingBytes = 1;
  }

  const sizeBytes = (cleanBase64String.length * 3) / 4 - paddingBytes; // Calculate size
  return (sizeBytes / 1024).toFixed(2); // Convert to KB
};

// Extract numbers, alphabets, and highest lowercase alphabet
const extractData = (inputArray) => {
  let numbers = [];
  let alphabets = [];
  let highestLowercase = "";

  inputArray.forEach((item) => {
    if (!isNaN(item)) {
      numbers.push(item);
    } else if (/[a-zA-Z]/.test(item)) {
      alphabets.push(item);
      if (item === item.toLowerCase() && item > highestLowercase) {
        highestLowercase = item; // Track the highest lowercase letter
      }
    }
  });

  return { numbers, alphabets, highestLowercase };
};

// POST request handler
app.post("/", (req, res) => {
  const { data, file_b64 } = req.body;

  if (!data) {
    return res.status(400).json({
      is_success: false,
      message: "Missing 'data' field in the request.",
    });
  }

  const { numbers, alphabets, highestLowercase } = extractData(data);
  const user_id = "john_doe_17091999"; // Hardcoded for example
  const email = "john@xyz.com"; // Hardcoded for example
  const roll_number = "ABCD123"; // Hardcoded for example

  // File handling
  let file_valid = false;
  let file_mime_type = null;
  let file_size_kb = "0";

  if (file_b64) {
    file_valid = isValidBase64(file_b64);
    if (file_valid) {
      file_mime_type = getMimeType(file_b64);
      file_size_kb = calculateFileSizeKB(file_b64);
    }
  }

  return res.status(200).json({
    is_success: true,
    user_id: user_id,
    email: email,
    roll_number: roll_number,
    numbers: numbers,
    alphabets: alphabets,
    highest_lowercase_alphabet: highestLowercase ? [highestLowercase] : [],
    file_valid: file_valid,
    file_mime_type: file_mime_type,
    file_size_kb: file_valid ? file_size_kb : "0",
  });
});

// GET request handler (hardcoded response)
app.get("/", (req, res) => {
  res.status(200).json({ operation_code: 1 });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
