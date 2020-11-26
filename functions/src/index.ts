import * as functions from 'firebase-functions';
import { info, error } from 'firebase-functions/lib/logger';
import { WebhookClient } from 'dialogflow-fulfillment';
import axios, { AxiosResponse } from 'axios';


process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
const config = functions.config();

export const dialogflowFirebaseFulfillment = functions.https
    .onRequest((request, response) => {
        const webhookClient = new WebhookClient({ request, response });
        info('Dialogflow Request headers: ' + JSON.stringify(request.headers));
        info('Dialogflow Request body: ' + JSON.stringify(request.body));

        function welcome(agent: WebhookClient) {
            agent.add(`Welcome to my agent!`);
        }

        function fallback(agent: WebhookClient) {
            agent.add(`I didn't understand`);
            agent.add(`I'm sorry, can you try again?`);
        }

        // // below to get this function to be run when a Dialogflow intent is matched
        function forecast(agent: WebhookClient) {

            info('Forecast Request body: ' + JSON.stringify(request.body));

            const city = request.body.queryResult.parameters.location.city;
            const dateRaw = request.body.queryResult.parameters['date-time'];

            const daterequested = request.body.queryResult.outputContexts[0].parameters['date-time.original'];

            info(`City: ${city}, Date:${dateRaw} ${JSON.stringify(dateRaw)}`);

            const date = (typeof dateRaw === 'string') ? new Date(dateRaw) : new Date(dateRaw.startDate);
            const today = new Date();
            today.setHours(12);
            today.setMinutes(0);
            today.setSeconds(0);
            today.setMilliseconds(0);
            const dayDiff = ((date.getTime() - today.getTime())) / (1000 * 3600 * 24);
            info(`Date diff ${dayDiff}`);
            if (dayDiff < 0) {
                agent.add(`Non posso fare previsioni per il passato :)`);
                return Promise.resolve(true);
            }

            if (dayDiff > 5) {
                agent.add(`Posso fare previsioni solo per i prossimi 5 giorni`);
                return Promise.resolve(true);
            }

            return axios.get('https://api.openweathermap.org/data/2.5/forecast', {
                params: {
                    q: request.body.queryResult.parameters.location.city,
                    cnt: Math.round((dayDiff + 1) * 8).toString(),
                    units: 'metric',
                    lang: 'it',
                    APPID: config.openweathermap.apikey
                }
            })
                .then((apiResponse: AxiosResponse<any>) => {
                    info(apiResponse.status);
                    info(apiResponse.data);

                    info(agent.parameters);

                    const list: HourlyForecast[] = apiResponse.data.list;

                    info(list.map((d) => d.dt).join(','));
                    const dateTime = date.getTime() / 1000;
                    let found = 0;
                    let diff = list[0].dt - dateTime;
                    for (const [i, fc] of list.entries()) {
                        const delta = Math.abs(fc.dt - dateTime);
                        if (delta < diff) {
                            diff = delta;
                            found = i;
                        }
                    }
                    info(`found ${found}`);
                    const day = list[found];
                    info(`day`, day);
                    if (day) {
                        const plural = day.weather[0].description.startsWith('nubi') ? 'saranno' : 'sarà';
                        const reply = `${daterequested} a ${city} ci ${plural} ${day.weather[0].description}. La temperatura massima sarà ${day.main.temp_max} °C, la minima ${day.main.temp} °C. La temperatura percepita sarà di ${day.main.feels_like} gradi.`;
                        agent.add(reply);

                    } else {
                        agent.add(`Mi dispiace, non ho trovato le previsioni per ${date.toLocaleString()} ${(date.getTime() / 1000)}`);
                    }
                    return true;
                })
                .catch((err) => {
                    error(err);
                    agent.add(`Mi dispiace, qualcosa è andato storto! ${err.message}`);
                    return true;
                });


        }

        // Run the proper function handler based on the matched Dialogflow intent name
        const intentMap = new Map();
        intentMap.set('Default Welcome Intent', welcome);
        intentMap.set('Default Fallback Intent', fallback);
        intentMap.set('Forecast Intent', forecast);
        // intentMap.set('your intent name here', googleAssistantHandler);
        return webhookClient.handleRequest(intentMap)
            .catch(err => {
                error(`Cannot set up hanlde request becouse of ${err.message}`);
                error(err);
            });
    });



interface HourlyForecast {
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
