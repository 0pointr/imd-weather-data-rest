import { Station } from "../scraper/StationScraper"
import fs from 'fs'
import config from "../../config"
import InvalidParameterError from "../../exceptions/InvalidParameterError"
import logger from "../../logger"

let stations: Station[] = []
export function getAllStations() : Station[] {
    if (stations.length === 0) {
        stations = JSON.parse(
            fs.readFileSync(config.stationsFileUri, 'utf8')
        ) as Station[]
    }
    return stations
}

export function validateStationCode(stationCode: string) : boolean {
    return getAllStations().filter(station => station.code === stationCode).length > 0
}

export function getStationByCode(stationCode: string) : Station {
    if (validateStationCode(stationCode)) {
        return getAllStations().find(station => station.code === stationCode)
    } else {
        throw new InvalidParameterError('Invalid station code')
    }
}