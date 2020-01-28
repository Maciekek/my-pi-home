
class HeartbeatMemory {
    memory = {};

    addToMemoryLastResultOfLocation(locationId, sensorIds, receiveDate) {
        this.memory[locationId] = {
            sensorIds,
            receiveDate,
        };
    }
}

export {HeartbeatMemory};
