const { db } = require("../db");

const createInvoice = async (req, res) => {
  try {
    const {
      invoice_name,
      services,
      invoice_no,
      invoice_address,
      payment_mode,
      client_gst_no,
      client_gst_per,
      client_pan_no,
      company_type,
      invoice_date,
      duration_start_date,
      duration_end_date,
    } = req.body;
    const { employeeId } = req.body; // Assuming employeeId is retrieved from the authenticated user

    if (!invoice_name || !services || services.length === 0) {
      return res
        .status(400)
        .json({ error: "Invoice name and Invoice services are required" });
    }

    // Insert Invoice with employeeId
    const sqlInvoice =
      "INSERT INTO invoice_data (invoice_name,  invoice_no, employeeId,invoice_address,payment_mode,  client_gst_no,  client_gst_per, client_pan_no,company_type,invoice_date,duration_start_date, duration_end_date) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)";
    const resultInvoice = await new Promise((resolve, reject) => {
      db.query(
        sqlInvoice,
        [
          invoice_name,
          invoice_no,
          employeeId,
          invoice_address,
          payment_mode,
          client_gst_no,
          client_gst_per,
          client_pan_no,
          company_type,
          invoice_date,
          duration_start_date,
          duration_end_date,
        ],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });

    // Get Invoice ID and name
    const invoiceId = resultInvoice.insertId;
    const invoiceName = invoice_name;

    // Insert services with the associated Invoice_id and Invoice_name
    const sqlServices =
      "INSERT INTO invoice_services_data (invoice_id,invoice_name,service_type,service_name,actual_price,offer_price,subscription_frequency) VALUES ?";
    const servicesValues = services.map((service) => [
      invoiceId,
      invoiceName,
      service.service_type,
      service.service_name,
      service.actual_price,
      service.offer_price,
      service.subscription_frequency,
    ]);

    await new Promise((resolve, reject) => {
      db.query(sqlServices, [servicesValues], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    res.status(200).json({
      success: true,
      message: "Invoice and services added successfully",
      invoice: {
        id: invoiceId,
        invoice_name: invoiceName,
      },
    });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getInvoice = async (req, res) => {
  try {
    const sql = "SELECT * FROM invoice_data ORDER BY invoice_id DESC";

    const invoices = await new Promise((resolve, reject) => {
      db.query(sql, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });

    res.status(200).json(invoices);
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllInvoice = async (req, res) => {
  try {
    const sql = `SELECT * FROM  
    invoice_data 
    JOIN  invoice_services_data ON invoice_data.invoice_id = invoice_services_data.invoice_id `;

    const allQuotations = await new Promise((resolve, reject) => {
      db.query(sql, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });

    res.status(200).json({ message: "Successfull", data: allQuotations });
  } catch (error) {
    console.error("Error processing request:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", success: false, error });
  }
};

const getInvoiceAddress = async (req, res) => {
  try {
    const { id } = req.params;
    // Write a SQL query to retrieve the invoice address based on the invoice ID
    const sql = "SELECT * FROM invoice_data WHERE invoice_id = ?";

    // Execute the query
    db.query(sql, [id], (err, results) => {
      if (err) {
        console.error("Error fetching invoice address:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        if (results.length > 0) {
          // If the invoice address is found, send it as a response
          res.status(200).json(results);
        } else {
          // If no invoice address is found for the given ID, send a 404 response
          res.status(404).json({ error: "Invoice address not found" });
        }
      }
    });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteInvoice = async (req, res) => {
  try {
    const { id } = req.params;

    // Begin a transaction
    await new Promise((resolve, reject) => {
      db.beginTransaction((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    // Delete services associated with the invoice
    const sqlDeleteServices =
      "DELETE FROM invoice_services_data WHERE invoice_id = ?";
    await new Promise((resolve, reject) => {
      db.query(sqlDeleteServices, [id], (err, result) => {
        if (err) {
          // Rollback the transaction if an error occurs
          db.rollback(() => reject(err));
        } else {
          resolve(result);
        }
      });
    });

    // Delete the invoice itself
    const sqlDeleteInvoice = "DELETE FROM invoice_data WHERE invoice_id = ?";
    await new Promise((resolve, reject) => {
      db.query(sqlDeleteInvoice, [id], (err, result) => {
        if (err) {
          // Rollback the transaction if an error occurs
          db.rollback(() => reject(err));
        } else {
          resolve(result);
        }
      });
    });

    // Commit the transaction
    await new Promise((resolve, reject) => {
      db.commit((err) => {
        if (err) {
          // Rollback the transaction if an error occurs during commit
          db.rollback(() => reject(err));
        } else {
          resolve();
        }
      });
    });

    // Delete notes associated with the invopice
    const sqlDeleteNotes = "DELETE FROM invoice_notes WHERE invoice_id = ?";
    await new Promise((resolve, reject) => {
      db.query(sqlDeleteNotes, [id], (err, result) => {
        if (err) {
          // Rollback the transaction if an error occurs
          db.rollback(() => reject(err));
        } else {
          resolve(result);
        }
      });
    });

    res.status(200).json({
      success: true,
      message:
        "Invoice ,  Invoice services , Invoice Notes  deleted successfully",
    });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const UpdateInvoiceName = async (req, res) => {
  try {
    const { invoiceId } = req.params; // Extracting invoiceId from req.params
    const {
      newName,
      newAddress,
      newpaymentMode,
      newClient_GST_no,
      newClient_GST_per,
      newClient_Pan_no,
      newcompany_type,
    } = req.body; // Extracting new invoice name from req.body

    // Construct SQL query to update the invoice name
    const sql =
      "UPDATE invoice_data SET invoice_name = ? , invoice_address=?, payment_mode = ? , client_gst_no	= ? ,client_gst_per	= ? ,client_pan_no	= ? , company_type = ?  WHERE invoice_id = ?";

    // Execute the update query asynchronously
    await new Promise((resolve, reject) => {
      db.query(
        sql,
        [
          newName,
          newAddress,
          newpaymentMode,
          newClient_GST_no,
          newClient_GST_per,
          newClient_Pan_no,
          newcompany_type,
          invoiceId,
        ],
        (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        }
      );
    });
    const sql2 =
      "UPDATE invoice_services_data SET invoice_name = ? WHERE invoice_id = ?";

    // Execute the update query asynchronously
    await new Promise((resolve, reject) => {
      db.query(sql2, [newName, invoiceId], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });

    res.status(200).json({ message: "Invoice name updated successfully" });
  } catch (error) {
    console.error("Error updating Invoice name:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const UpdateInvoice_No = async (req, res) => {
  try {
    const { invoiceId } = req.params; // Extracting invoiceId from req.params
    const { newInvoice_no } = req.body; // Extracting new invoice name from req.body

    // Construct SQL query to update the invoice name
    const sql = "UPDATE invoice_data SET invoice_no = ?  WHERE invoice_id = ?";

    // Execute the update query asynchronously
    await new Promise((resolve, reject) => {
      db.query(sql, [newInvoice_no, invoiceId], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });

    res.status(200).json({ message: "Invoice number updated successfully" });
  } catch (error) {
    console.error("Error updating Invoice number:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const UpdateInvoice_date = async (req, res) => {
  try {
    const { invoiceId } = req.params; // Extracting invoiceId from req.params
    const { newInvoice_date } = req.body; // Extracting new invoice name from req.body

    // Construct SQL query to update the invoice name
    const sql =
      "UPDATE invoice_data SET invoice_date = ?  WHERE invoice_id = ?";

    // Execute the update query asynchronously
    await new Promise((resolve, reject) => {
      db.query(sql, [newInvoice_date, invoiceId], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });

    res.status(200).json({ message: "Invoice date updated successfully" });
  } catch (error) {
    console.error("Error updating Invoice date:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// const UpdateInvoice_date = async (req, res) => {
//   try {
//     const { invoiceId } = req.params; // Extracting invoiceId from req.params
//     const { newInvoice_date } = req.body; // Extracting new invoice date from req.body

//     // Convert the newInvoice_date to UTC timestamp
//     const newDate = new Date(newInvoice_date);
//     const utcInvoiceDate = new Date(Date.UTC(newDate.getFullYear(), newDate.getMonth(), newDate.getDate()));

//     // Construct SQL query to update the invoice date
//     const sql = "UPDATE invoice_data SET invoice_date = ? WHERE invoice_id = ?";

//     // Execute the update query asynchronously
//     await new Promise((resolve, reject) => {
//       db.query(
//         sql,
//         [utcInvoiceDate, invoiceId],
//         (err, results) => {
//           if (err) {
//             reject(err);
//           } else {
//             resolve(results);
//           }
//         }
//       );
//     });

//     res.status(200).json({ message: "Invoice date updated successfully" });
//   } catch (error) {
//     console.error("Error updating Invoice date:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

const getInvoiceDate = async (req, res) => {
  try {
    const { id } = req.params;
    const query = "SELECT invoice_date FROM invoice_data WHERE invoice_id = ?";
    db.query(query, [id], (err, results) => {
      if (err) {
        console.error("Error fetching invoice date:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        if (results.length > 0) {
          const invoiceDate = results[0].invoice_date;
          res.status(200).json({ invoiceDate });
        } else {
          res.status(404).json({ error: "Invoice not found" });
        }
      }
    });
  } catch (error) {
    console.error("Error fetching invoice date:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const UpdateInvoice_start_date = async (req, res) => {
  try {
    const { invoiceId } = req.params; // Extracting invoiceId from req.params
    const { newInvoice_start_date } = req.body; // Extracting new invoice name from req.body

    // Construct SQL query to update the invoice name
    const sql =
      "UPDATE invoice_data SET duration_start_date = ?  WHERE invoice_id = ?";

    // Execute the update query asynchronously
    await new Promise((resolve, reject) => {
      db.query(sql, [newInvoice_start_date, invoiceId], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });

    res
      .status(200)
      .json({ message: "Invoice Start Date updated successfully" });
  } catch (error) {
    console.error("Error updating Invoice Start Date :", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const UpdateInvoice_end_date = async (req, res) => {
  try {
    const { invoiceId } = req.params; // Extracting invoiceId from req.params
    const { newInvoice_end_date } = req.body; // Extracting new invoice name from req.body

    // Construct SQL query to update the invoice name
    const sql =
      "UPDATE invoice_data SET duration_end_date = ?  WHERE invoice_id = ?";

    // Execute the update query asynchronously
    await new Promise((resolve, reject) => {
      db.query(sql, [newInvoice_end_date, invoiceId], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });

    res
      .status(200)
      .json({ message: "Invoice Start Date  updated successfully" });
  } catch (error) {
    console.error("Error updating Invoice Start Date :", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const GetInvoiceName = async (req, res) => {
  try {
    const { invoiceId } = req.params; // Extracting UserId from req.params
    const sql = "SELECT * FROM invoice_data WHERE invoice_id = ? ";

    const invoice = await new Promise((resolve, reject) => {
      db.query(sql, [invoiceId], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });

    res.status(200).json(invoice);
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const invoiceserviceid = (req, res) => {
  try {
    const invoice_id = req.params.id;

    const getQuery = `SELECT * FROM invoice_services_data WHERE invoice_id = ?`;

    db.query(getQuery, invoice_id, (error, result) => {
      if (error) {
        console.log("Invoice not found", error);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.status(200).json(result);
      }
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteServiceInvoice = async (req, res) => {
  try {
    const { serviceId } = req.params;

    // Implement logic to delete the service with the specified ID from your database
    const result = await new Promise((resolve, reject) => {
      db.query(
        "DELETE FROM invoice_services_data WHERE service_invoice_id = ?",
        [serviceId],
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
      res.status(200).json({
        success: true,
        message: "Invoice Service deleted successfully",
      });
    } else {
      res.status(404).json({ error: "Service not found" });
    }
  } catch (error) {
    console.error("Error deleting service:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const addServicesInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const { invoice_name, services } = req.body;

    if (!id || !invoice_name || !services || services.length === 0) {
      return res
        .status(400)
        .json({ error: "Invoice ID, name, and Invoice services are required" });
    }

    const servicesValues = services.map((service) => [
      id,
      invoice_name,
      service.service_type,
      service.service_name,

      service.actual_price,
      service.offer_price,
      service.subscription_frequency,
    ]);

    const sql =
      "INSERT INTO invoice_services_data (invoice_id,invoice_name,service_type,service_name,actual_price,offer_price,subscription_frequency) VALUES ?";

    await new Promise((resolve, reject) => {
      db.query(sql, [servicesValues], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    res
      .status(201)
      .json({ success: true, message: "Invoice Services added successfully" });
  } catch (error) {
    console.error("Error adding invoice services:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateServicesInvoice = async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const { services } = req.body;

    const updateServicePromises = services.map(async (service) => {
      const sqlUpdateService = `
        UPDATE invoice_services_data
        SET
          service_type = ?,
          service_name = ?,
          actual_price = ?,
          offer_price = ?,
          subscription_frequency = ?
        WHERE
          invoice_id = ? AND  service_invoice_id = ?`;

      const values = [
        service.service_type,
        service.service_name,
        service.actual_price,
        service.offer_price,
        service.subscription_frequency,
        invoiceId,
        service.service_invoice_id,
      ];

      await db.query(sqlUpdateService, values);
    });

    await Promise.all(updateServicePromises);

    res.status(200).json({
      success: true,
      message: "Invoice Services updated successfully",
    });
  } catch (error) {
    console.error("Error updating invoice services:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const CompanyIncoiceData = async (req, res) => {
  try {
    const { logo } = req.files;
    const {
      user_id,
      company_name,
      company_name_account_name,
      company_name_account_ifsc,
      company_name_account_number,
      company_address,
      charges,
    } = req.body;

    const logoImagePath = "https://crmdemo.vimubds5.a2hosted.com/uploads/" + logo[0].filename;

    // Insert header and footer images with the associated company_id
    const insertHeaderFooterImages = await new Promise((resolve, reject) => {
      const sqlImages =
        "INSERT INTO  invoice_company_proflie ( logo, user_id,company_name,company_name_account_name,company_name_account_ifsc,company_name_account_number,company_address,charges) VALUES ( ?,?,?,?,?,?,?,?)";
      const values = [
        logoImagePath,
        user_id,
        company_name,
        company_name_account_name,
        company_name_account_ifsc,
        company_name_account_number,
        company_address,
        charges,
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
      message: "Invoice Company profile uploaded successfully",
    });
  } catch (error) {
    console.error("Error uploading invoice company data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const fetchcompanyinvoicename = async (req, res) => {
  try {
    const UserId = req.params.UserId;
    const query = "SELECT * FROM  invoice_company_proflie WHERE user_id = ? "; // Query to retrieve unique company names

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

const company_name_invoice_data = async (req, res) => {
  try {
    const { company_name } = req.body;
    console.log(company_name);
    const result = await new Promise((resolve, reject) => {
      const sql =
        "SELECT * FROM  invoice_company_proflie WHERE company_name = ?";
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
      return res.status(404).json({ error: "invoice data not found" });
    }
    console.log(result);

    const invoice_data = result[0];
    res.status(200).json(invoice_data);
  } catch (error) {
    console.error("Error fetching Invoice data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const CopyInvoiceData = async (req, res) => {
  try {
    const { invoiceId } = req.params; // Extract invopiceId from req.params

    // Retrieve the invopice data based on the provided invopice ID
    const sqlInvoice = "SELECT * FROM invoice_data WHERE invoice_id = ?";

    // Execute the query asynchronously to fetch the invopice data
    const [invoice] = await new Promise((resolve, reject) => {
      db.query(sqlInvoice, [invoiceId], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });

    // Check if the invoice data exists
    if (!invoice) {
      return res.status(404).json({ error: "Invoice not found" });
    }

    // Extract the invoice name
    const newInvoiceName = `Copy of ${invoice.invoice_name}`;

    // Insert the copied invoice into the database
    const result = await db.query(
      "INSERT INTO invoice_data (invoice_name,  invoice_no, user_id,invoice_address,payment_mode,	client_gst_no,client_gst_per,client_pan_no,company_type,invoice_date,duration_start_date, duration_end_date) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
      [
        newInvoiceName,
        invoice.invoice_no,
        invoice.user_id,
        invoice.invoice_address,
        invoice.payment_mode,
        invoice.client_gst_no,
        invoice.client_gst_per,
        invoice.client_pan_no,
        invoice.company_type,
        invoice.invoice_date,
        invoice.duration_start_date,
        invoice.duration_end_date,
      ]
    );

    const sqlgetId = "SELECT * FROM invoice_data WHERE invoice_name = ?";
    const [getId] = await new Promise((resolve, reject) => {
      db.query(sqlgetId, [newInvoiceName], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
    const newInvoiceId = getId.invoice_id;

    // Retrieve services associated with the original invopice ID
    const sqlGetServices =
      "SELECT * FROM invoice_services_data WHERE invoice_id = ?";

    // Execute the query asynchronously to fetch the services data
    const services = await new Promise((resolve, reject) => {
      db.query(sqlGetServices, [invoiceId], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });

    // Copy service data associated with the original invoice ID to the new invoice ID
    const sqlServices =
      "INSERT INTO invoice_services_data (invoice_id,invoice_name,service_type,service_name,actual_price,offer_price,subscription_frequency) VALUES ?";
    const servicesValues = services.map((service) => [
      newInvoiceId, // Use the new Invoice ID
      newInvoiceName,
      service.service_type,
      service.service_name,
      service.actual_price,
      service.offer_price,
      service.subscription_frequency,
    ]);

    await new Promise((resolve, reject) => {
      db.query(sqlServices, [servicesValues], (err, result) => {
        if (err) {
          console.error("Error copying services data:", err); // Log the error
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    // SQL query to retrieve notes data associated with the invoice ID
    const sqlNotes = "SELECT * FROM invoice_notes WHERE invoice_id = ?";

    // Execute the query asynchronously and retrieve the notes data
    const getNotes = await new Promise((resolve, reject) => {
      db.query(sqlNotes, [invoiceId], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });

    // Check if notes data is retrieved successfully
    if (!Array.isArray(getNotes)) {
      console.error("Error fetching notes data:", getNotes);
      // Handle the error appropriately, such as returning an error response
    } else {
      // Prepare notes data for insertion
      const notesValues = getNotes.map((note) => [
        note.note_text,
        newInvoiceId,
      ]);

      // SQL query to insert notes data into the database
      const insertNotesQuery =
        "INSERT INTO invoice_notes (note_text, invoice_id) VALUES ?";

      // Execute the insertion query
      db.query(insertNotesQuery, [notesValues], (err, result) => {
        if (err) {
          console.error("Error inserting notes data:", err);
          // Handle the error appropriately, such as returning an error response
        } else {
          console.log("Notes data inserted successfully:", result);
          // Handle the successful insertion, such as returning a success response
        }
      });
    }

    res
      .status(200)
      .json({ message: "Invoice and services data copied successfully" });
  } catch (error) {
    console.error("Error copying Invoice and services data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const InvoiceNotes = (req, res) => {
  const { noteTexts, invoiceId } = req.body;

  // Assuming noteTexts is an array of strings
  const values = noteTexts.map((text) => [text, invoiceId]);

  const sql = "INSERT INTO invoice_notes (note_text, invoice_id) VALUES ?";

  db.query(sql, [values], (err, result) => {
    if (err) {
      console.error("Error inserting notes:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.status(201).json({ ids: result.insertId });
    }
  });
};

const InvoicegetNotes = (req, res) => {
  const { invoiceId } = req.params;

  // Assuming you have a 'notes' table in your database
  const sql = "SELECT * FROM invoice_notes WHERE invoice_id = ?";

  db.query(sql, [invoiceId], (err, result) => {
    if (err) {
      console.error("Error fetching notes:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.status(200).json(result);
    }
  });
};

const InvoicedeleteNote = (req, res) => {
  const noteId = req.params.noteId;

  const sql = "DELETE FROM invoice_notes WHERE id = ?";

  db.query(sql, [noteId], (err, result) => {
    if (err) {
      console.error("Error deleting note:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.status(200).json({ message: "Note deleted successfully" });
    }
  });
};
// const InvoiceupdateNote = async (req, res) => {

//   try {
//     // Use map to update each note in the database
//     await Promise.all(
//       notes.map(async (note) => {
//         const { id, invoice_id, note_text } = note;
//         // Execute the update query for each note
//         await db.query(
//           "UPDATE invoice_notes SET note_text = ? WHERE id = ? AND invoice_id = ?",
//           [note_text, id, invoice_id]
//         );
//       })
//     );
//     // Send a success response
//     res
//       .status(200)
//       .json({ success: true, message: "Notes updated successfully" });
//   } catch (error) {
//     console.error("Error updating notes:", error);
//     // Send an error response
//     res.status(500).json({ success: false, error: "Internal Server Error" });
//   }
// };

const InvoiceupdateNote = async (req, res) => {
  try {
    // Retrieve notes from the request body
    const { notes } = req.body;

    // Check if notes is provided
    if (!notes || !Array.isArray(notes)) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Invalid input: notes must be an array",
        });
    }

    // Use map to update each note in the database
    await Promise.all(
      notes.map(async (note) => {
        const { id, invoice_id, note_text } = note;

        // Ensure id, invoice_id, and note_text are provided
        if (!id || !invoice_id || !note_text) {
          throw new Error("Missing fields in note");
        }

        // Execute the update query for each note
        await db.query(
          "UPDATE invoice_notes SET note_text = ? WHERE id = ? AND invoice_id = ?",
          [note_text, id, invoice_id]
        );
      })
    );

    // Send a success response
    res
      .status(200)
      .json({ success: true, message: "Notes updated successfully" });
  } catch (error) {
    console.error("Error updating notes:", error);
    // Send an error response
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

module.exports = {
  createInvoice,
  getInvoice,
  deleteInvoice,
  UpdateInvoiceName,
  GetInvoiceName,
  invoiceserviceid,
  deleteServiceInvoice,
  addServicesInvoice,
  updateServicesInvoice,
  getInvoiceAddress,
  CompanyIncoiceData,
  company_name_invoice_data,
  fetchcompanyinvoicename,

  CopyInvoiceData,
  InvoiceNotes,
  InvoicegetNotes,
  InvoicedeleteNote,
  InvoiceupdateNote,
  UpdateInvoice_No,
  UpdateInvoice_date,
  UpdateInvoice_start_date,
  UpdateInvoice_end_date,
  getInvoiceDate,
  getAllInvoice,
};
