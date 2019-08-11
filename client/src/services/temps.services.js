import axios from "axios";

const TempsService = {
    getAllTemps: () => {
            return axios.get('/api/temps')
    },

    getNLastTemps: (n) => {
        return axios.get(`/api/temps/${n}`)
    }
};

export {TempsService}