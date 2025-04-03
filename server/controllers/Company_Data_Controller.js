const { db } = require("../db");

const CompanyDataUpload = async (req, res) => {
  try {
    // Check if req.files exists and has properties header_img and footer_img
    if (!req.files || !req.files.header_img || !req.files.footer_img) {
      return res
        .status(400)
        .json({ error: "Logo , header_img and footer_img are required" });
    }

    const { header_img, footer_img, logo, digital_sign } = req.files;
    const {
      company_name,
      company_name_account_name,
      company_name_account_ifsc,
      company_name_account_number,
      bank,
      company_address,
      moblie_no,
      gst_no,
      pan_no,
      email_id,
    } = req.body;

    const headerImagePath =
      "https://crmdemo.vimubds5.a2hosted.com/uploads/" + header_img[0].filename;
    const footerImagePath =
      "https://crmdemo.vimubds5.a2hosted.com/uploads/" + footer_img[0].filename;
    const logoImagePath = "https://crmdemo.vimubds5.a2hosted.com/uploads/" + logo[0].filename;
    const DigitalsignImagePath =
      "https://crmdemo.vimubds5.a2hosted.com/uploads/" + digital_sign[0].filename;

    // Insert header and footer images with the associated company_id
    const insertHeaderFooterImages = await new Promise((resolve, reject) => {
      const sqlImages =
        "INSERT INTO company_profile ( header_img, footer_img, company_name,company_name_account_name,company_name_account_ifsc,company_name_account_number,  bank, company_address, moblie_no,gst_no,pan_no,email_id,logo,digital_sign) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
      const values = [
        headerImagePath,
        footerImagePath,

        company_name,
        company_name_account_name,
        company_name_account_ifsc,
        company_name_account_number,
        bank,
        company_address,
        moblie_no,
        gst_no,
        pan_no,

        email_id,
        logoImagePath,

        DigitalsignImagePath,
      ];

      db.query(sqlImages, values, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    res.status(201).json({
      success: true,
      message: " Company profile uploaded successfully",
    });
  } catch (error) {
    console.error(
      "Error uploading company data and header/footer images:",
      error
    );
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const company_name_header_footer = async (req, res) => {
  try {
    const { company_name } = req.body;
    console.log(company_name);
    const result = await new Promise((resolve, reject) => {
      const sql = "SELECT * FROM company_profile WHERE company_name = ?";
      console.log(sql);
      db.query(sql, [company_name], (err, result) => {
        if (err) {
          console.error("Error fetching header and footer images:", err);
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    if (result.length === 0) {
      return res
        .status(404)
        .json({ error: "Header and footer images not found" });
    }
    console.log(result);

    const images = result[0];
    res.status(200).json(images);
  } catch (error) {
    console.error("Error fetching header and footer images:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getcompany_name_data = async (req, res) => {
  try {
    const { company_name } = req.body;
    console.log(company_name);
    const result = await new Promise((resolve, reject) => {
      const sql = "SELECT * FROM  company_profile WHERE company_name = ?";
      console.log(sql);
      db.query(sql, [company_name], (err, result) => {
        if (err) {
          console.error("Error fetching company data :", err);
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    if (result.length === 0) {
      return res.status(404).json({ error: "company data not found" });
    }
    console.log(result);

    const invoice_data = result[0];
    console.log(invoice_data);
    res.status(200).json(invoice_data);
  } catch (error) {
    console.error("Error fetching Invoice data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const fetchcompanyname = async (req, res) => {
  try {
    const UserId = req.params.UserId;
    const query = "SELECT * FROM company_profile "; // Query to retrieve unique company names

    db.query(query, [UserId], (err, results) => {
      if (err) {
        console.error("Error fetching company names:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        const companyNames = results.map((row) => row.company_name); // Extract company names from the query results
        res.status(200).json(companyNames); // Send company names as JSON response
      }
    });
  } catch (error) {
    console.error("Error fetching company names:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getCompanydata = async (req, res) => {
  try {
    const sql = "SELECT * FROM company_profile";

    const company_data = await new Promise((resolve, reject) => {
      db.query(sql, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });

    res.status(200).json(company_data);
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteCompanydata = async (req, res) => {
  try {
    const { company_name } = req.body;

    // Implement logic to delete the service with the specified ID from your database
    const result = await new Promise((resolve, reject) => {
      db.query(
        "DELETE FROM company_profile WHERE company_name = ?",
        [company_name],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });

    // Check if a row was affected to determine if the service was found and deleted
    if (result.affectedRows > 0) {
      res
        .status(200)
        .json({ success: true, message: "Companydata deleted successfully" });
    } else {
      res.status(404).json({ error: "Companydata not found" });
    }
  } catch (error) {
    console.error("Error deleting Companydata:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateCompanyData = async (req, res) => {
  try {
    // Check if req.files exists and has properties header_img and footer_img
    if (!req.files || !req.files.header_img || !req.files.footer_img) {
      return res
        .status(400)
        .json({ error: "Both header_img and footer_img are required" });
    }

    const { header_img, footer_img, logo, digital_sign } = req.files;
    const {
      company_name,
      company_name_account_name,
      company_name_account_ifsc,
      company_name_account_number,
      bank,
      company_address,
      moblie_no,
      gst_no,
      pan_no,
      email_id,
    } = req.body;

    const headerImagePath =
      "https://crmdemo.vimubds5.a2hosted.com/uploads/" + header_img[0].filename;
    const footerImagePath =
      "https://crmdemo.vimubds5.a2hosted.com/uploads/" + footer_img[0].filename;
    const logoImagePath = "https://crmdemo.vimubds5.a2hosted.com/uploads/" + logo[0].filename;
    const DigitalsignImagePath =
      "https://crmdemo.vimubds5.a2hosted.com/uploads/" + digital_sign[0].filename;

    // Update header and footer images with the associated company_id
    const updateHeaderFooterImages = await new Promise((resolve, reject) => {
      const sqlImages = `
        UPDATE company_profile 
        SET 
          header_img = ?,
          footer_img = ?,
        
          company_name = ?,
          company_name_account_name = ?,
          company_name_account_ifsc = ?,
          company_name_account_number = ?,
          bank = ? ,
          company_address = ?,
          moblie_no = ?,
          gst_no = ?,
          pan_no=?,
          email_id = ?,
          logo = ? ,
        
          digital_sign = ?
        
        WHERE id = ? `;
      const values = [
        headerImagePath,
        footerImagePath,

        company_name,
        company_name_account_name,
        company_name_account_ifsc,
        company_name_account_number,
        bank,
        company_address,
        moblie_no,
        gst_no,
        pan_no,
        email_id,
        logoImagePath,

        DigitalsignImagePath,
        req.params.id,
      ];

      db.query(sqlImages, values, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    res.status(200).json({
      success: true,
      message: "Header and Footer images updated successfully",
    });
  } catch (error) {
    console.error(
      "Error updating company data and header/footer images:",
      error
    );
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  CompanyDataUpload,
  company_name_header_footer,
  fetchcompanyname,
  deleteCompanydata,
  updateCompanyData,
  getCompanydata,
  getcompany_name_data,
};
