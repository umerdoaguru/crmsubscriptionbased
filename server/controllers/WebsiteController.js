const { db } = require("../db");

const axios = require('axios');
// Save form data to the database
const saveWebsiteAPI = (req, res) => {
  const { api } = req.body;

  if (!api) {
    return res.status(400).json({ error: 'api is required' });
  }

  db.query(
    'INSERT INTO website_api (api) VALUES (?)',
    [api],
    (err, result) => {
      if (err) {
        console.error('Error inserting form data:', err);
        return res.status(500).json({ error: 'Failed to save form data' });
      }

      res.status(200).json({ message: 'Api saved successfully!' });
    }
  );
};

const updateWebsiteAPI = (req, res) => {
  const { id, api } = req.body;
  

  // Check if form_id and form_name are provided
  if (!id ) {
    return res.status(400).json({ error: 'ID is required' });
  }

  // Update the form data in the database
  db.query(
    'UPDATE website_api SET  api = ? WHERE id = ?',
    [ api,id],
    (err, result) => {
      if (err) {
        console.error('Error updating Website Api data:', err);
        return res.status(500).json({ error: 'Failed to update Website Api data' });
      }

      // Check if any row was affected by the update
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Website Api not found' });
      }

      res.status(200).json({ message: 'Website Api updated successfully!' });
    }
  );
};

const deleteWebsiteAPI = (req, res) => {
  const { id } = req.params;

  // Check if id is provided
  if (!id) {
    return res.status(400).json({ error: 'Api is required' });
  }

  // Delete the form from the database
  db.query(
    'DELETE FROM website_api WHERE id = ?',
    [id],
    (err, result) => {
      if (err) {
        console.error('Error deleting Website Api data:', err);
        return res.status(500).json({ error: 'Failed to delete Website Api data' });
      }

      // Check if any row was affected by the delete
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Website Api not found' });
      }

      res.status(200).json({ message: 'Website Api deleted successfully!' });
    }
  );
};




// Fetch all Website Api  from the database
const getwebsite_api = (req, res) => {
  db.query('SELECT * FROM website_api', (err, results) => {
    if (err) {
      console.error('Error fetching Website Api :', err);
      return res.status(500).json({ error: 'Failed to fetch Website Api ' });
    }
    res.status(200).json(results);
  });
};






module.exports = { saveWebsiteAPI,updateWebsiteAPI,deleteWebsiteAPI, getwebsite_api};
