export class OwmResponseHelper {

    get response(): any {
        return this._response;
    }

    constructor(private _response: any) { }
}

export enum OwmResponseType {
    FORECAST
}


export interface OwmResponse {
    cod: number
}

export interface OwmForecastResponse extends OwmResponse {
    
    message: number,
    cnt: number,
    list: HourlyForecast[],
    city: {
        id: number,
        name: string,
        coord: {
            lat: number,
            lon: number
        },
        country: string,
        timezone: string,
        sunrise: string,
        sunset: string
    }
}


export interface HourlyForecast {
    dt: number,
    main: {
        temp: number,
        feels_like: number,
        temp_min: number,
        temp_max: number,
        pressure: number,
        sea_level: number,
        grnd_level: number,
        humidity: number,
        temp_kf: number
    },
    weather: [
        {
            id: 500,
            main: string,
            description: string,
            icon: string
        }
    ],
    clouds: {
        all: number
    },
    wind: {
        speed: number,
        deg: number
    },
    visibility: number,
    pop: number,
    rain: {
        '3h': number
    },
    sys: {
        pod: string
    },
    dt_txt: string
}
