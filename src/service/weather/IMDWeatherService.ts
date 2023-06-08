import { PageWeatherData } from "../../types/scraper/types";
import { RainfallUnit, RelativeHumidityUnit, TemperatureUnit, WeatherData } from "../../types/weather/types";
import { Station } from "../scraper/StationScraper";
import { scrapeWeatherData } from '../scraper/StationWeatherDataScraper'
import { toNumberOrNull } from '../utils'
import Date from 'date-and-time'
import { getStationByCode } from "../station/StationsService";

export async function fetchWeatherData(station: Station) : Promise<WeatherData> {
    const scrapedWeatherData : PageWeatherData = await scrapeWeatherData(station)
    const weatherData = <WeatherData>{}
    
    weatherData.station = station
    weatherData.hasForecastWeatherData = scrapedWeatherData.hasForecastWeatherData
    weatherData.hasPresentWeatherData = scrapedWeatherData.hasPresentWeatherData
    weatherData.dailyForecasts = 
        scrapedWeatherData.dailyForecasts.map(forecast => {
            return {
                date: Date.format(forecast.date, 'YYYY-MM-DD'),
                minTemp: toNumberOrNull(forecast.minTemp),
                maxTemp: toNumberOrNull(forecast.maxTemp),
                sky: forecast.sky
            }
        })
    weatherData.units = {
        temperature: TemperatureUnit.celcius,
        humidity: RelativeHumidityUnit.percent,
        rainfall: RainfallUnit.mm
    }
    if (scrapedWeatherData.hasPresentWeatherData) {
        const scrapedPresentWeather = scrapedWeatherData.presentWeather
        weatherData.presentWeather = {
            ...scrapedPresentWeather,
            date: Date.format(scrapedPresentWeather.date, 'YYYY-MM-DD'),
            minTemp: toNumberOrNull(scrapedPresentWeather.minTemp),
            maxTemp: toNumberOrNull(scrapedPresentWeather.maxTemp),
            rainfall: toNumberOrNull(scrapedPresentWeather.rainfall),
            relativeHumidity: toNumberOrNull(scrapedPresentWeather.relativeHumidity)
        }
    }

    return weatherData
}