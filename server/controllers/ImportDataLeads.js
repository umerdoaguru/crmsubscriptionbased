const xlsx = require("xlsx");
const { db } = require("../db");
const moment = require("moment");

const importLeads = (req, res) => {
  try {
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (!sheetData.length) {
      return res.status(400).json({ error: 'No data found in the Excel file' });
    }

    // Form data from frontend
    const {
      assignedTo,
      employeeId,
      main_project_id,
      project_name,
      unit_type,
      unit_id,
      assignedBy,
      user_id,
      assigned_date
    } = req.body;

    const convertExcelDate = (excelDate) => {
      return typeof excelDate === "number"
        ? moment(new Date((excelDate - 25569) * 86400 * 1000)).format("YYYY-MM-DD")
        : moment(excelDate, "DD-MM-YYYY").isValid()
        ? moment(excelDate, "DD-MM-YYYY").format("YYYY-MM-DD")
        : null;
    };

    const values = sheetData.map((lead) => [
      lead["Lead Number"] || null,
      lead["Name"] || null,
      lead["Phone"] || null,
      assignedTo,
      lead["Lead Source"] || null,
      employeeId,
      project_name,
      main_project_id,
      unit_type,
      unit_id,
      lead["Address"] || null,
      assigned_date || moment().format("YYYY-MM-DD"),
      convertExcelDate(lead["Actual Date"]),
      assignedBy,
      user_id,
    ]);
    console.log(values);
    

    const sql = `
      INSERT INTO leads (
        lead_no,
        name,
        phone,
        assignedTo,
        leadSource,
        employeeId,
        project_name,
        main_project_id,
        unit_type,
        unit_id,
        address,
        createdTime,
        actual_date,
        assignedBy,
        user_id
      ) VALUES ?
    `;

    db.query(sql, [values], (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Database insert failed', details: err });
      }
      res.status(200).json({ message: 'Leads imported successfully', inserted: result.affectedRows });
    });

  } catch (error) {
    res.status(500).json({ error: 'File processing failed', details: error.message });
  }
};

module.exports = { importLeads };
