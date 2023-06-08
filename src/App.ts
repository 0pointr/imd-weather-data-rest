import { parseAllStations as scrapeStationInfo } from "./service/scraper/StationScraper"
import logger from "./logger"
import fs from 'fs'
import * as pd from 'pretty-data'
import { getStationPageURL } from "./service/utils";
import { scrapeWeatherData } from "./service/scraper/StationWeatherDataScraper";

const dataFileName = 'stations.json';
const fileURI = __dirname + '/../data/' + dataFileName;

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

(async () => {
    await initStations()
    console.log(await scrapeWeatherData({state:'WB',area:'Kolkata',code:'100230'}));
})()