import { Request, Response, NextFunction } from "express";
import logger from "../logger";
import { getAllStations } from "../service/station/StationsService";

export async function getStationsController(req: Request, res: Response, next: NextFunction) {
    try {
        res.status(200).json(getAllStations())
    } catch (e) {
        next(e)
    }
}