import { Station } from "../../service/scraper/StationScraper";

export type PageWeatherData = {
    station: Station;
    dailyForecasts: ForcastWeatherData[];
    presentWeather?: PresentWeatherData;
    hasForecastWeatherData: boolean;
    hasPresentWeatherData: boolean;
};

export type ForcastWeatherData = {
    date: Date,
    minTemp: number,
    maxTemp: number,
    sky: string
}

export enum TemperatureUnit {
    celcius = 'celcius'
}

export enum RelativeHumidityUnit {
    percent = 'percent'
}
export enum RainfallUnit {
    mm = 'mm'
}

export type PresentWeatherData = {
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
    units: {
        temperature: TemperatureUnit,
        humidity: RelativeHumidityUnit,
        rainfall: RainfallUnit
    }
}