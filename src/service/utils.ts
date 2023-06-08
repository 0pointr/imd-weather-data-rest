import config from "../config";
import DateFormatError from "../exceptions/DateFormatError";
import { Station } from "./scraper/StationScraper";

export async function getPageHtml(uri: string): Promise<string> {
    return (await fetch(uri)).text();
}

export function resolveStringTemplate(template : string, context : object) : string {
    return template.replace(/\$\{(.*?)\}/g, function(placeholder, name) {
        return context[name] || placeholder;
    })
}

export function getStationPageURL(station: Station): string {
    return resolveStringTemplate(config.station_weather_url_template, station)
}

export function getDateFromString(datum: string, format : string = 'dd-MMM'): Date {
    
    if (!new RegExp('^[0-9]{2}-[a-zA-Z]{3}$').test(datum)) {
        return new Date(Date.parse(datum))
    }

    const today : Date = new Date()
    const todayFmt : string = `${today.getDay()}-${today.getMonth()+1}-${today.getFullYear()}`
    const todayMidnightEpoch : number = Date.parse(todayFmt)

    const expectedDateEpoch = Date.parse(datum + '-' + today.getFullYear())

    if (expectedDateEpoch < todayMidnightEpoch) {
        return new Date(Date.parse(datum + '-' + (today.getFullYear()+1) ))
    } else {
        return new Date(expectedDateEpoch)
    }
}
