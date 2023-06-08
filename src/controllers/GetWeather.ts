import { Request, Response, NextFunction } from "express";
import logger from "../logger";
import { getStationByCode } from "../service/station/StationsService";
import { fetchWeatherData } from "../service/weather/IMDWeatherService";

export async function getStationWeatherController(req: Request, res: Response, next: NextFunction) {
    const stationCode = req.params.stationCode?.trim()
    
    try {
        res.status(200).json(await fetchWeatherData(getStationByCode(stationCode)))
    } catch (e) {
        next(e)
    }
}