import axios from "axios";

const DashboardsService = {
    createDashboardByLocationId: (locationId, data) => {
        return axios.post(`/api/dashboards/${locationId}`, data);
    },

    updateDashboardByLocationId: (locationId, data) => {
        return axios.put(`/api/dashboards/${locationId}`, data);
    },

    getDashboardByLocationId: (locationId) => {
        return axios.get(`/api/dashboards/${locationId}`);
    },

    removeWidgetById: (locationId, widgetIndex) => {
        return axios.delete(`/api/dashboards/${locationId}/${widgetIndex}`);
    }
};

export {DashboardsService}