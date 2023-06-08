import { Request, Response, NextFunction } from "express";
import ClientError from "../exceptions/ClientError";
import logger from "../logger";

export async function handleErrors(err: Error, req: Request, res: Response, next: NextFunction) {
    if (err instanceof ClientError) {
        res.status(400).json({msg: err.message})
    } else {
        res.status(500).json({msg: err.message})
    }
}