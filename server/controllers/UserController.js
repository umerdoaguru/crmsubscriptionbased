const express = require("express");
const { db } = require("../db");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");

// const Quotation = async (req, res) => {
//   try {
//     const { quotation_name, services } = req.body;
//     const { user_id } = req.body; // Assuming user_id is retrieved from the authenticated user

//     if (!quotation_name || !services || services.length === 0) {
//       return res.status(400).json({ error: "Quotation name and services are required" });
//     }

//     // Insert quotation with user_id
//     const sqlQuotation = "INSERT INTO quotations_data (quotation_name, user_id) VALUES (?, ?)";
//     const resultQuotation = await new Promise((resolve, reject) => {
//       db.query(sqlQuotation, [quotation_name, user_id], (err, result) => {
//         if (err) {
//           reject(err);
//         } else {
//           resolve(result);
//         }
//       });
//     });

//     // Get quotation ID and name
//     const quotationId = resultQuotation.insertId;
//     const quotationName = quotation_name;

//     // Insert services with the associated quotation_id and quotation_name
//     const sqlServices = "INSERT INTO services_data (quotation_id, quotation_name, service_type, service_name, service_description, actual_price, offer_price, subscription_frequency) VALUES ?";
//     const servicesValues = services.map((service) => [
//       quotationId,
//       quotationName,
//       service.service_type,
//       service.service_name,
//       service.service_description,
//       service.actual_price,
//       service.offer_price,
//       service.subscription_frequency,
//     ]);

//     await new Promise((resolve, reject) => {
//       db.query(sqlServices, [servicesValues], (err, result) => {
//         if (err) {
//           reject(err);
//         } else {
//           resolve(result);
//         }
//       });
//     });

//     res.status(200).json({
//       success: true,
//       message: "Quotation and services added successfully",
//       quotation: {
//         id: quotationId,
//         quotation_name: quotationName,
//       },
//     });
//   } catch (error) {
//
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

const Quotation = async (req, res) => {
  try {
    const { quotation_name, services } = req.body;
    const { employeeId, employee_name, lead_id } = req.body; // Assuming employeeId is retrieved from the authenticated user

    if (!quotation_name || !services || services.length === 0) {
      return res
        .status(400)
        .json({ error: "Quotation name and services are required" });
    }

    // Insert quotation with employeeId
    const sqlQuotation =
      // "INSERT INTO quotations_data (quotation_name, employeeId, employee_name, lead_id) VALUES (?, ?,?, ?)";
      "INSERT INTO quotations_information (employeeId, employee_name, lead_id) VALUES (?, ?, ?)";
    const resultQuotation = await new Promise((resolve, reject) => {
      db.query(
        sqlQuotation,
        [quotation_name, employeeId, employee_name, lead_id],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });

    // Get quotation ID and name
    const quotationId = resultQuotation.insertId;
    const quotationName = quotation_name;

    // Insert services with the associated quotation_id and quotation_name
    const sqlServices =
      "INSERT INTO services_data (quotation_id, quotation_name, service_type, service_name, service_description, actual_price, offer_price, subscription_frequency) VALUES ?";
    const servicesValues = services.map((service) => [
      quotationId,
      quotationName,
      service.service_type,
      service.service_name,
      service.service_description,
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
      message: "Quotation and services added successfully",
      quotation: {
        id: quotationId,
        quotation_name: quotationName,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteQuotation = async (req, res) => {
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

    // Delete notes associated with the quotation
    const sqlDeleteNotes = "DELETE FROM notes WHERE quotation_id = ?";
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


 

    // Delete services associated with the quotation
    const sqlDeleteServices =
      "DELETE FROM services_data WHERE quotation_id = ?";
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

    // Delete the quotation itself
    const sqlDeleteQuotation =
      // "DELETE FROM quotations_data WHERE quotation_id = ?";
      "DELETE FROM quotations_information WHERE id = ?";
    await new Promise((resolve, reject) => {
      db.query(sqlDeleteQuotation, [id], (err, result) => {
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

        //  // Then, update the leads table to set quotation status to "not created"
        //  const updateSql = "UPDATE leads SET quotation = 'not created' WHERE lead_id = ?";
        //  await new Promise((resolve, reject) => {
        //    db.query(updateSql, [id], (err, results) => {
        //      if (err) {
        //        reject(err);
        //      } else {
        //        resolve(results);
        //      }
        //    });
        //  });

    res.status(200).json({
      success: true,
      message: "Quotation deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// const GetQuotation = async (req, res) => {
//   try {
//     const sql = "SELECT * FROM quotations_data ORDER BY quotation_id DESC";

//     const quotations = await new Promise((resolve, reject) => {
//       db.query(sql, (err, results) => {
//         if (err) {
//           reject(err);
//         } else {
//           resolve(results);
//         }
//       });
//     });

//     res.status(200).json(quotations);
//   } catch (error) {
//
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

const GetQuotation = async (req, res) => {
  try {
    // const sql = "SELECT * FROM quotations_data  ORDER BY quotation_id DESC";
    const sql = "SELECT * FROM quotations_information ORDER BY id DESC";

    const quotations = await new Promise((resolve, reject) => {
      db.query(sql, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });

    res.status(200).json(quotations);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllQuotation = async (req, res) => {
  try {
    // const sql = "SELECT * FROM quotations_data";
    const sql = "SELECT * FROM quotations_information";

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
    res
      .status(500)
      .json({ message: "Internal Server Error", success: false, error });
  }
};

const GetQuotationName = async (req, res) => {
  try {
    const { quotationId } = req.params; // Extracting UserId from req.params
    // const sql = "SELECT * FROM quotations_data WHERE quotation_id = ? ";
    const sql = "SELECT * FROM quotations_information WHERE id = ? ";

    const quotations = await new Promise((resolve, reject) => {
      db.query(sql, [quotationId], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });

    res.status(200).json(quotations);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const UpdateQuotationName = async (req, res) => {
  try {
    const { quotationId } = req.params; // Extracting quotationId from req.params

    // Extracting updated data fields from req.body
    const {
      customer_name, contact_number, alternate_number, address, adhaar_number, pan_number,
      project_name, unit_number, dimension, rate, variant, total_deal, booking_amount,
      booking_amount_words, payment_mode, finance_bank, duration, balance_amount,
      balance_amount_words, payment_due_date1, payment_due_date2, payment_due_date3,
      payment_due_date4, registry_charges, p1p2_charges, remarks
    } = req.body;

    // Construct SQL query to update all specified fields
    const sql = `
      UPDATE quotations_information 
      SET customer_name = ?, contact_number = ?, alternate_number = ?, address = ?, 
          adhaar_number = ?, pan_number = ?, project_name = ?, unit_number = ?, 
          dimension = ?, rate = ?, variant = ?, total_deal = ?, booking_amount = ?, 
          booking_amount_words = ?, payment_mode = ?, finance_bank = ?, duration = ?, 
          balance_amount = ?, balance_amount_words = ?, payment_due_date1 = ?, 
          payment_due_date2 = ?, payment_due_date3 = ?, payment_due_date4 = ?, 
          registry_charges = ?, p1p2_charges = ?, remarks = ? 
      WHERE id = ?`;

    // Execute the update query asynchronously
    await new Promise((resolve, reject) => {
      db.query(sql, [
        customer_name, contact_number, alternate_number, address, adhaar_number, pan_number,
        project_name, unit_number, dimension, rate, variant, total_deal, booking_amount,
        booking_amount_words, payment_mode, finance_bank, duration, balance_amount,
        balance_amount_words, payment_due_date1, payment_due_date2, payment_due_date3,
        payment_due_date4, registry_charges, p1p2_charges, remarks, quotationId
      ], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });

    res.status(200).json({ message: "Quotation updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const CopyQuotationData = async (req, res) => {
  try {
    const { quotationId } = req.params; // Extract quotationId from req.params

    // Retrieve the quotation data based on the provided quotation ID
    // const sqlQuotation = "SELECT * FROM quotations_data WHERE quotation_id = ?";
    const sqlQuotation = "SELECT * FROM quotations_information WHERE id = ?";

    // Execute the query asynchronously to fetch the quotation data
    const [quotation] = await new Promise((resolve, reject) => {
      db.query(sqlQuotation, [quotationId], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });

    // Check if the quotation data exists
    console.log(quotation);
        if (!quotation) {
      return res.status(404).json({ error: "Quotation not found" });
    }

    // Extract the quotation name
    const newQuotationName = `Copy of ${quotation.quotation_name}`;

    // Insert the copied quotation into the database
    const result = await db.query(
      // "INSERT INTO quotations_data (quotation_name, user_id) VALUES (?, ?)",
      "INSERT INTO quotations_information (customer_name, user_id) VALUES (?, ?)",
      [newQuotationName, quotation.user_id]
    );

    // const sqlgetId = "SELECT * FROM quotations_data WHERE quotation_name = ?";
    const sqlgetId = "SELECT * FROM quotations_information WHERE customer_name = ?";
    const [getId] = await new Promise((resolve, reject) => {
      db.query(sqlgetId, [newQuotationName], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
    const newQuotationId = getId.quotation_id;

    // Retrieve services associated with the original quotation ID
    const sqlGetServices = "SELECT * FROM services_data WHERE quotation_id = ?";

    // Execute the query asynchronously to fetch the services data
    const services = await new Promise((resolve, reject) => {
      db.query(sqlGetServices, [quotationId], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });

    // Copy service data associated with the original quotation ID to the new quotation ID
    const sqlServices =
      "INSERT INTO services_data (quotation_id, quotation_name, service_type, service_name, service_description, actual_price, offer_price, subscription_frequency) VALUES ?";
    const servicesValues = services.map((service) => [
      newQuotationId, // Use the new quotation ID
      newQuotationName,
      service.service_type,
      service.service_name,
      service.service_description,
      service.actual_price,
      service.offer_price,
      service.subscription_frequency,
    ]);

    await new Promise((resolve, reject) => {
      db.query(sqlServices, [servicesValues], (err, result) => {
        if (err) {
          // Log the error
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    // SQL query to retrieve notes data associated with the quotation ID
    const sqlNotes = "SELECT * FROM notes WHERE quotation_id = ?";

    // Execute the query asynchronously and retrieve the notes data
    const getNotes = await new Promise((resolve, reject) => {
      db.query(sqlNotes, [quotationId], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });

    // Check if notes data is retrieved successfully
    if (!Array.isArray(getNotes)) {
      // Handle the error appropriately, such as returning an error response
    } else {
      // Prepare notes data for insertion
      const notesValues = getNotes.map((note) => [
        note.note_text,
        newQuotationId,
      ]);

      // SQL query to insert notes data into the database
      const insertNotesQuery =
        "INSERT INTO notes (note_text, quotation_id) VALUES ?";

      // Execute the insertion query
      db.query(insertNotesQuery, [notesValues], (err, result) => {
        if (err) {
          // Handle the error appropriately, such as returning an error response
        } else {
          // Handle the successful insertion, such as returning a success response
        }
      });
    }

    res
      .status(200)
      .json({ message: "Quotation and services data copied successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

Quotationviaid = (req, res) => {
  try {
    const quotation_id = req.params.id;

    const getQuery = `
    SELECT qd.* 
    FROM quotations_information qd 
    WHERE qd.id = ?
  `;
  

    db.query(getQuery, quotation_id, (error, result) => {
      if (error) {
        res.status(500).json({ error: error, message: "Internal Server Error" });
      } else {
        res.status(200).json(result);
      }
    });
  } catch (error) {
    res.status(500).json({ error: error, message: "Internal Server Error" });
  }
};


// const addServices = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { quotation_name, services } = req.body;

//     if (!id || !quotation_name || !services || services.length === 0) {
//       return res.status(400).json({ error: 'Quotation ID, name, and services are required' });
//     }

//     const servicesValues = services.map((service) => [
//       id,
//       quotation_name,
//       service.service_type,
//       service.service_name,
//       service.service_description,
//       service.actual_price,
//       service.offer_price,
//      service.subscription_frequency,
//     ]);

//     const sql = "INSERT INTO services_data (quotation_id, quotation_name, service_type, service_name, service_description, actual_price, offer_price, subscription_frequency) VALUES ?";

//     await new Promise((resolve, reject) => {
//       db.query(sql, [servicesValues], (err, result) => {
//         if (err) {
//           reject(err);
//         } else {
//           resolve(result);
//         }
//       });
//     });

//     res.status(201).json({ success: true, message: 'Services added successfully' });
//   } catch (error) {
//
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

const addServices = async (req, res) => {
  try {
    const { id } = req.params;
    const { quotation_name, services } = req.body;

    if (!id || !quotation_name || !services || services.length === 0) {
      return res
        .status(400)
        .json({ error: "Quotation ID, name, and services are required" });
    }

    const servicesValues = services.map((service) => [
      id,
      quotation_name,
      service.service_type,
      service.service_name,
      service.service_description,
      service.actual_price,
      service.offer_price,
      service.subscription_frequency,
    ]);

    const sql =
      "INSERT INTO services_data (quotation_id, quotation_name, service_type, service_name, service_description, actual_price, offer_price, subscription_frequency) VALUES ?";

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
      .json({ success: true, message: "Services added successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteService = async (req, res) => {
  try {
    const { serviceId } = req.params;

    // Implement logic to delete the service with the specified ID from your database
    const result = await new Promise((resolve, reject) => {
      db.query(
        "DELETE FROM services_data WHERE service_id = ?",
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
      res
        .status(200)
        .json({ success: true, message: "Service deleted successfully" });
    } else {
      res.status(404).json({ error: "Service not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const GetServices = (req, res) => {
  try {
    const getquery = "SELECT * FROM services";

    db.query(getquery, (error, result) => {
      if (error) {
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        const user = result;
        res.status(200).json({
          success: true,
          message: "services added successfully",
          services: user,
        });
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// const updateServices = async (req, res) => {
//   try {
//     const { quotationId } = req.params;
//     const { services } = req.body;

//     for (const service of services) {
//       const sqlUpdateService = `
//         UPDATE services_data
//         SET
//           service_type = ?,
//           service_description = ?,
//           actual_price = ?,
//           offer_price = ?
//         WHERE
//           quotation_id = ? AND service_id = ?`;

//       const values = [
//         service.service_type,
//         service.service_description,
//         service.actual_price,
//         service.offer_price,
//         quotationId,
//         service.service_id,
//       ];

//       await db.query(sqlUpdateService, values);
//     }

//     res.status(200).json({ success: true, message: 'Services updated successfully' });
//   } catch (error) {
//
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

const updateServices = async (req, res) => {
  try {
    const { quotationId } = req.params;
    const { services } = req.body;

    const updateServicePromises = services.map(async (service) => {
      const sqlUpdateService = `
          UPDATE services_data
          SET
            service_type = ?,
            service_name = ?,
            service_description = ?,
            actual_price = ?,
            offer_price = ?,
            subscription_frequency = ?
          WHERE
            quotation_id = ? AND service_id = ?`;

      const values = [
        service.service_type,
        service.service_name,
        service.service_description,
        service.actual_price,
        service.offer_price,
        service.subscription_frequency,
        quotationId,
        service.service_id,
      ];

      await db.query(sqlUpdateService, values);
    });

    await Promise.all(updateServicePromises);

    res
      .status(200)
      .json({ success: true, message: "Services updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const Notes = (req, res) => {
  const { noteTexts, quotationId } = req.body;

  // Assuming noteTexts is an array of strings
  const values = noteTexts.map((text) => [text, quotationId]);

  const sql = "INSERT INTO notes (note_text, quotation_id) VALUES ?";

  db.query(sql, [values], (err, result) => {
    if (err) {
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.status(201).json({ ids: result.insertId });
    }
  });
};

const getNotes = (req, res) => {
  const { quotationId } = req.params;

  // Assuming you have a 'notes' table in your database
  const sql = "SELECT * FROM notes WHERE quotation_id = ?";

  db.query(sql, [quotationId], (err, result) => {
    if (err) {
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.status(200).json(result);
    }
  });
};

const deleteNote = (req, res) => {
  const noteId = req.params.noteId;

  const sql = "DELETE FROM notes WHERE id = ?";

  db.query(sql, [noteId], (err, result) => {
    if (err) {
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.status(200).json({ message: "Note deleted successfully" });
    }
  });
};
const updateNote = async (req, res) => {
  const { notes } = req.body;

  try {
    // Use map to update each note in the database
    await Promise.all(
      notes.map(async (note) => {
        const { id, quotation_id, note_text } = note;
        // Execute the update query for each note
        await db.query(
          "UPDATE notes SET note_text = ? WHERE id = ? AND quotation_id = ?",
          [note_text, id, quotation_id]
        );
      })
    );
    // Send a success response
    res
      .status(200)
      .json({ success: true, message: "Notes updated successfully" });
  } catch (error) {
    // Send an error response
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const getnotes_text = (req, res) => {
  const sql = "SELECT notes_text FROM notes_data";

  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      const notes = result.map((row) => row.notes_text);
      res.json(notes);
    }
  });
};

const createLead = (req, res) => {
  const {
    lead_no,
    name,
    phone,
    assignedTo,
    leadSource,
    employeeId,
    project_name,main_project_id,unit_type,unit_id,address,
    createdTime,
    actual_date,
    assignedBy,
  } = req.body;
  const sql = `INSERT INTO leads (lead_no, name, phone, assignedTo, leadSource, employeeId,project_name,main_project_id,unit_type,unit_id,address,createdTime,actual_date,assignedBy) VALUES (?,?,?,?,?,?, ?,?, ?,?, ?, ?,?,?)`;
  db.query(
    sql,
    [
      lead_no,
      name,
      phone,
      assignedTo,
      leadSource,
      employeeId,
      project_name,main_project_id,unit_type,unit_id,address,
      createdTime,
      actual_date,
      assignedBy
    ],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: "Error inserting data" });
      } else {
        res
          .status(201)
          .json({ success: true, message: "Lead data successfully submitted" });
      }
    }
  );
};
//   const socialmediaLead = (req, res) => {
//     const { lead_no, name, phone, assignedTo, leadSource, employeeId,subject ,createdTime} = req.body;
//     const sql = `INSERT INTO leads (lead_no, name, phone, assignedTo, leadSource, employeeId,subject) VALUES (?,?,?, ?, ?, ?, ?,?)`;
//     db.query(sql, [lead_no, name, phone, assignedTo, leadSource, employeeId,subject,address,createdTime,], (err, results) => {
//         if (err) {
//             res.status(500).json({ error: "Error inserting data" });
//         } else {
//             res.status(201).json({ success: true, message: "Lead data successfully submitted" });
//         }
//     });
// };

const getleadbyid = (req, res) => {
  try {
    const { id } = req.params;

    const getQuery = `SELECT * FROM leads WHERE lead_id = ?`;

    db.query(getQuery, [id], (error, result) => {
      if (error) {
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.status(200).json(result);
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const getvisit = (req, res) => {
  try {
    const { id } = req.params;

    const getQuery = `SELECT * FROM leads WHERE lead_id = ?`;

    db.query(getQuery, [id], (error, result) => {
      if (error) {
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.status(200).json(result);
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getLeads = (req, res) => {
  const sql = "SELECT * FROM leads ORDER BY lead_id DESC"; 
  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).json({ error: "Error fetching data" });
    } else {
      res.status(200).json(results);
    }
  });
};


const updateLead = async (req, res) => {
  try {
    const { leadId } = req.params;
    const {
      lead_no,
      name,
      phone,
      assignedTo,
      leadSource,
      employeeId,
      createdTime,
      actual_date,
      project_name,
      main_project_id,unit_type,unit_id,
      address,
    } = req.body;

    // Construct SQL query to update the lead
    const sql = `UPDATE leads 
                 SET lead_no = ?, name = ?, phone = ?, assignedTo = ?, employeeId = ?, leadSource = ?, createdTime = ?, actual_date = ?, project_name= ?,main_project_id = ?,unit_type = ?, unit_id = ?, address = ? 
                 WHERE lead_id = ?`;

    // Execute the update query asynchronously
    await new Promise((resolve, reject) => {
      db.query(
        sql,
        [
          lead_no,
          name,
          phone,
          assignedTo,
          employeeId,
          leadSource,
          createdTime,
          actual_date,
          project_name,
          main_project_id,unit_type,unit_id,
          address, // added to the SQL query
          leadId,
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

    res.status(200).json({ message: "Lead updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteLead = (req, res) => {
  const { leadId } = req.params;

  // Validate the lead_id
  if (!leadId) {
    return res.status(400).json({ error: "Lead ID is required" });
  }

  // First, delete from the visit table
  const sqlVisit = `DELETE FROM visit WHERE lead_id = ?`;
  db.query(sqlVisit, [leadId], (err, visitResults) => {
    if (err) {
      return res.status(500).json({ error: "Error deleting from visit table" });
    }

    // Then, delete from the leads table
    const sqlLeads = `DELETE FROM leads WHERE lead_id = ?`;
    db.query(sqlLeads, [leadId], (err, leadResults) => {
      if (err) {
        return res.status(500).json({ error: "Error deleting from leads table" });
      }

      // Check if any rows were deleted from the leads table
      if (leadResults.affectedRows === 0) {
        return res.status(404).json({ error: "Lead not found" });
      }

      res.status(200).json({ success: true, message: "Lead data successfully deleted from both tables" });
    });
  });
};


const employeeData = (req, res) => {
  const sql = `SELECT * FROM employee`;

  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).json({ error: "Error fetchinf data " });
    } else {
      res.status(201).json(results);
    }
  });
};

const editProfile = async (req, res) => {
  try {
    // Extract data from request body and file
    const { user_name, email, phone, mobile, address, interested_in, bio } =
      req.body;
    const profile_picture = req.file ? req.file.buffer : null;

    // Validate required fields
    if (!user_name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    // Check if the user exists
    const checkUserQuery = "SELECT * FROM user_data WHERE email = ?";
    db.query(checkUserQuery, [email], (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Internal server error" });
      }

      if (result.length === 0) {
        // User not found, insert a new user
        const insertUserQuery = `
          INSERT INTO user_data (user_name, email, profile_picture, phone, mobile, address, interested_in, bio)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const insertParams = [
          user_name,
          email,
          profile_picture,
          phone,
          mobile,
          address,
          interested_in,
          bio,
        ];

        db.query(insertUserQuery, insertParams, (insertErr) => {
          if (insertErr) {
            return res.status(500).json({ error: "Internal server error" });
          } else {
            return res.status(201).json({
              success: true,
              message: "New user profile created successfully",
            });
          }
        });
      } else {
        // User found, update the existing user's profile
        const updateUserQuery = `
          UPDATE user_data
          SET user_name = ?, profile_picture = ?, phone = ?, mobile = ?, address = ?, interested_in = ?, bio = ?
          WHERE email = ?
        `;

        const updateParams = [
          user_name,
          profile_picture,
          phone,
          mobile,
          address,
          interested_in,
          bio,
          email,
        ];

        db.query(updateUserQuery, updateParams, (updateErr) => {
          if (updateErr) {
            return res.status(500).json({ error: "Internal server error" });
          } else {
            return res.status(200).json({
              success: true,
              message: "User profile updated successfully",
            });
          }
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in editing profile",
      error: error.message,
    });
  }
};

const deleteProfile = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Delete user profile from the database
    const deleteUserQuery = "DELETE FROM user_data WHERE email = ?";
    db.query(deleteUserQuery, [email], (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Internal server error" });
      }

      if (result.affectedRows === 0) {
        // No user found with the provided email
        return res.status(404).json({ error: "User not found" });
      }

      // Profile successfully deleted
      return res
        .status(200)
        .json({ success: true, message: "Profile deleted successfully" });
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    // Query to get all users from the user_data table
    const getAllUsersQuery = "SELECT * FROM user_data";

    // Execute the query
    db.query(getAllUsersQuery, (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Internal server error" });
      }

      // Return the result as a JSON response
      return res.status(200).json({
        success: true,
        data: result,
        message: "Users retrieved successfully",
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in retrieving users",
      error: error.message,
    });
  }
};

const updateQuotationStatus = async (req, res) => {
  try {
    const { id, status } = req.body; // Get the quotation_id and new status from the request body

    // Validate that both fields are provided
    if (!id || !status) {
      return res.status(400).json({
        message: "quotation_id and status are required",
        success: false,
      });
    }

    // const sql = "UPDATE quotations_data SET status = ? WHERE quotation_id = ?";
    const sql = "UPDATE quotations_information SET status = ? WHERE id = ?";

    // Use a promise to execute the SQL update query
    const updateStatus = await new Promise((resolve, reject) => {
      db.query(sql, [status, id], (err, result) => {
        if (err) {
          return reject(err); // Reject the promise if there's an error
        }
        resolve(result); // Resolve the promise with the query result
      });
    });

    // Check if any rows were affected (i.e., if the update was successful)
    if (updateStatus.affectedRows === 0) {
      return res.status(404).json({
        message: "Quotation not found",
        success: false,
      });
    }

    // Send a success response
    res.status(200).json({
      message: "Quotation status updated successfully",
      success: true,
    });
  } catch (error) {
    // Handle any errors and send a failure response
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
      error: error.message, // Send a specific error message for debugging
    });
  }
};

const quotationInformationForm = async (req, res) =>{
  const formData = req.body;
  console.log('API DAta check:',formData);
  

  const query = `INSERT INTO quotations_information (
    customer_name, contact_number, alternate_number, address, adhaar_number, pan_number,
    project_name, unit_number, dimension, rate, variant, total_deal, booking_amount,
    booking_amount_words, payment_mode, finance_bank, duration, balance_amount,
    balance_amount_words, payment_due_date1, payment_due_date2, payment_due_date3,
    payment_due_date4, registry_charges, p1p2_charges, remarks, employeeId, employee_name, lead_id
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = [
    formData.customerName, formData.contactNumber, formData.alternateNumber, formData.address, 
    formData.adhaarNumber, formData.panNumber, formData.projectName, formData.unitNumber, 
    formData.dimension, formData.rate, formData.variant, formData.totalDeal, formData.bookingAmount,
    formData.bookingAmountWords, formData.paymentMode, formData.financeBank, formData.duration, 
    formData.balanceAmount, formData.balanceAmountWords, formData.paymentDueDate1, formData.paymentDueDate2, 
    formData.paymentDueDate3, formData.paymentDueDate4, formData.registryCharges, formData.p1p2Charges, 
    formData.remarks, formData.employeeId, formData.employee_name, formData.lead_id
  ];
  console.log('check values: ', values);
  

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error saving data:', err);
      res.status(500).json({ message: 'Error saving data' });
      return;
    }
    res.status(200).json({ message: 'Data saved successfully', id: result.insertId });
  });

};

const getLeadsByIdVisit = (req, res) => {
  const employeeId = req.params.employeeId; // Assuming `employeeId` is passed as a route parameter

  const sql = `
    SELECT 
      visit.visit,
      visit.visit_date,
      visit.report,
      leads.lead_no,
      leads.lead_id,
      leads.name,
      leads.assignedTo,
      leads.employeeId ,
      leads.createdTime,
      leads.actual_date,
      leads.name ,
      leads.phone,
      leads.leadSource,
      leads.lead_status,
      leads.subject,
      leads.booking_amount,
      leads.payment_mode,
      leads.registry,
      leads.address,
      leads.quotation,
      leads.quotation_status,
      leads.deal_status,
      leads.d_closeDate,
      leads.status,
      leads.reason,
      leads.follow_up_status
    FROM 
      leads
    LEFT JOIN 
      visit ON visit.lead_id = leads.lead_id AND visit.employeeId = leads.employeeId
    WHERE 
      leads.employeeId = ?;
  `;

  db.query(sql, [employeeId], (err, results) => {
    if (err) {
      res.status(500).json({ error: "Error fetching data" });
    } else {
      res.status(200).json(results);
    }
  });
};

const getLeadsVisit = (req, res) => {
  const sql = `
    SELECT 
      visit.visit,
      visit.visit_date,
      visit.report,
        leads.lead_id,
      leads.lead_no,
      leads.name,
      leads.assignedTo,
      leads.employeeId,
      leads.createdTime,
      leads.actual_date,
      leads.phone,
      leads.leadSource,
      leads.lead_status,
      leads.subject,
      leads.booking_amount,
      leads.payment_mode,
      leads.registry,
      leads.address,
      leads.quotation,
      leads.quotation_status,
      leads.deal_status,
      leads.d_closeDate,
      leads.status,
      leads.reason,
      leads.follow_up_status
    FROM 
      leads
    LEFT JOIN 
      visit ON visit.lead_id = leads.lead_id AND visit.employeeId = leads.employeeId;
  `;

  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).json({ error: "Error fetching data" });
    } else {
      res.status(200).json(results);
    }
  });
};


// Project Related apis
const addProject = (req, res) => {
  const {
    projectName, location, total_area,
  } = req.body;
  console.log(projectName, location, total_area,);
  
  if (!projectName ||!location || !total_area ) {
    return res.status(400).json({ error: "Required fields are missing." });
  }

  const query = `
    INSERT INTO projects (
      project_name, location, total_area 
    ) VALUES (?, ?, ?)
  `;

  const values = [
    projectName, location, total_area,
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error inserting data into database:", err);
      return res.status(500).json({ error: "Failed to add project." });
    }

    res.status(200).json({ message: "Project added successfully." });
  });
};

const getAllProjects = (req, res) => {
  const query = "SELECT * FROM projects"; 

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching projects from database:", err);
      return res.status(500).json({ error: "Failed to fetch projects." });
    }

    res.status(200).json(results);
  });
};

const editProject = (req, res) => {
  const { id } = req.params;
  const { project_name, location, total_area } = req.body;

  const sql = `
    UPDATE projects
    SET project_name = ?, location = ?, total_area = ?
    WHERE main_project_id = ?
  `;

  db.query(sql, [project_name, location, total_area, id], (err, result) => {
    if (err) {
      console.error("Error updating project:", err);
      return res.status(500).json({ message: "Server error", error: err });
    }

    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Project updated successfully" });
    } else {
      res.status(404).json({ message: "Project not found" });
    }
  });
};

const deleteProject = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if the project is allocated in the leads table (i.e. it has a non-empty project_name)
    const leadsResult = await new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM leads WHERE main_project_id = ? AND project_name <> ''",
        [id],
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      );
    });

    // If the project is allocated and no confirmation flag is provided, ask for confirmation.
    if (leadsResult.length > 0 && req.query.confirm !== 'true') {
      return res.status(400).json({
        message:
          "This project is allocated. Are you sure you want to delete it? Click OK to confirm, or Cancel to abort."
      });
    }

    // Proceed with deletion if confirmation is provided or no allocation found.
    const deleteResult = await new Promise((resolve, reject) => {
      db.query(
        "DELETE FROM projects WHERE main_project_id = ?",
        [id],
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      );
    });

    if (deleteResult.affectedRows > 0) {
      res.status(200).json({ message: "Project deleted successfully" });
    } else {
      res.status(404).json({ message: "Project not found" });
    }
  } catch (err) {
    console.error("Error deleting project:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
};



const updateUnit = async (req, res) => {
  const unit_id = req.params.id;
  const { unit_type, unit_size, total_units, base_price,main_project_id } = req.body;

  const sql = `UPDATE units 
               SET unit_type = ?, 
                   unit_size = ?, 
                   total_units = ?, 
                   base_price = ? ,
                   main_project_id = ?
               WHERE unit_id = ?`; 

  db.query(sql, [unit_type, unit_size, total_units, base_price,main_project_id, unit_id], async (err, result) => {
    if (err) {
      console.error("Error updating Unit:", err);
      return res.status(500).json({ message: "Server error", error: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Unit not found" });
    }

    try {
      const currentUnitsResult = await new Promise((resolve, reject) => {
        db.query(
          `SELECT COUNT(*) AS count FROM unit_data WHERE unit_id = ?`, 
          [unit_id], 
          (err, result) => {
            if (err) reject(err);
            else resolve(result[0].count);
          }
        );
      });

      const currentTotalUnits = currentUnitsResult;

      if (total_units > currentTotalUnits) {
        const unitsToAdd = total_units - currentTotalUnits;
        const unitDataValues = [];

        for (let i = currentTotalUnits + 1; i <= total_units; i++) {
          unitDataValues.push([i, unit_type, unit_id, unit_size, base_price,main_project_id, 'pending']);
        }

        const insertQuery = `INSERT INTO unit_data (unit_number, unit_type, unit_id, unit_size, base_price,main_project_id, status) VALUES ?`;
        await new Promise((resolve, reject) => {
          db.query(insertQuery, [unitDataValues], (err, result) => {
            if (err) reject(err);
            else resolve(result);
          });
        });

      } else if (total_units < currentTotalUnits) {
        // **Remove extra units**
        const deleteQuery = `DELETE FROM unit_data WHERE unit_id = ? AND unit_number > ?`;
        await new Promise((resolve, reject) => {
          db.query(deleteQuery, [unit_id, total_units], (err, result) => {
            if (err) reject(err);
            else resolve(result);
          });
        });
      }

      res.status(200).json({ message: "Unit and unit_data updated successfully" });

    } catch (err) {
      console.error("Error updating unit_data:", err);
      res.status(500).json({ message: "Error updating unit_data", error: err });
    }
  });
};

const addUnit = async (req, res) => {
  const { main_project_id, unit_type, unit_size, total_units, base_price } = req.body;

  if (!main_project_id || !unit_type || !unit_size || !total_units) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const insertUnitQuery = `INSERT INTO units (main_project_id, unit_type, unit_size, total_units, base_price) 
                           VALUES (?, ?, ?, ?, ?)`;

  try {
    const result = await new Promise((resolve, reject) => {
      db.query(insertUnitQuery, [main_project_id, unit_type, unit_size, total_units, base_price], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    const unit_id = result.insertId;

    // **Insert `unit_size` number of entries into `unit_data`**
    const unitDataInsertQuery = `INSERT INTO unit_data (unit_number, unit_type, main_project_id, unit_id, unit_size, base_price, status) VALUES ?`;
     

    const unitDataValues = [];
    for (let i = 1; i <= total_units; i++) {
      unitDataValues.push([i, unit_type, main_project_id, unit_id, unit_size, base_price, 'pending']);
    }
    
    await new Promise((resolve, reject) => {
      db.query(unitDataInsertQuery, [unitDataValues], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    res.status(200).json({
      message: "Unit and unit data added successfully",
      unit_id: unit_id,
      data: { main_project_id, unit_type, unit_size, total_units, base_price }
    });
  } catch (err) {
    console.error("Error inserting unit:", err);
    res.status(500).json({ message: "Failed to add unit", error: err.message || "Unknown error" });
  }
};

const editUnitdetails = (req, res) => {
  const id = req.params.id;
  console.log("Request received for id:", req.params.id);
  const { base_price, unit_size } = req.body;

  const sql = `
    UPDATE unit_data
    SET base_price = ?, unit_size = ?
    WHERE id = ?
  `;

  db.query(sql, [base_price, unit_size, req.params.id], (err, result) => {
    if (err) {
      console.error("Error updating unit:", err);
      return res.status(500).json({ message: "Server error", error: err });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Unit not found for update" });
    }

    res.status(200).json({
      message: "Unit updated successfully",
      data: {
        base_price,
        unit_size,
      },
    });
  });
};

// const deleteUnit = async (req, res) => {
//   const unit_id = req.params.id;

//   const sql = `DELETE FROM units WHERE unit_id = ?`;
//   db.query(sql, [unit_id], (err, result) => {
//     if (err) {
//       console.error("Error deleting unit:", err);
//       return res.status(500).json({ message: "Server error", error: err });
//     }

//     if (result.affectedRows > 0) {
//       res.status(200).json({ message: "Unit deleted successfully" });
//     } else {
//       res.status(404).json({ message: "Unit not found" });
//     }
//   });
// };

const deleteUnit = async (req, res) => {
  const unit_id = req.params.id;

  try {
    // First, check if the leads table has any record for this unit with data in both project_name and unit_type.
    const leadsResult = await new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM leads WHERE unit_id = ? AND project_name <> '' AND unit_type <> ''",
        [unit_id],
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      );
    });

    // If there are leads and the user hasn't confirmed deletion, return a confirmation message.
    if (leadsResult.length > 0 && req.query.confirm !== 'true') {
      return res.status(400).json({
        message:
          "This unit is allocated. Are you sure you want to delete it? Click OK to confirm, or Cancel to abort."
      });
    }

    // Delete related data from unit_data table.
    await new Promise((resolve, reject) => {
      db.query("DELETE FROM unit_data WHERE unit_id = ?", [unit_id], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });

    // Delete the unit from units table.
    const deleteResult = await new Promise((resolve, reject) => {
      db.query("DELETE FROM units WHERE unit_id = ?", [unit_id], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });

    if (deleteResult.affectedRows > 0) {
      res.status(200).json({
        message: "Unit and its detailed data deleted successfully"
      });
    } else {
      res.status(404).json({ message: "Unit not found" });
    }
  } catch (err) {
    console.error("Error deleting unit and unit_data:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
};
const getUnits = async (req, res) => {
  const { main_project_id, unit_type } = req.query;

  let query = 'SELECT * FROM units ORDER BY unit_id DESC;';
  let queryParams = [];

  // Apply filters if provided in the query
  if (main_project_id || unit_type) {
      query += ' WHERE';
      if (main_project_id) {
          query += ' main_project_id = ?';
          queryParams.push(main_project_id);
      }
      if (unit_type) {
          if (main_project_id) {
              query += ' AND';
          }
          query += ' unit_type = ?';
          queryParams.push(unit_type);
      }
  }

  try {
      const result = await new Promise((resolve, reject) => {
          db.query(query, queryParams, (err, result) => {
              if (err) {
                  reject(err);
              } else {
                  resolve(result);
              }
          });
      });

      if (result.length === 0) {
          return res.status(404).json({ message: 'No units found' });
      }

      res.status(200).json({
          message: 'Units retrieved successfully',
          data: result
      });
  } catch (err) {
      console.error('Error fetching units:', err);
      res.status(500).json({
          message: 'Failed to fetch units',
          error: err.message || 'Unknown error'
      });
  }
};

const getUnitById = async (req, res) => {
  const project_id = req.params.id; 

  if (!project_id) {
      return res.status(400).json({ message: 'project_id is required in the URL' });
  }

  const query = 'SELECT * FROM projects WHERE main_project_id = ?'; // `main_project_id` primary key hai

  try {
      const result = await new Promise((resolve, reject) => {
          db.query(query, [project_id], (err, result) => {
              if (err) {
                  reject(err);
              } else {
                  resolve(result);
              }
          });
      });

      if (result.length === 0) {
          return res.status(404).json({ message: 'Project not found' });
      }

      res.status(200).json({
          message: 'Project retrieved successfully',
          data: result[0]
      });
  } catch (err) {
      console.error('Error fetching project:', err);
      res.status(500).json({
          message: 'Failed to fetch project',
          error: err.message || 'Unknown error'
      });
  }
};


const getUnitsdistributeById = (req, res) => {
  const { id } = req.params; // This 'id' will be used as 'main_project_id'

  if (!id) {
      return res.status(400).json({ message: "main_project_id is required" });
  }

  const query = "SELECT * FROM units WHERE main_project_id = ?";

  db.query(query, [id], (err, results) => {
      if (err) {
          return res.status(500).json({ message: "Database error", error: err.message });
      }

      if (results.length === 0) {
          return res.status(404).json({ message: "No units found for this project" });
      }

      return res.status(200).json({data: results});
  });
};

const getUnitsByProject = async (req, res) => {
  const main_project_id = req.query.main_project_id;

  if (!main_project_id) {
      return res.status(400).json({ message: 'main_project_id is required as a query parameter' });
  }

  const query = 'SELECT * FROM units WHERE main_project_id = ?';

  try {
      const result = await new Promise((resolve, reject) => {
          db.query(query, [main_project_id], (err, result) => {
              if (err) {
                  reject(err);
              } else {
                  resolve(result);
              }
          });
      });

      if (result.length === 0) {
          return res.status(404).json({ message: 'No units found for this project' });
      }

      res.status(200).json({
          message: 'Units for project retrieved successfully',
          data: result
      });
  } catch (err) {
      console.error('Error fetching units for project:', err);
      res.status(500).json({
          message: 'Failed to fetch units for project',
          error: err.message || 'Unknown error'
      });
  }
};

const updateUnitmanualy = async (req, res) => {
  const unit_id = req.params.unit_id;
  const { unit_type, unit_size, total_units, units_sold, base_price, additional_costs, amenities } = req.body;

  // Calculate units_remaining manually every time update is triggered
  const units_remaining = total_units - units_sold;

  const query = `UPDATE units SET 
                    unit_type = ?, 
                    unit_size = ?, 
                    total_units = ?, 
                    units_sold = ?, 
                    units_remaining = ?, 
                    base_price = ?, 
                    additional_costs = ?, 
                    amenities = ?
                  WHERE unit_id = ?`;

  try {
      const result = await new Promise((resolve, reject) => {
          db.query(query, [unit_type, unit_size, total_units, units_sold, units_remaining, base_price, additional_costs, amenities, unit_id], (err, result) => {
              if (err) {
                  reject(err);
              } else {
                  resolve(result);
              }
          });
      });

      if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'Unit not found for update' });
      }

      res.status(200).json({
          message: 'Unit updated successfully',
          data: {
              unit_id,
              unit_type,
              unit_size,
              total_units,
              units_sold,
              units_remaining,
              base_price,
              additional_costs,
              amenities
          }
      });
  } catch (err) {
      console.error('Error updating unit:', err);
      res.status(500).json({
          message: 'Failed to update unit',
          error: err.message || 'Unknown error'
      });
  }
};

const getUnitByProjectId = async (req, res) => {
  const main_project_id = req.params.id; 

  if (!main_project_id) {
      return res.status(400).json({ message: 'main_project_id is required in the URL' });
  }

  const query = 'SELECT * FROM units WHERE main_project_id = ?'; // `main_project_id` primary key hai

  try {
      const result = await new Promise((resolve, reject) => {
          db.query(query, [main_project_id], (err, result) => {
              if (err) {
                  reject(err);
              } else {
                  resolve(result);
              }
          });
      });

      if (result.length === 0) {
          return res.status(404).json({ message: 'Project unit not found' });
      }

      res.status(200).json(result);
  } catch (err) {
      console.error('Error fetching project unit:', err);
      res.status(500).json({
          message: 'Failed to fetch project unit',
          error: err.message || 'Unknown error'
      });
  }
};

const getUnitDetailsById = async (req, res) => {
  const unit_id = req.params.id;

  if (!unit_id) {
      return res.status(400).json({ message: 'unit_id is required in the URL' });
  }

  const query = 'SELECT * FROM unit_data WHERE unit_id = ?'; // `unit_id` primary key hai

  try {
      const result = await new Promise((resolve, reject) => {
          db.query(query, [unit_id], (err, result) => {
              if (err) {
                  reject(err);
              } else {
                  resolve(result);
              }
          });
      });

      if (result.length === 0) {
          return res.status(404).json({ message: 'Unit not found' });
      }

      res.status(200).json(result);
  } catch (err) {
      console.error('Error fetching unit details:', err);
      res.status(500).json({
          message: 'Failed to fetch unit details',
          error: err.message || 'Unknown error'
      });
  }
}


module.exports = {
  Quotation,
  GetQuotation,
  Quotationviaid,
  addServices,
  deleteService,
  GetServices,
  deleteQuotation,
  updateServices,
  Notes,
  getNotes,
  getnotes_text,
  deleteNote,
  UpdateQuotationName,
  CopyQuotationData,
  GetQuotationName,
  updateNote,
  createLead,
  getleadbyid,
  getLeads,
  updateLead,
  deleteLead,
  employeeData,
  editProfile,
  getAllUsers,
  deleteProfile,
  getAllQuotation,
  updateQuotationStatus,getLeadsByIdVisit,getLeadsVisit,
  quotationInformationForm,
  addProject,
  getAllProjects,
  editProject,
  deleteProject,
  addUnit,
  updateUnit,
  deleteUnit,
  getUnits,
  getUnitById,
  getUnitsByProject,
  updateUnitmanualy,
  getUnitsdistributeById,
  getUnitByProjectId,
  getUnitDetailsById,
  editUnitdetails,
};
