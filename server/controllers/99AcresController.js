const { db } = require("../db");

const axios = require('axios');



const getResponses = (req, res) => {
    db.query('SELECT * FROM responses_99acres ORDER BY received_on DESC', (err, results) => {
      if (err) return res.status(500).json({ error: 'Failed to fetch data from database' });
      res.json(results);
    });
  };
  
  module.exports = { getResponses };