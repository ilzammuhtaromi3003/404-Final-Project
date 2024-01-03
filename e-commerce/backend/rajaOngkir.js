const axios = require('axios');

const apiKey = '86ee504db8abb644b6a2324e98e3b5d8'; 

const getProvinceList = async () => {
    try {
        const response = await axios.get('https://api.rajaongkir.com/starter/province', {
            headers: {
                key: apiKey, 
            },
        });
        return response.data.rajaongkir.results;
    } catch (error) {
        console.error('Error getting province list:', error.response.data);
        throw new Error('Failed to get province list from RajaOngkir');
    }
};

const getCityList = async (provinceId) => {
    try {
        const response = await axios.get(`https://api.rajaongkir.com/starter/city`, {
            headers: {
                key: apiKey,
            },
            params: {
                province: provinceId,
            },
        });
        return response.data.rajaongkir.results;
    } catch (error) {
        console.error('Error getting city list:', error.response.data);
        throw new Error('Failed to get city list from RajaOngkir');
    }
};

const getShippingCost = async (user, weight, courier) => {
    try {
        const response = await axios.post(
            'https://api.rajaongkir.com/starter/cost',
            {
                origin: 1,
                destination: user.destinationCityId,
                weight: weight,
                courier: courier,
            },
            {
                headers: {
                    key: apiKey,
                },
            }
        );

        return response.data.rajaongkir.results[0];
    } catch (error) {
        console.error('Error getting shipping cost:', error.response.data);
        throw new Error('Failed to get shipping cost from RajaOngkir');
    }
};



module.exports = {
    getProvinceList,
    getCityList,
    getShippingCost,
};
