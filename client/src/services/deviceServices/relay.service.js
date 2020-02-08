import axios from "axios";

const RelayService = {
    addNewRelay: (locationId, data) => {
        return axios.post(`/api/devices/relay/${locationId}`, data);
    },

    relayToggle: (relayId) => {
        return axios.get(`/api/devices/relay/${relayId}/toggle`);
    },

};

export {RelayService}
