import axios from "axios";

const TempsService = {
    getAllTemps: () => {
            return axios.get('/api/temps')
    },

    getNLastTemps: (locationId, n) => {
        return axios.get(`/api/temps/${n}/${locationId}`)
    }
};

export {TempsService}