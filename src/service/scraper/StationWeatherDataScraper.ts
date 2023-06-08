import { Station } from "./StationScraper";
import { getDateFromString, getPageHtml, getStationPageURL } from "../utils";
import cheerio from "cheerio";
import WeatherDataNotFoundError from "../../exceptions/WeatherDataNotFoundError";
import fs from 'fs'
import logger from "../../logger";
import { val } from "cheerio/lib/api/attributes";
import { ForcastWeatherData, PageWeatherData, PresentWeatherData, 
         RainfallUnit, RelativeHumidityUnit, TemperatureUnit } from "../../types/scraper/types";

const forecastTbodySelectorExtendedPage = 'table:nth-child(4) > tbody > tr:nth-child(2) > td > table > tbody' // > tr:nth-child(3)'
const forecastTbodySelector = 'table table' //'table > tbody > tr > td:nth-child(2) > table > tbody' // > tr:nth-child(3)'

function scrapeForecastDataHtml(html: string, station : Station): ForcastWeatherData[] {
    const $ = cheerio.load(html)

    let tableBody = $(forecastTbodySelectorExtendedPage)
    if (tableBody.length === 0) {
        tableBody = $(forecastTbodySelector)
    }

    if (tableBody.length === 0) {
        throw new WeatherDataNotFoundError(`Forecast table not found for station: ${JSON.stringify(station)}`)
    }

    const dayWeatherForcast : ForcastWeatherData[] = []
    const imageIndex = 3
    const dataIndex = { 0:'date', 1:'minTemp', 2:'maxTemp', 3:'image', 4:'sky'}
    tableBody.find('tr:nth-child(n+3)').each((rowIndex, row) => {
        try {
            let date : Date, 
                minTemp : number,
                maxTemp : number, 
                sky : string
            $(row).find('td').each((cellIndex, cell) => {
                if (cellIndex !== imageIndex) {
                    const datum = $(cell).text().trim()
                    const dataElement = dataIndex[cellIndex]
                    switch (dataElement) {
                        case 'date':
                            date = getDateFromString(datum)
                            break
                        case 'minTemp':
                            minTemp = Number(datum)
                            break
                        case 'maxTemp':
                            maxTemp = Number(datum)
                            break
                        case 'sky':
                            sky = datum
                            break
                    }
                }
            })
            dayWeatherForcast.push({date, minTemp, maxTemp, sky})
        } catch (e) {
            logger.error(`Error parsing forecast weather table:row: ${rowIndex}\n${e}`)
        }
    })
    return dayWeatherForcast
}

function assignValue(weatherData: PresentWeatherData, label: string, value: string) : void {
    const signatures = [
        { field: 'maxTemp', regex: /Max.*Temp/i},
        { field: 'minTemp', regex: /Min.*Temp/i},
        { field: 'rainfall', regex: /Rainfall/i},
        { field: 'relativeHumidity', regex: /Humidity/i},
        { field: 'sunset', regex: /Sunset/i},
        { field: 'sunrise', regex: /Sunrise/i},
        { field: 'moonrise', regex: /Moonrise/i},
        { field: 'moonset', regex: /Moonset/i},
    ]

    for (const sig of signatures) {
        if (sig.regex.test(label)) {
            weatherData[sig.field] = value
            return
        }
    }
}

function scrapePresentWeatherDataHtml(html: string, station: Station) : PresentWeatherData {
    const tableSelector = 'body > center > font > table:nth-child(4) tr:nth-child(1) td:nth-child(2)'
    const dateSelector = 'b:nth-child(3)'
    const $ = cheerio.load(html)
    
    // The IMD pages almost always have the forecast table, but sometimes,
    // the present weather data is missing. If the forecast table
    // selector for extended page fails, that's an indicator that this
    // page doesn't contain any historic data table.
    const forecastTableBody = $(forecastTbodySelectorExtendedPage)
    if (forecastTableBody.length === 0) {
        throw new WeatherDataNotFoundError("Present weather table not found for station: " + JSON.stringify(station))
    }
    
    let useReportedDate = true
    let dateString = $(dateSelector).text()
    if (!dateString) {
        logger.warn(`Date for present reported weather not found, using current system date.`)
        useReportedDate = false
    } else {
        dateString = dateString.replace(/Dated ?:/g, '')
    }
    
    const dataDate = useReportedDate 
                        ? getDateFromString(dateString, 'MMM dd, yyyy')
                        : new Date()

    const weatherData : PresentWeatherData = <PresentWeatherData>{}
    weatherData.date = dataDate,
    weatherData.isReportedDate = useReportedDate
    weatherData.units = {
        temperature: TemperatureUnit.celcius,
        humidity: RelativeHumidityUnit.percent,
        rainfall: RainfallUnit.mm
    }

    let historicTableBody = $(tableSelector)
    historicTableBody.find('tr:nth-child(n+2)').each((rowIndex, row) => {
        try {
            const label = $(row).children('td').first().text().trim()
            const value = $(row).children('td').last().text().trim()
            // console.log(`${label} == ${value}`)
            assignValue(weatherData, label, value)
        } catch (e) {
            logger.error(`Error parsing current weather table:row: ${rowIndex}\n${e}`)
        }
    })

    return weatherData
}

export function scrapePresentWeatherData(station: Station) : PresentWeatherData {
    // const html :string = await getPageHtml(getStationPageURL(station))
    // const data = await (await fetch('https://city.imd.gov.in/citywx/city_weather_test.php?id=100300')).text()
    // fs.writeFile(
    //     __dirname + '/../../data/weather-short.html', 
    //     data,
    //     () => {}
    // )
    const html :string = fs.readFileSync(
        __dirname + '/../../data/weather-short.html', 
        'utf8', 
        )
    return scrapePresentWeatherDataHtml(html, station)
}

export async function scrapeWeatherData(
    station : Station, 
    parseForecasts: boolean = true,
    parseHistoric: boolean = true) 
: Promise<PageWeatherData> | null {
    // const html :string = await getPageHtml(getStationPageURL(station))
    // const data = await (await fetch('https://city.imd.gov.in/citywx/city_weather_test.php?id=100300')).text()
    // fs.writeFile(
    //     __dirname + '/../../data/weather-short.html', 
    //     data,
    //     () => {}
    // )
    const html :string = fs.readFileSync(
        __dirname + '/../../data/weather-short.html', 
        'utf8', 
        )
    
    let forecasts: ForcastWeatherData[]
    if (parseForecasts) {
        try {
            forecasts = scrapeForecastDataHtml(html, station)
        } catch (e) {
            logger.error(e)
        }
    }

    let historic: PresentWeatherData
    if (parseHistoric) {
        try {
            historic = scrapePresentWeatherDataHtml(html, station)
        } catch (e) {
            logger.error(e)
        }
    }

    return { 
        station,
        dailyForecasts: forecasts, 
        presentWeather: historic,
        hasForecastWeatherData: !!forecasts,
        hasPresentWeatherData: !!historic,
    }
}


