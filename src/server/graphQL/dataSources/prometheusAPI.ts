import { RESTDataSource } from '@apollo/datasource-rest';
import 'dotenv/config';

class PrometheusAPI extends RESTDataSource {
    brokerIdtoInstance: any;
    brokerInstancetoId: any;

    constructor(apiUrl: string = process.env.PROM_URL) {
        super();
        this.baseURL = apiUrl;
        this.brokerIdtoInstance = {};
        this.brokerInstancetoId = {};
    };

    mapped(): Boolean {
        return Object.keys(this.brokerIdtoInstance).length > 0;
    };

    getUnixTimeStamp(date): GLfloat {
        console.log('getUnixTimestamp: ', date);

        const dateTime = parseFloat((new Date(date).getTime() / 1000).toFixed(3));
        return dateTime;
    };

    async generateMaps(): Promise<void> {
        const brokerData = await this.get(`/api/v1/query?query={brokerid!=''}`);

        brokerData.data.result.forEach(broker => {
            this.brokerIdtoInstance[broker.metric.brokerid] = broker.metric.instance;
            this.brokerInstancetoId[broker.metric.instance] = broker.metric.brokerid;
        });
    };
    
    async instanceQuery(baseQuery, filter: number[]) {
        let query = `query=${baseQuery.query}`;
        if (filter && filter.length) {
            const filterInstances = await this.mapInstanceFilter(filter);
            query = query.replace(/filter/g, filterInstances);
        }
        else query = query.replace(/filter/g, '.*');
        
        try {
            const result = await this.get(`/api/v1/${query}`);
            const formattedResult = await this.formatResponse(result.data.result)
            return formattedResult;
        } catch (err) {
            console.log(`Error occurred with query: ${query}: ${err}`);
        }
    };

    async instanceRangeQuery(baseQuery, start: string, end: string, step: string, filter) {
        let query = `query=${baseQuery.query}`;

        //format start, end to be valid timestamp
        const startTime = this.getUnixTimeStamp(start);
        const endTime = this.getUnixTimeStamp(end);

        if (!startTime || !endTime || isNaN(startTime) || isNaN(endTime)) throw "Incorrect date inputs";

        if (filter && filter.length) {
            const filterInstances = await this.mapInstanceFilter(filter);
            query = query.replace(/filter/g, filterInstances);
        }
        else query.replace(/filter/g, '.*');

        query += `&start=${startTime}&end=${endTime}&step=${step}`;

        console.log('Range query: ', query);
        const result = await this.get(`/api/v1/query_range?${query}`);
        
        const formattedResult = await this.formatRangeResponse(result.data.result);
        console.log('Final result: ', formattedResult);
        return formattedResult;
    };

    async totalMsQuery(baseQuery, requestType, filter) {
        let query = `query=${baseQuery.query}`;
        let queryFilters;

        if (filter && filter.length) queryFilters = `{request=~${requestType}, quantile=~"0.50", instance=~${filter}}`
        else queryFilters = `{request=~${requestType}, quantile=~"0.50"}`;

        query += queryFilters;

        console.log('TotalMsQuery query: ', query);
        const result = await this.get(`/api/v1/query?${query}`);
        const formattedResult = await this.formatResponse(result.data.result);

        return formattedResult;
    };

    async topicQuery(baseQuery, filter) {
        let query = `query=${baseQuery.query}`;
        
        if (filter) query = query.replace(/filter/g, filter);
        else query = query.replace(/filter/g, '.*');

        try {
            const result = await this.get(`/api/v1/query`);

            const formattedResult = await this.formatResponse(result.data.result);
            return formattedResult;
        } catch (err) {
            console.log(`Error occurred with query: ${query}: ${err}`);
        }
    };

    async mapInstanceFilter(brokerIds: number[]): Promise<string> {
        if (this.mapped() === false) await this.generateMaps();

        let filterString = '';
        for (const id of brokerIds) {
            filterString += `${this.brokerIdtoInstance[id]}|`;
        };

        return filterString;
    };
    
    //format unix date to be timestamp, format value into number/float
    async formatResponse(result: any[]) {
        const formattedResult = [];
        result.forEach(item => {
            let newItem = {
                time: new Date(item.value[0] * 1000).toLocaleTimeString(),
                value: parseFloat(item.value[1]).toFixed(2)
            }
            if(item.metric.instance) newItem['id'] = this.brokerInstancetoId[item.metric.instance];
            if(item.metric.topic) newItem['topic'] = item.metric.topic;
            formattedResult.push(newItem);
        })
        return formattedResult;
    };

    async formatRangeResponse(result: any[]) {
        console.log('Format range response input: ', result)
        const formattedResult = [];

        result.forEach(object => {
            const datum = {
                values: [],
            };

            object.values.forEach(value => {
                datum.values.push({
                    time: new Date(value[0] * 1000).toLocaleString("en-US"),
                    value: Number(value[1]).toFixed(2)
                })
            });

            if (object.metric.instance) {
                datum['instance'] = object.metric.instance;
                datum['id'] = Number(this.brokerInstancetoId[object.metric.instance]);
            };
            if (object.metric.topic) datum['topic'] = object.metric.topic;

            formattedResult.push(datum);
        });
        return formattedResult;
    };
};

export default PrometheusAPI;