import { Station } from "./StationScraper";
import { getDateFromString, getPageHtml, getStationPageURL } from "../utils";
import cheerio from "cheerio";
import WeatherDataNotFoundError from "../../exceptions/WeatherDataNotFoundError";
import fs from 'fs'
import logger from "../../logger";
import { PageForcastWeatherData, PageWeatherData, PagePresentWeatherData, 
         RainfallUnit, RelativeHumidityUnit, TemperatureUnit } from "../../types/scraper/types";

const forecastTbodySelectorExtendedPage = 'table:nth-child(4) > tbody > tr:nth-child(2) > td > table > tbody' // > tr:nth-child(3)'
const forecastTbodySelector = 'table table' //'table > tbody > tr > td:nth-child(2) > table > tbody' // > tr:nth-child(3)'

function scrapeForecastDataHtml(html: string, station : Station): PageForcastWeatherData[] {
    const $ = cheerio.load(html)

    let tableBody = $(forecastTbodySelectorExtendedPage)
    if (tableBody.length === 0) {
        tableBody = $(forecastTbodySelector)
    }

    if (tableBody.length === 0) {
        throw new WeatherDataNotFoundError(`Forecast table not found for station: ${JSON.stringify(station)}`)
    }

    const dayWeatherForcast : PageForcastWeatherData[] = []
    const imageIndex = 3
    const dataIndex = { 0:'date', 1:'minTemp', 2:'maxTemp', 3:'image', 4:'sky'}
    tableBody.find('tr:nth-child(n+3)').each((rowIndex, row) => {
        try {
            let date : Date, 
                minTemp : string,
                maxTemp : string, 
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
                            minTemp = datum
                            break
                        case 'maxTemp':
                            maxTemp = datum
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

function assignValue(weatherData: PagePresentWeatherData, label: string, value: string) : void {
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

function scrapePresentWeatherDataHtml(html: string, station: Station) : PagePresentWeatherData {
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

    const weatherData : PagePresentWeatherData = <PagePresentWeatherData>{}
    weatherData.date = dataDate,
    weatherData.isReportedDate = useReportedDate
    
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

export async function scrapePresentWeatherData(station: Station) : Promise<PagePresentWeatherData> {
    const html :string = await getPageHtml(getStationPageURL(station))
    // fs.writeFile(
    //     __dirname + '/../../data/weather-short.html', 
    //     data,
    //     () => {}
    // )
    // const html :string = fs.readFileSync(
    //     __dirname + '/../../data/weather-short.html', 
    //     'utf8', 
    //     )
    return scrapePresentWeatherDataHtml(html, station)
}

export async function scrapeWeatherData(
    station : Station, 
    parseForecasts: boolean = true,
    parseHistoric: boolean = true) 
: Promise<PageWeatherData> | null {
    const html :string = await getPageHtml(getStationPageURL(station))
    // fs.writeFile(
    //     __dirname + '/../../data/weather-short.html', 
    //     data,
    //     () => {}
    // )
    // const html :string = fs.readFileSync(
    //     __dirname + '/../data/weather-full.html', 
    //     'utf8', 
    //     )
    
    let forecasts: PageForcastWeatherData[]
    if (parseForecasts) {
        try {
            forecasts = scrapeForecastDataHtml(html, station)
        } catch (e) {
            logger.error(e)
        }
    }

    let historic: PagePresentWeatherData
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
        units: {
            temperature: TemperatureUnit.celcius,
            humidity: RelativeHumidityUnit.percent,
            rainfall: RainfallUnit.mm
        }
    }
}


