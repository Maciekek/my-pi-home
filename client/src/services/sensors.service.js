import axios from "axios";

const SensorsService = {
    getSensorValues: (locationId, params) => {
        const sensors = params.sensors.map(sensor => {
            return sensor.sensorId;
        });

        const body = {
            sensorIds: sensors,
            from: 'from',
            to: 'to',
            limit: params.limit || 1
        };

        return axios.post(`/api/sensors/${locationId}`, body )
    }
};

export {SensorsService}