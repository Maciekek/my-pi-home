import fetch from 'node-fetch';

const fetchData = () => {
  fetch('http://77.55.217.143/api/temps/5/5d83477c1d15b82553f8932f').then(results => {
    return results.json()
  }).then(data => {
    data.map(temp => {
      const requestPayload = {
        value: temp.value,
        date: temp.date,
        locationId: temp.locationId,
        sensorId: temp.sensorId
      }
      
      
      fetch("https://temperaturki.bieda.it/api/temps", {
        method: "POST",
        body: requestPayload
      }).then(() => {
        console.log(20, 'Dane wysłane', JSON.stringify(requestPayload))
      }).catch((e) => {
        console.log(22, "Nie udało się wysłać danych", e)
      })
    })
  })
}

console.log("Działam!");
fetchData();
setInterval(fetchData, 600000);
