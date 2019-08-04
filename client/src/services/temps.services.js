import axios from "axios";

const TempsService = {
    getAllTemps: () => {
        return axios.get('/api/temps')
    }
};

export {TempsService}