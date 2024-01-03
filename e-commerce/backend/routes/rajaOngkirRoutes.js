const express = require('express');
const router = express.Router();
const { getProvinceList, getCityList } = require('../rajaOngkir');

// Route for fetching province list
router.get('/provinces', async (req, res) => {
    try {
      const provinces = await getProvinceList();
      res.json(provinces);
    } catch (error) {
      console.error('Error fetching province list:', error);
      res.status(500).json({ error: 'Failed to get province list' });
    }
  });
  
  // Route for fetching city list by province ID
  router.get('/cities/:provinceId', async (req, res) => {
    const { provinceId } = req.params;
    try {
      const cities = await getCityList(provinceId);
      res.json(cities);
    } catch (error) {
      console.error('Error fetching city list:', error);
      res.status(500).json({ error: 'Failed to get city list' });
    }
  });
  
  module.exports = router;