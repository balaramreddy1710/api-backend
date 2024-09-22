const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Utility function to process data
function processData(data) {
  let numbers = [];
  let alphabets = [];
  let highestLowercase = [];

  data.forEach((item) => {
    if (/^\d+$/.test(item)) {
      numbers.push(item);
    } else if (/^[A-Za-z]$/.test(item)) {
      alphabets.push(item);
      if (item === item.toLowerCase()) {
        highestLowercase.push(item);
      }
    }
  });

  if (highestLowercase.length > 0) {
    highestLowercase = [highestLowercase.sort().pop()]; // Get the highest lowercase letter
  } else {
    highestLowercase = [];
  }

  return { numbers, alphabets, highestLowercase };
}
app.get("/", (req, res) => res.send("Hello"));
// POST Method
app.post("/bfhl", (req, res) => {
  try {
    const { data, file_b64 } = req.body;

    const user_id = "john_doe_17091999";
    const email = "john@xyz.com";
    const roll_number = "ABCD123";

    // Process the input data
    const { numbers, alphabets, highestLowercase } = processData(data);

    // Handle file validation
    let fileValid = false;
    let fileMimeType = "";
    let fileSizeKb = 0;

    if (file_b64) {
      try {
        const fileBuffer = Buffer.from(file_b64, "base64"); // Use Buffer instead of atob
        fileSizeKb = (fileBuffer.length / 1024).toFixed(2); // Convert bytes to KB
        fileValid = true;
        fileMimeType = "application/octet-stream"; // You can add more MIME type logic if needed
      } catch (err) {
        fileValid = false;
      }
    }

    // Create the response object
    const response = {
      is_success: true,
      user_id: userId,
      email: email,
      roll_number: rollNumber,
      numbers: numbers,
      alphabets: alphabets,
      highest_lowercase_alphabet: highestLowercase,
      file_valid: fileValid,
      file_mime_type: fileMimeType,
      file_size_kb: fileSizeKb,
    };

    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({ is_success: false, error: error.message });
  }
});

// GET Method
app.get("/bfhl", (req, res) => {
  res.json({
    operation_code: 1,
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;
