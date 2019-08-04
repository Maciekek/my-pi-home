import axios from "axios";

const LocationsService = {
    getAllLocations: () => {
        return axios.get('/api/locations')
    }
};

export {LocationsService}