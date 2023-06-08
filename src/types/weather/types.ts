import { Station } from "../../service/scraper/StationScraper";


export enum TemperatureUnit {
    celcius = 'celcius'
}
export enum RelativeHumidityUnit {
    percent = 'percent'
}
export enum RainfallUnit {
    mm = 'mm'
}

export type WeatherData = {
    station: Station;
    hasForecastWeatherData: boolean,
    hasPresentWeatherData: boolean,
    dailyForecasts?: ForcastWeatherData[],
    presentWeather?: PresentWeatherData;
    units: {
        temperature: TemperatureUnit,
        humidity: RelativeHumidityUnit,
        rainfall: RainfallUnit
    }
};

export type ForcastWeatherData = {
    date: string,
    minTemp: number,
    maxTemp: number,
    sky: string
}

export type PresentWeatherData = {
    date: string,
    isReportedDate: boolean,
    maxTemp: number,
    // maxTempDiff?: string,
    minTemp: number,
    // minTempDiff?: string,
    rainfall?: number,
    relativeHumidity?: number,
    sunrise?: string,
    sunset?: string,
    moonrise?: string,
    moonset?: string,
}