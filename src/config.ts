import { Config } from "./types/config/types"

const configs = {
    common: {
        stationMenuUrl: 'https://city.imd.gov.in/citywx/menu_test.php',
        stationWeatherUrlTemplate: 'https://city.imd.gov.in/citywx/city_weather_test.php?id=${code}',
        uri: 'https://city.imd.gov.in/citywx/localwx.php',
    },
    dev: {
        stationsFileUri: __dirname + "/../data/stations.json",
        port: 5859
    },
    prod: {
        stationsFileUri: __dirname + "/../data/stations.json",
        port: 5859
    }
}

let config: Config
if (process.env.NODE_ENV === 'PROD') {
    config = {
        ...configs.common,
        ...configs.prod
    }
} else {
    config = {
        ...configs.common,
        ...configs.dev
    }
}

export default config

