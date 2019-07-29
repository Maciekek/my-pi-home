const temps = [22.0,22.1, 22.3,22.4,25,26,27,28.1,29,30,31.3,32.3,34.5,34.6,35.1,35.2,35.3,35.4,35.6,35.7,35.8,35.9,35.9];
let counter = 0;
const Reader = {

    getValue: () => {
        counter++;
        return temps[counter];
    }
};

module.exports = Reader;
