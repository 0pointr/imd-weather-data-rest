import logger from '../../logger'
import Cheerio from "cheerio"
import config from '../../config'
import ScrapingError from '../../exceptions/ScrapingError'
import { getPageHtml } from '../utils'

export type Station = {
    area: string,
    state: string,
    code: string,
}

export async function parseAllStations(): Promise<Station[]> {
    const html = await getPageHtml(config.stationMenuUrl)
    const $ = Cheerio.load(html)

    const stations: Station[] = []
    // console.log('html: ' + html)
    $('ul#sidebarmenu1 li').children('a[href=##]').each((idx, elem) => {
        const state = $(elem).text().trim()
        if (!state) {
            logger.error('Invalid state name: <empty>')
            return
        }
        $(elem).siblings('ul').find('a').each((idx, elem) => {
            const el = $(elem)
            try {
                const area = el.text().trim()
                const code = el.attr('href').split('=')[1].trim()
                stations.push({state, area, code})
            } catch (e) {
                throw new ScrapingError(`Error scraping station area / code for State:${state}`, e)
            }
        })
    })

    return stations
}
