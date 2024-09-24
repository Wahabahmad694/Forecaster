import axios from "axios";
import { apiKey } from "../constants/constants";


const forcastEndpoints = params => `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${params.cityName}&days=${params.days}&aqi=no&alerts=no`
const locationEndPoint = params => `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${params.cityName}`


const apiCall = async (endpoint) => {
    const options = {
        method: 'GET',
        url: endpoint
    }
    try {
        const respone = await axios.request(options);
        return respone.data;

    } catch (err) {
        console.log("error: ", err)
        return null;

    }

}

export const fetchWeatherForecast = params => {
    return apiCall(forcastEndpoints(params));
}


export const fetchLocation = params => {
    return apiCall(locationEndPoint(params));
}