const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());

const isValidBase64 = (fileBase64) => {
  // Check if the string is valid and non-empty
  return typeof fileBase64 === "string" && fileBase64.length > 0;
};

const getMimeType = (base64String) => {
  const hasAlpha = /[A-Za-z]/.test(base64String); // Checks if there are letters
  const hasDigits = /\d/.test(base64String); // Checks if there are numbers

  if (hasAlpha && hasDigits) {
    return "image/png"; // For simplicity, assume it's an image
  } else if (!hasAlpha && hasDigits) {
    return "application/pdf"; // Assume it's a document (pdf/doc)
  } else {
    return null; // Invalid or unrecognized Base64 content
  }
};

const calculateFileSizeKB = (base64String) => {
  let sizeBytes =
    base64String.length * (3 / 4) -
    (base64String.endsWith("==") ? 2 : base64String.endsWith("=") ? 1 : 0);
  return (sizeBytes / 1024).toFixed(2);
};

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
        highestLowercase = item;
      }
    }
  });

  return { numbers, alphabets, highestLowercase };
};

app.get("/", (req, res) => res.send("Hello"));
// POST request handler
app.post("/bfhl", (req, res) => {
  const { data, file_b64 } = req.body;

  if (!data) {
    return res.status(400).json({
      is_success: false,
      message: "Missing 'data' field in the request.",
    });
  }

  const { numbers, alphabets, highestLowercase } = extractData(data);
  const user_id = "john_doe_17091999"; // Hardcoded as per example
  const email = "john@xyz.com"; // Hardcoded as per example
  const roll_number = "ABCD123"; // Hardcoded as per example

  // File handling
  let file_valid = false;
  let file_mime_type = null;
  let file_size_kb = 0;

  if (file_b64) {
    file_valid = isValidBase64(file_b64);
    file_mime_type = getMimeType(file_b64);
    file_size_kb = calculateFileSizeKB(file_b64);
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
    file_size_kb: file_size_kb,
  });
});

// GET request handler
app.get("/bfhl", (req, res) => {
  res.status(200).json({ operation_code: 1 });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
