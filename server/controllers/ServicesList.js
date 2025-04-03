const { db } = require("../db");



// async function addServices(req, res) {
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
//       service.actual_price,
//       service.offer_price,
//       service.subscription_frequency,
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
//     console.error('Error adding services:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// }


const createServiceList = async (req, res) => {
  try {
 
    const { services } = req.body;

    const servicesValues = services.map((service) => [
      service.service_name,
      
    ]);

    const sql = "INSERT INTO services (service_name) VALUES ?";

    await new Promise((resolve, reject) => {
      db.query(sql, [servicesValues], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    res.status(201).json({ success: true, message: 'Services added successfully' });
  } catch (error) {
    console.error('Error adding services:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


const getServicelist = async (req,res)=>{


 const sql = `SELECT * FROM services`;

 db.query(sql,(err,result)=>{
  if(err){
    console.error('Error feching services:',err);
    res.status(500).json({error:"Internal Server Error"})
  } else{
  res.status(200).json(result);
  }
 })


}
const getServiceById = async(req,res)=>{
  const {serviceId} = req.params;
  const sql = `SELECT * FROM services WHERE service_id = ? `

  db.query(sql, [serviceId], (err,result)=>{
    if(err){
      console.error('Error feching services:',err);
      res.status(500).json({error:"Internal Server Error"})
    } else{
    res.status(200).json(result);
    }
   })
}

const deleteServicename = async(req,res)=>{
  const {serviceId} = req.params;
  const sql = `DELETE FROM services WHERE service_id = ? `

  db.query(sql,[serviceId],(error ,result)=>{

    if(error){
      console.error("Error of Deleteing Service");
      res.status(500).json({error:"Internal Server Error "});
    } else{
      console.log("Successful Delete Service");
      res.status(200).json({success:"Successful Delete Service"})
    }
  })
}


const updateServiceList = async (req, res) => {
  try {
    const { services } = req.body;

    for (const service of services) {
      const { service_name, service_id } = service;

      const sql = `UPDATE services SET service_name = ? WHERE service_id = ?`;
      await new Promise((resolve, reject) => {
        db.query(sql, [service_name, service_id], (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
    }

    res.status(200).json({ success: true, message: 'Services updated successfully' });
  } catch (error) {
    console.error('Error updating services:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}




module.exports = { createServiceList,getServicelist,deleteServicename,updateServiceList, getServiceById};

