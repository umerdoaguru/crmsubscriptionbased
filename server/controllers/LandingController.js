const moment = require("moment-timezone");
const { db } = require("../db");
const bcrypt = require("bcryptjs");
const { sendEmail } = require("../utils/emailService");

const registerLandingAdmin = async (req, res) => {
  try {
    const { lpa_name, lpa_email, lpa_phone, lpa_password } = req.body;
    const dateTime = moment().tz("Asia/Kolkata").format("DD-MM-YYYY HH:mm:ss");

    const checkQuery = `SELECT * FROM landing_page_admin WHERE lpa_email = ?`;
    db.query(checkQuery, [lpa_email], async (err, results) => {
      if (err) {
        return res.status(500).json({ success: false, message: err.message });
      }

      if (results.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Email already registered",
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(lpa_password, salt);

      const insertQuery = `
        INSERT INTO landing_page_admin 
        (lpa_name, lpa_email, lpa_phone, lpa_password, lpa_created_at)
        VALUES (?, ?, ?, ?, ?)
      `;

      const insertParams = [
        lpa_name,
        lpa_email,
        lpa_phone,
        hashedPassword,
        dateTime,
      ];

      db.query(insertQuery, insertParams, (err, result) => {
        if (err) {
          return res.status(400).json({ success: false, message: err.message });
        }

        return res.status(201).json({
          success: true,
          message: "Admin created successfully",
        });
      });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const landingAdminlogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: "Invalid email or password",
      });
    }

    const checkUserQuery =
      "SELECT * FROM landing_page_admin WHERE lpa_email = ?";
    db.query(checkUserQuery, [email], async (err, results) => {
      if (err) {
        return res.status(500).send({
          success: false,
          message: "Database error",
          error: err.message,
        });
      }

      if (results.length === 0) {
        return res.status(404).send({
          success: false,
          message: "Email is not registered",
        });
      }

      const user = results[0];

      if (user.lpa_status !== "active") {
        return res.status(403).send({
          success: false,
          message: "Your account is inactive. Please contact support.",
        });
      }

      const match = await bcrypt.compare(password, user.lpa_password);
      if (!match) {
        return res.status(401).send({
          success: false,
          message: "Invalid password",
        });
      }

      const token = JWT.sign({ id: user.lpa_id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      res.status(200).send({
        success: true,
        message: "Login successful",
        user: {
          ...user,
          token,
        },
      });
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in login",
      error: error.message,
    });
  }
};

const sendOtpForlandAdmin = (req, res) => {
  const { email } = req.body;

  const selectQuery = "SELECT * FROM landing_page_admin WHERE lpa_email = ?";

  db.query(selectQuery, email, async (err, result) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }

    if (!result || result.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Email not found" });
    }

    // Generate a 6-digit numeric OTP
    const OTP = Math.floor(100000 + Math.random() * 900000).toString();

    try {
      await sendEmail(
        email,
        "CRMGuru Admin Password Reset OTP",
        `Your OTP for password reset is: ${OTP}`
      );

      const updateQuery =
        "INSERT INTO otpcollections (email, code) VALUES (?, ?) ON DUPLICATE KEY UPDATE code = VALUES(code)";
      db.query(updateQuery, [email, OTP], (upErr) => {
        if (upErr) {
          return res
            .status(400)
            .json({ success: false, message: upErr.message });
        }
        return res
          .status(200)
          .json({ success: true, message: "OTP sent successfully" });
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });
};

const createBlog = (req, res) => {
  try {
    const { blog_title, excerpt, blog_content, blog_author, status } = req.body;

    if (!blog_title || !blog_content) {
      return res.status(400).send({
        success: false,
        message: "Title and content are required",
      });
    }

    let slug = slugify(blog_title, { lower: true, strict: true });

    const feature_image = req.file ? `/blog_image/${req.file.filename}` : null;

    const checkSlugQuery =
      "SELECT lb_blog_id FROM landing_page_blogs WHERE blog_slug = ? LIMIT 1";
    db.query(checkSlugQuery, [slug], (err, existing) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .send({ success: false, message: "Database error" });
      }

      if (existing.length > 0) {
        slug = `${slug}`;
      }

      const insertQuery = `
        INSERT INTO landing_page_blogs 
        (blog_title, blog_slug, excerpt, blog_content, feature_image_url, blog_author, blog_published_status) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      const values = [
        blog_title,
        slug,
        excerpt || null,
        blog_content,
        feature_image,
        blog_author || "admin",
        status,
      ];

      db.query(insertQuery, values, (err, result) => {
        if (err) {
          console.error(err);
          return res
            .status(500)
            .send({ success: false, message: "Insert failed" });
        }

        const getQuery =
          "SELECT * FROM landing_page_blogs WHERE lb_blog_id  = ?";
        db.query(getQuery, [result.insertId], (err, rows) => {
          if (err) {
            console.error(err);
            return res
              .status(500)
              .send({ success: false, message: "Fetch failed" });
          }

          return res.status(201).send({
            success: true,
            message: "Blog created successfully",
            data: rows[0],
          });
        });
      });
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({
      success: false,
      message: "Server error",
    });
  }
};

const getAllBlogs = (req, res) => {
  try {
    const selectQuery = `select * from landing_page_blogs`;
    db.query(selectQuery, (err, result) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }
      return res.status(200).send(result);
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getBlogsById = (req, res) => {
  try {
    const bid = req.params.bid;
    const selectQuery = `select * from landing_page_blogs where lb_blog_id = ?`;
    db.query(selectQuery, bid, (err, result) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }
      return res.status(200).send(result);
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteBlogsById = (req, res) => {
  try {
    const bid = req.params.bid;
    const deleteQuery = `delete from landing_page_blogs where lb_blog_id = ?`;
    db.query(deleteQuery, bid, (err, result) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }
      return res.status(200).send(result);
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateBlog = (req, res) => {
  try {
    const { id } = req.params;
    const { blog_title, excerpt, blog_content, blog_author, status } = req.body;
    const dateTime = moment().tz("Asia/Kolkata").format("DD-MM-YYYY HH:mm:ss");

    const feature_image = req.file ? `/blog_image/${req.file.filename}` : null;

    const checkQuery = "SELECT * FROM landing_page_blogs WHERE lb_blog_id = ?";
    db.query(checkQuery, [id], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send({
          success: false,
          message: "Database error while fetching blog",
        });
      }

      if (results.length === 0) {
        return res.status(404).send({
          success: false,
          message: "Blog not found",
        });
      }

      const existingBlog = results[0];
      let slug = existingBlog.blog_slug;

      if (blog_title && blog_title !== existingBlog.blog_title) {
        slug = slugify(blog_title, { lower: true, strict: true });
      }

      const fieldsToUpdate = [];
      const values = [];

      if (blog_title) {
        fieldsToUpdate.push("blog_title = ?");
        values.push(blog_title);
      }
      if (slug) {
        fieldsToUpdate.push("blog_slug = ?");
        values.push(slug);
      }
      if (excerpt) {
        fieldsToUpdate.push("excerpt = ?");
        values.push(excerpt);
      }
      if (blog_content) {
        fieldsToUpdate.push("blog_content = ?");
        values.push(blog_content);
      }
      if (feature_image) {
        fieldsToUpdate.push("feature_image_url = ?");
        values.push(feature_image);
      }
      if (blog_author) {
        fieldsToUpdate.push("blog_author = ?");
        values.push(blog_author);
      }
      if (status) {
        fieldsToUpdate.push("blog_published_status = ?");
        values.push(status);
      }

      fieldsToUpdate.push("blog_updated_at = ?");
      values.push(dateTime);

      if (fieldsToUpdate.length === 0) {
        return res.status(400).send({
          success: false,
          message: "No fields provided for update",
        });
      }

      const updateQuery = `
        UPDATE landing_page_blogs 
        SET ${fieldsToUpdate.join(", ")} 
        WHERE lb_blog_id = ?
      `;
      values.push(id);

      db.query(updateQuery, values, (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send({
            success: false,
            message: "Failed to update blog",
          });
        }

        db.query(checkQuery, [id], (err, updatedRows) => {
          if (err) {
            console.error(err);
            return res.status(500).send({
              success: false,
              message: "Error fetching updated blog",
            });
          }

          return res.status(200).send({
            success: true,
            message: "Blog updated successfully",
            data: updatedRows[0],
          });
        });
      });
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({
      success: false,
      message: "Server error",
    });
  }
};

const getOnlyPublishedBlogs = (req, res) => {
  try {
    const selectQuery = `select * from landing_page_blogs where blog_published_status = 'yes'`;
    db.query(selectQuery, (err, result) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }
      return res.status(200).send(result);
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  registerLandingAdmin,
  landingAdminlogin,
  sendOtpForlandAdmin,
  createBlog,
  getAllBlogs,
  getBlogsById,
  deleteBlogsById,
  updateBlog,
  getOnlyPublishedBlogs,
};
