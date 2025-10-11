var baseurl = 'https://vpic.nhtsa.dot.gov/api/vehicles/';

 async function getVin(vin) {
    if (vin !=null) {
        const vindata = await fetch(url+`DecodeVinValuesExtended/${vin}?format=json`);
    const data = await vindata.json();
    console.table(data.Results)
    }
}