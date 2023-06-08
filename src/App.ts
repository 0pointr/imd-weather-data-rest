import { parseAllStations as scrapeStationInfo } from "./service/scraper/StationScraper"
import logger from "./logger"
import fs from 'fs'
import * as pd from 'pretty-data'
import { fetchWeatherData } from "./service/weather/IMDWeatherService";
import Express from "express";
import { getStationWeatherController } from "./controllers/GetWeather";
import { handleErrors as errorHandler } from "./controllers/ErrorHandler";
import config from "./config";
import { getStationsController } from "./controllers/GetStations";
import { handle404 } from "./controllers/404Handler";

const dataFileName = 'stations.json';
const fileURI = __dirname + '/data/' + dataFileName;

async function initStations() {
    if (!fs.existsSync(fileURI)) {
        try {
            const stations = await scrapeStationInfo()
            fs.writeFile(
                fileURI,
                pd.pd.json(JSON.stringify(stations)),
                (err) => { 
                    if (err) {
                        logger.error(err)
                    } else {
                        logger.info('stations data has been written to file')
                    }
                }
            )
        } catch(e) {
            logger.error(e)
        }
    }
}

async function init() {
    await initStations()
}

(async () => {
    await init()
    // console.log(await scrapeWeatherData({state:'WB',area:'Kolkata',code:'100230'}));
    // console.log(await fetchWeatherData({state:'WB',area:'Kolkata',code:'100230'}))
})()

const app = Express()

app.route('/stations')
    .get(getStationsController)
app.route('/weather/:stationCode')
    .get(getStationWeatherController)
app.all('*', handle404)

app.use(errorHandler)
app.listen(config.port, () => {
    {
        logger.info('Server running on ' + config.port)
    }
})