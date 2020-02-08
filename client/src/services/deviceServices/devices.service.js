import axios from "axios";

const DevicesService = {
  getAllDevicesByLocationId: (locationId) => {
    return axios.get(`/api/devices/${locationId}/all`);
  },



};

export {DevicesService}
