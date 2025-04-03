const { db } = require("../db");

const getEmployeeInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = `SELECT * FROM  
                        invoice_data 
                        JOIN  invoice_services_data ON invoice_data.invoice_id = invoice_services_data.invoice_id 
                        WHERE  invoice_data.employeeId = ?`;

    const result = await new Promise((resolve, reject) => {
      db.query(sql, [id], (err, results) => {
        if (err) {
          reject(err); // Reject the promise with the error
        } else {
          resolve(results); // Resolve the promise with the results
        }
      });
    });

    // Send the result as a response
    res.status(200).json(result);
  } catch (err) {
    console.error("Database query error:", err); // Log the error for debugging
    res.status(500).json({ message: "Internal Server Error", error: err });
  }
};

const getEmployeeLeads = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = "SELECT * FROM leads WHERE employeeId = ?";

    const result = await new Promise((resolve, reject) => {
      db.query(sql, [id], (err, results) => {
        if (err) {
          reject(err); // Reject the promise with the error
        } else {
          resolve(results); // Resolve the promise with the results
        }
      });
    });
    // Send the result as a response
    res.status(200).json(result);
  } catch (err) {
    console.error("Database query error:", err); // Log the error for debugging
    res.status(500).json({ message: "Internal Server Erro, error: errr" });
  }
};

const updateOnlyLeadStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { lead_status } = req.body;

    console.log(lead_status, id);

    const sql = `UPDATE leads SET 
    lead_status = ?
                    
    WHERE lead_id = ?`;

    await new Promise((resolve, reject) => {
      db.query(sql, [lead_status, id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    res.status(200).json({ message: "Lead updated successfully" });
  } catch (error) {
    console.error("Database update error:", error);
    res.status(500).json({ message: "Internal Server Error", error: err });
  }
};


const updateOnlyQuotationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { quotation } = req.body;

    console.log(quotation, id);

    const sql = `UPDATE leads SET 
    quotation = ?
    
    WHERE lead_id = ?`;

    await new Promise((resolve, reject) => {
      db.query(sql, [quotation, id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    res.status(200).json({ message: "Quotation Status updated successfully" });
  } catch (error) {
    console.error("Database update error:", error);
    res.status(500).json({ message: "Internal Server Error", error: err });
  }
};





const updateLeadStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      lead_status,
      

      deal_status,
      meeting_status,

      booking_amount,
      payment_mode,
      registry,

      reason,
     
      follow_up_status,

      d_closeDate, // Add d_closeDate (Deal Close Date) to destructured body
    } = req.body;

    console.log(
      lead_status,
      

      deal_status,
      meeting_status,
      booking_amount,
      payment_mode,
      registry,
      reason,
     
      follow_up_status,

      d_closeDate, // Log d_closeDate
      id
    );

    const sql = `UPDATE leads SET 
                      lead_status = ?, 
                      
                      
                      deal_status = ?, 
                      meeting_status=?,
                      booking_amount = ?,
      payment_mode = ?,
      registry = ?,
                      reason = ?, 
                     
                      follow_up_status = ?, 
                   
                      d_closeDate = ?      
                      WHERE lead_id = ?`;

    await new Promise((resolve, reject) => {
      db.query(
        sql,
        [
          lead_status,
          

          deal_status,
          meeting_status,
          booking_amount,
      payment_mode,
      registry,
          reason,
        
          follow_up_status,

          d_closeDate, // Pass d_closeDate to the query
          id,
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

    res.status(200).json({ message: "Lead updated successfully" });
  } catch (error) {
    console.error("Database update error:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

const getEmployeeQuotation = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = "SELECT * FROM quotations_information WHERE employeeId = ?";

    const result = await new Promise((resolve, reject) => {
      db.query(sql, [id], (err, results) => {
        if (err) {
          reject(err); // Reject the promise with the error
        } else {
          resolve(results); // Resolve the promise with the results
        }
      });
    });

    // Send the result as a response
    res.status(200).json(result);
  } catch (err) {
    console.error("Database query error:", err); // Log the error for debugging
    res.status(500).json({ message: "Internal Server Error", error: err });
  }
};

const employeeProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const sql =
      "SELECT employeeId, name, email, phone, position, createdTime FROM employee WHERE employeeId = ?";

    const result = await new Promise((resolve, reject) => {
      db.query(sql, [id], (err, results) => {
        if (err) {
          reject(err); // Reject the promise with the error
        } else {
          resolve(results); // Resolve the promise with the results
        }
      });
    });

    // Send the result as a response
    res.status(200).json(result);
  } catch (err) {
    console.error("Database query error:", err); // Log the error for debugging
    res.status(500).json({ message: "Internal Server Error", error: err });
  }
};

const getAllEmployeeTotalLeads = async (req, res) => {
  try {
    const query = `
    SELECT 
    e.employeeId,
    e.name,
    e.email,
    e.phone,
    COUNT(l.lead_id) AS total_leads
    FROM employee e
    LEFT JOIN leads l ON e.employeeId = l.employeeId
    
    GROUP BY e.employeeId;
    `;

    db.query(query, (err, results) => {
      if (err) {
        console.error("Error fetching employees with lead count:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      return res.status(200).json({
        success: true,
        employees: results,
      });
    });
  } catch (error) {
    console.error("Error in fetching employees:", error);
    res.status(500).json({
      success: false,
      message: "Error in fetching employees",
      error: error.message,
    });
  }
};

const getLeadQuotation = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = "SELECT * FROM quotations_information WHERE lead_id = ?";
    const result = await new Promise((resolve, reject) => {
      db.query(sql, [id], (err, results) => {
        if (err) {
          reject(err); // Reject the promise with the error
        } else {
          resolve(results); // Resolve the promise with the results
        }
      });
    });

    // Send the result as a response
    res.status(200).json(result);
  } catch (err) {
    console.error("Database query error:", err); // Log the error for debugging
    res.status(500).json({ message: "Internal Server Error", error: err });
  }
};

const getEmployeeVisit = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = "SELECT * FROM visit WHERE lead_id = ?";

    const result = await new Promise((resolve, reject) => {
      db.query(sql, [id], (err, results) => {
        if (err) {
          reject(err); // Reject the promise with the error
        } else {
          resolve(results); // Resolve the promise with the results
        }
      });
    });
    // Send the result as a response
    res.status(200).json(result);
  } catch (err) {
    console.error("Database query error:", err); // Log the error for debugging
    res.status(500).json({ message: "Internal Server Erro, error: errr" });
  }
};

const createVisit = (req, res) => {
  const {
    project_name,
    lead_id,
    name,
    employeeId,
    employee_name,
    visit,
    visit_date,
  
  } = req.body;

  const sql = `INSERT INTO visit (
    project_name,
    lead_id,
    name,
    employeeId,
    employee_name,
    visit,
    visit_date
   
  ) VALUES (?,?,?,?,?,?,?)`;

  db.query(
    sql,
    [project_name, lead_id, name, employeeId, employee_name, visit, visit_date],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: "Error inserting data" });
      } else {
        res.status(201).json({
          success: true,
          message: "Visit data successfully submitted",
        });
      }
    }
  );
};

const updateVisit = (req, res) => {
  const {
    id, // Unique identifier for the visit
    project_name,
    lead_id,
    name,
    employeeId,
    employee_name,
    visit,
    visit_date,
    report,
  } = req.body;

  // Basic validation
  if (!id || !project_name || !visit || !visit_date || !report) {
    return res
      .status(400)
      .json({ error: "Please provide all required fields." });
  }

  const sql = `UPDATE visit SET 
    project_name = ?,
    lead_id = ?, 
    name = ?, 
    employeeId = ?, 
    employee_name = ?, 
    visit = ?, 
    visit_date = ?, 
    report = ? 
    WHERE id = ?`;

  db.query(
    sql,
    [project_name, lead_id, name, employeeId, employee_name, visit, visit_date, report, id],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: "Error updating visit data" });
      } else if (results.affectedRows === 0) {
        res.status(404).json({ error: "Visit not found" });
      } else {
        res
          .status(200)
          .json({ success: true, message: "Visit data updated successfully" });
      }
    }
  );
};

const deleteVisit = (req, res) => {
  const { id } = req.params;

  // Basic validation
  if (!id) {
    return res.status(400).json({ error: "Visit ID is required" });
  }

  const sql = `DELETE FROM visit WHERE id = ?`;

  db.query(sql, [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: "Error deleting visit" });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ error: "Visit not found" });
    } else {
      res
        .status(200)
        .json({ success: true, message: "Visit deleted successfully" });
    }
  });
};



const getEmployeeFollow_Up= async (req, res) => {
  try {
    const { id } = req.params;
    const sql = "SELECT * FROM follow_up_leads WHERE lead_id = ?";

    const result = await new Promise((resolve, reject) => {
      db.query(sql, [id], (err, results) => {
        if (err) {
          reject(err); // Reject the promise with the error
        } else {
          resolve(results); // Resolve the promise with the results
        }
      });
    });
    // Send the result as a response
    res.status(200).json(result);
  } catch (err) {
    console.error("Database query error:", err); // Log the error for debugging
    res.status(500).json({ message: "Internal Server Erro, error: errr" });
  }
};



const createFollow_Up = (req, res) => {
  const {
    project_name,
    lead_id,
    name,
    employeeId,
    employee_name,
    follow_up_type,
    follow_up_date,
    report
  
  } = req.body;

  const sql = `INSERT INTO follow_up_leads (
    project_name,
  lead_id,
    name,
    employeeId,
    employee_name,
  follow_up_type,
    follow_up_date,
    report
   
  ) VALUES (?,?,?,?,?,?,?,?)`;

  db.query(
    sql,
    [project_name, lead_id, name, employeeId, employee_name,  follow_up_type,follow_up_date,report],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: "Error inserting data" });
      } else {
        res.status(201).json({
          success: true,
          message: "Follow Up data successfully submitted",
        });
      }
    }
  );
};

const updateFollow_Up = (req, res) => {
  const {
    id, // Unique identifier for the Follow Up
    project_name,
    lead_id,
    name,
    employeeId,
    employee_name,
    follow_up_type,
    follow_up_date,
    report
  } = req.body;

  // Basic validation
  if (!id || !project_name || !follow_up_type || !follow_up_date || !report) {
    return res
      .status(400)
      .json({ error: "Please provide all required fields." });
  }

  const sql = `UPDATE follow_up_leads SET 
    project_name = ?,
    lead_id = ?, 
    name = ?, 
    employeeId = ?, 
    employee_name = ?, 
    follow_up_type = ?, 
   follow_up_date = ?,
    report = ? 
    WHERE id = ?`;

  db.query(
    sql,
    [project_name, lead_id, name, employeeId, employee_name,  follow_up_type,follow_up_date, report, id],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: "Error updating Follow Up data" });
      } else if (results.affectedRows === 0) {
        res.status(404).json({ error: "Follow Up not found" });
      } else {
        res
          .status(200)
          .json({ success: true, message: "Follow Up data updated successfully" });
      }
    }
  );
};

const deleteFollow_Up = (req, res) => {
  const { id } = req.params;

  // Basic validation
  if (!id) {
    return res.status(400).json({ error: "Follow Up ID is required" });
  }

  const sql = `DELETE FROM follow_up_leads WHERE id = ?`;

  db.query(sql, [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: "Error deleting visit" });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ error: "Follow Up not found" });
    } else {
      res
        .status(200)
        .json({ success: true, message: "Follow Up deleted successfully" });
    }
  });
};

const getEmployeebyidvisit = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = "SELECT * FROM visit WHERE employeeId = ?";

    const result = await new Promise((resolve, reject) => {
      db.query(sql, [id], (err, results) => {
        if (err) {
          reject(err); // Reject the promise with the error
        } else {
          resolve(results); // Resolve the promise with the results
        }
      });
    });
    // Send the result as a response
    res.status(200).json(result);
  } catch (err) {
    console.error("Database query error:", err); // Log the error for debugging
    res.status(500).json({ message: "Internal Server Erro, error: errr" });
  }
};

const AllgetEmployeebyvisit = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = "SELECT * FROM visit ";

    const result = await new Promise((resolve, reject) => {
      db.query(sql, (err, results) => {
        if (err) {
          reject(err); // Reject the promise with the error
        } else {
          resolve(results); // Resolve the promise with the results
        }
      });
    });
    // Send the result as a response
    res.status(200).json(result);
  } catch (err) {
    console.error("Database query error:", err); // Log the error for debugging
    res.status(500).json({ message: "Internal Server Erro, error: errr" });
  }
};

const updateOnlyVisitStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { visit,visit_date } = req.body;

    console.log(visit, id);

    const sql = `UPDATE leads SET 
    visit = ?, visit_date = ?
    
    WHERE lead_id = ?`;

    await new Promise((resolve, reject) => {
      db.query(sql, [visit,visit_date, id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    res.status(200).json({ message: "Visit Status updated successfully" });
  } catch (error) {
    console.error("Database update error:", error);
    res.status(500).json({ message: "Internal Server Error", error: err });
  }
};

const updateOnlyFollowUpStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { follow_up_status } = req.body;

    console.log(follow_up_status, id);

    const sql = `UPDATE leads SET 
    follow_up_status = ?
                    
    WHERE lead_id = ?`;

    await new Promise((resolve, reject) => {
      db.query(sql, [follow_up_status, id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    res.status(200).json({ message: "Follow Up updated successfully" });
  } catch (error) {
    console.error("Database update error:", error);
    res.status(500).json({ message: "Internal Server Error", error: err });
  }
};




const createRemark = async (req, res) => {
  try {
    const {project_name, lead_id, name, employee_name, employeeId, remark_status, date } = req.body;
    

    if (!lead_id || !remark_status || !date) {
      return res
        .status(400)
        .json({ error: "Lead ID, remark status, and date are required." });
    }

    // Insert remark
    const sqlRemark = `
      INSERT INTO remark (
        project_name, lead_id, name, employee_name, employeeId, remark_status, date
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`;

    const resultRemark = await new Promise((resolve, reject) => {
      db.query(
        sqlRemark,
        [project_name, lead_id, name, employee_name, employeeId, remark_status, date],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });

    // Get the newly created remark ID
    const remarkId = resultRemark.insertId;

    // Update the leads table with the new remarks_id
    const sqlUpdateLeads = `
      UPDATE leads SET 
        remark_id = ?, 
        remark_status = ?,
        answer_remark = 'pending'
      WHERE lead_id = ?`;

    await new Promise((resolve, reject) => {
      db.query(sqlUpdateLeads, [remarkId, remark_status, lead_id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    res.status(200).json({
      success: true,
      message: "Remark created and lead updated successfully",
      remark: {
        id: remarkId,
        lead_id,
        remark_status,
      },
    });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }

};

const updateRemark = (req, res) => {
  const {
    id, // Unique identifier for the remark
    project_name,
    lead_id,
    name,
    employee_name,
    employeeId,
    remark_status,
 
    date,
  } = req.body;
  console.log( id, // Unique identifier for the remark
    lead_id,
    project_name,
    name,
    employee_name,
    employeeId,
    remark_status,

    date,);
  



  const sql = `UPDATE remark SET 
    project_name = ?,
    lead_id = ?, 
    name = ?, 
    employee_name = ?, 
    employeeId = ?, 
    remark_status = ?, 
   
    date = ? 
    WHERE id = ?`;

  db.query(
    sql,
    [project_name, lead_id, name, employee_name, employeeId, remark_status, date, id], // Include answer_remark here
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Error updating remark data" });
      } else if (results.affectedRows === 0) {
        return res.status(404).json({ error: "Remark not found" });
      } else {
        return res
          .status(200)
          .json({ success: true, message: "Remark updated successfully" });
      }
    }
  );
};


const deleteRemark = (req, res) => {
  const { id } = req.params;

  // Basic validation
  if (!id) {
    return res.status(400).json({ error: "Remark ID is required" });
  }

  const sql = `DELETE FROM remark WHERE id = ?`;

  db.query(sql, [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: "Error deleting remark" });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ error: "Remark not found" });
    } else {
      res
        .status(200)
        .json({ success: true, message: "Remark deleted successfully" });
    }
  });
};

const getEmployeeRemark= async (req, res) => {
  try {
    const { id } = req.params;
    const sql = "SELECT * FROM remark WHERE lead_id = ?";

    const result = await new Promise((resolve, reject) => {
      db.query(sql, [id], (err, results) => {
        if (err) {
          reject(err); // Reject the promise with the error
        } else {
          resolve(results); // Resolve the promise with the results
        }
      });
    });
    // Send the result as a response
    res.status(200).json(result);
  } catch (err) {
    console.error("Database query error:", err); // Log the error for debugging
    res.status(500).json({ message: "Internal Server Erro, error: errr" });
  }
};


const updateOnlyRemarkStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { remark_status } = req.body;

    console.log(remark_status, id);

    const sql = `UPDATE leads SET 
    remark_status = ?
                    
    WHERE lead_id = ?`;

    await new Promise((resolve, reject) => {
      db.query(sql, [remark_status, id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    res.status(200).json({ message: "Remarks Status updated successfully" });
  } catch (error) {
    console.error("Database update error:", error);
    res.status(500).json({ message: "Internal Server Error", error: err });
  }
};
const updateOnlyRemarkAnswerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { answer_remark } = req.body;

    console.log(answer_remark, id);

    const sql = `UPDATE leads SET 
    answer_remark = ?
                    
    WHERE lead_id = ?`;

    await new Promise((resolve, reject) => {
      db.query(sql, [answer_remark, id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    res.status(200).json({ message: "Answer Remark updated successfully" });
  } catch (error) {
    console.error("Database update error:", error);
    res.status(500).json({ message: "Internal Server Error", error: err });
  }
};


const updateOnlyRemarkAnswer = async (req, res) =>{
  
  try {
  const { lead_id, answer_remark, remark_id } = req.body;

  console.log(`Lead ID: ${lead_id}, Answer Remark: ${answer_remark}, Remark ID: ${remark_id}`);

  // SQL to update `answer_remark` in the `leads` table
  const sqlUpdateLeads = `
    UPDATE leads SET 
      answer_remark = ? 
    WHERE lead_id = ?`;

  // SQL to update `answer_remark` in the `remark` table
  const sqlUpdateRemark = `
    UPDATE remark SET 
      answer_remark = ? 
    WHERE id = ?`;

  // Execute the first query to update `leads` table
  await new Promise((resolve, reject) => {
    db.query(sqlUpdateLeads, [answer_remark, lead_id], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });

  // Execute the second query to update `remark` table
  await new Promise((resolve, reject) => {
    db.query(sqlUpdateRemark, [answer_remark, remark_id], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });

  res.status(200).json({ message: "Answer Remark status updated successfully in both tables" });
} catch (error) {
  console.error("Database update error:", error);
  res.status(500).json({ message: "Internal Server Error", error });
}

}


const createEmployeeUnitSold = (req, res) => {
  const {
    
    lead_id,
    name,
    employeeId,
    employee_name,
    unit_id,
    unit_no,
    unit_status,
    main_project_id,
    project_name,
    date
  
  } = req.body;

  const sql = `INSERT INTO employee_sold_units (
    
   
    lead_id,
    name,
    employeeId,
    employee_name,
    unit_id,
    unit_no,
    unit_status,
    main_project_id,
    project_name,
    date
   
  ) VALUES (?,?,?,?,?,?,?,?,?,?)`;

  db.query(
    sql,
    [ 
      lead_id,
      name,
      employeeId,
      employee_name,
      unit_id,
      unit_no,
      unit_status,
      main_project_id,
      project_name,
      date],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: "Error inserting data" });
      } else {
        res.status(201).json({
          success: true,
          message: "Unit Number data successfully submitted",
        });
      }
    }
  );
};

const updateEmployeeUnitSold = (req, res) => {
  const {
    id, // Unique identifier for the visit
    lead_id,
    name,
    employeeId,
    employee_name,
    unit_id,
    unit_no,
    unit_status,
    main_project_id,
    project_name,
    date
  } = req.body;

  // Basic validation
  if (!id || !lead_id || !name || !unit_no || !unit_status) {
    return res
      .status(400)
      .json({ error: "Please provide all required fields." });
  }

  const sql = `UPDATE employee_sold_units SET 
   
    
    lead_id = ?,
    name = ?,
    employeeId = ?,
    employee_name = ?,
    unit_id = ?,
    unit_no = ?,
    unit_status = ?,
    main_project_id = ?,
    project_name = ?,
    date= ? 
    WHERE id = ?`;

  db.query(
    sql,
    [ 
      lead_id,
      name,
      employeeId,
      employee_name,
      unit_id,
      unit_no,
      unit_status,
      main_project_id,
      project_name,
      date, id],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: "Error updating Unit Sold data" });
      } else if (results.affectedRows === 0) {
        res.status(404).json({ error: "Unit Sold not found" });
      } else {
        res
          .status(200)
          .json({ success: true, message: "Unit Sold data updated successfully" });
      }
    }
  );
};

const deleteEmployeeUnitSold = (req, res) => {
  const { id } = req.params;

  // Basic validation
  if (!id) {
    return res.status(400).json({ error: "Unit ID is required" });
  }

  const sql = `DELETE FROM  employee_sold_units WHERE id = ?`;

  db.query(sql, [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: "Error deleting Unit Sold" });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ error: "Unit Sold not found" });
    } else {
      res
        .status(200)
        .json({ success: true, message: "Unit Sold deleted successfully" });
    }
  });
};


const getEmployeeUnitSold = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = "SELECT * FROM  employee_sold_units";

    const result = await new Promise((resolve, reject) => {
      db.query(sql, [id], (err, results) => {
        if (err) {
          reject(err); 
        } else {
          resolve(results); 
        }
      });
    });
    // Send the result as a response
    res.status(200).json(result);
  } catch (err) {
    console.error("Database query error:", err); // Log the error for debugging
    res.status(500).json({ message: "Internal Server Erro, error: errr" });
  }
};
const getEmployeeUnitSoldById = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = "SELECT * FROM  employee_sold_units WHERE employeeId = ?";

    const result = await new Promise((resolve, reject) => {
      db.query(sql, [id], (err, results) => {
        if (err) {
          reject(err); 
        } else {
          resolve(results); 
        }
      });
    });
    // Send the result as a response
    res.status(200).json(result);
  } catch (err) {
    console.error("Database query error:", err); // Log the error for debugging
    res.status(500).json({ message: "Internal Server Erro, error: errr" });
  }
};
const getEmployeeUnitSoldByLeadId = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = "SELECT * FROM  employee_sold_units WHERE lead_id = ?";

    const result = await new Promise((resolve, reject) => {
      db.query(sql, [id], (err, results) => {
        if (err) {
          reject(err); 
        } else {
          resolve(results); 
        }
      });
    });
    // Send the result as a response
    res.status(200).json(result);
  } catch (err) {
    console.error("Database query error:", err); // Log the error for debugging
    res.status(500).json({ message: "Internal Server Erro, error: errr" });
  }
};


const getUnitDataByUnitId = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = "SELECT * FROM unit_data WHERE unit_id = ?";

    const result = await new Promise((resolve, reject) => {
      db.query(sql, [id], (err, results) => {
        if (err) {
          reject(err); 
        } else {
          resolve(results); 
        }
      });
    });
    // Send the result as a response
    res.status(200).json(result);
  } catch (err) {
    console.error("Database query error:", err); // Log the error for debugging
    res.status(500).json({ message: "Internal Server Erro, error: errr" });
  }
};
const updateOnlyUnitDataStatusById = async (req, res) => {
  try {
    const { id } = req.params;
    const { unit_status } = req.body;

    

    const sql = `UPDATE unit_data SET 
    status = ?
                    
    WHERE unit_number = ?`;

    await new Promise((resolve, reject) => {
      db.query(sql, [unit_status, id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    res.status(200).json({ message: "Unit Status updated successfully" });
  } catch (error) {
    console.error("Database update error:", error);
    res.status(500).json({ message: "Internal Server Error", error: err });
  }
};


const updateOnlyUnitStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { unit_number,unit_status } = req.body;



    const sql = `UPDATE leads SET 
    unit_number = ?, unit_status = ?
                    
    WHERE lead_id = ?`;

    await new Promise((resolve, reject) => {
      db.query(sql, [unit_number,unit_status, id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    res.status(200).json({ message: "Lead of Unit Data updated successfully" });
  } catch (error) {
    console.error("Database update error:", error);
    res.status(500).json({ message: "Internal Server Error", error: err });
  }
};



module.exports = {
  getEmployeeInvoice,
  getEmployeeLeads,
  updateLeadStatus,
  getEmployeeQuotation,
  employeeProfile,
  updateOnlyLeadStatus,
  updateOnlyQuotationStatus,
  getAllEmployeeTotalLeads,
  getLeadQuotation,
  getEmployeeVisit,
  createVisit,
  deleteVisit,
  updateVisit,
  getEmployeeFollow_Up,
  createFollow_Up,
  deleteFollow_Up,
  updateFollow_Up,
  getEmployeebyidvisit,
  AllgetEmployeebyvisit,
  updateOnlyVisitStatus,
  updateOnlyFollowUpStatus,createRemark,updateRemark,deleteRemark,getEmployeeRemark,updateOnlyRemarkStatus,updateOnlyRemarkAnswer,updateOnlyRemarkAnswerStatus,createEmployeeUnitSold,updateEmployeeUnitSold,deleteEmployeeUnitSold,getEmployeeUnitSold,getEmployeeUnitSoldById,getUnitDataByUnitId,updateOnlyUnitDataStatusById,updateOnlyUnitStatus,getEmployeeUnitSoldByLeadId,

};
