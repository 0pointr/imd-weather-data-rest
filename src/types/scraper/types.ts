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

export type PageWeatherData = {
    station: Station;
    dailyForecasts: PageForcastWeatherData[];
    presentWeather?: PagePresentWeatherData;
    hasForecastWeatherData: boolean;
    hasPresentWeatherData: boolean;
    units: {
        temperature: TemperatureUnit,
        humidity: RelativeHumidityUnit,
        rainfall: RainfallUnit
    }
};

export type PageForcastWeatherData = {
    date: Date,
    minTemp: string,
    maxTemp: string,
    sky: string
}

export type PagePresentWeatherData = {
    date: Date,
    isReportedDate: boolean,
    maxTemp: string,
    maxTempDiff?: string,
    minTemp: string,
    minTempDiff?: string,
    rainfall?: string,
    relativeHumidity?: string,
    sunrise?: string,
    sunset?: string,
    moonrise?: string,
    moonset?: string,
}