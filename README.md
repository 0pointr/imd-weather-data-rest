
# imd-weather-data-rest

This package provides a simple REST-ish interface for grabbing weather data
published by IMD. IMD itself publishes no publicly accessible API which is
sad for a public meteorological department at current times.

This package attempts to scrape data from IMD's website and serve it in a tidy
format, but this also means it is at the mercy of IMD not changing its website's
markup.


## API Endpoints
#1 Get all IMD weather station codes

    GET: /stations
    returns:
    [
        {
    	    'state': string,
    	    'area': string,
    	    'code': string
        }
    ]

#2 Get present and forecasted weather for a station:

    GET: /weather/:stationCode
    returns:
    {
	    station:  {
    	    'state': string,
    	    'area': string,
    	    'code': string
        };
	    hasForecastWeatherData:  boolean,
	    hasPresentWeatherData:  boolean,
	    dailyForecasts?:  [{
		    date: string,
		    minTemp: number,
		    maxTemp: number,
		    sky: string
		}],
	    presentWeather?:  {
		    date: string,
		    isReportedDate: boolean,
		    maxTemp: number,
		    minTemp: number,
		    rainfall?: number,
		    relativeHumidity?: number,
		    sunrise?: string,
		    sunset?: string,
		    moonrise?: string,
		    moonset?: string,
		    },	    
	    units: {
		    temperature: string,
		    humidity: string,
		    rainfall: string
	    }
    }
    
## Example

    GET: /weather/42182

      {
	    "station": {
		    "state": "Delhi",
		    "area": "New Delhi-safdarjung",
		    "code": "42182"
	    },
	    "hasForecastWeatherData": true,
	    "hasPresentWeatherData": true,
	    "dailyForecasts": [
		    {
			    "date": "2023-06-08",
			    "minTemp": 24,
			    "maxTemp": 40,
			    "sky": "Mainly Clear sky"
		    },
		    {
			    "date": "2023-06-09",
			    "minTemp": 24,
			    "maxTemp": 41,
			    "sky": "Generally cloudy sky with Light Rain or Drizzle"
		    },
		    {
			    "date": "2023-06-10",
			    "minTemp": 26,
			    "maxTemp": 41,
			    "sky": "Strong surface winds during day time"
		    },
		    {
			    "date": "2023-06-11",
			    "minTemp": 27,
			    "maxTemp": 42,
			    "sky": "Strong surface winds during day time"
		    },
		    {
			    "date": "2023-06-12",
			    "minTemp": 28,
			    "maxTemp": 42,
			    "sky": "Strong surface winds during day time"
		    },
		    {
			    "date": "2023-06-13",
			    "minTemp": 28,
			    "maxTemp": 41,
			    "sky": "Strong surface winds during day time"
		    },
		    {
			    "date": "2023-06-14",
			    "minTemp": 29,
			    "maxTemp": 41,
			    "sky": "Strong surface winds during day time"
		    }
	    ],
	    "units": {
		    "temperature": "celcius",
		    "humidity": "percent",
		    "rainfall": "mm"
	    },
	    "presentWeather": {
		    "date": "2023-06-08",
		    "isReportedDate": true,
		    "maxTemp": 39.9,
		    "minTemp": 23.9,
		    "rainfall": null,
		    "relativeHumidity": 35,
		    "sunset": "19:18",
		    "sunrise": "05:23",
		    "moonset": "10:36",
		    "moonrise": "23:36"
	    }
    }
