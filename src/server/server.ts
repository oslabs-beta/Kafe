import express from 'express';
import path from 'path';
import http from 'http';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';

import PrometheusAPI from './graphQL/dataSources/prometheusAPI';
import { typeDefs } from './graphQL/typeDefs';
import resolvers from './graphQL/resolvers';
import { admin } from './kafkaAdmin/admin';

const PORT: number | string = process.env.PORT || 3000;

const app: express.Express = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', express.static(path.resolve(__dirname, '../../build')));

const ApolloServerStart = async() => {
    //create httpServer to handle requests to Express app
    const httpServer = http.createServer(app);

    //create apolo server by passing in schema and resolver
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
    });

    await server.start();

    app.use(
        '/gql',
        cors<cors.CorsRequest>(),
        expressMiddleware(server, {
            context: async () => {
                const { cache } = server;
                return {
                    dataSources: {
                        prometheusAPI: new PrometheusAPI()
                    }
                }
            }
        })

    );

    // app.get('/*', (req: express.Request, res: express.Response) => {
    //     res.status(200).sendFile(path.resolve(__dirname, '../client/index.html'));
    // });

    app.use('*', (req: express.Request, res: express.Response) => {
        res.status(404).send('Sorry, nothing found at this route...');
    });

    await new Promise<void>((resolve => httpServer.listen({port: PORT}, resolve)));
    console.log(`Server running at port: ${PORT}`);

    const info = await admin.describeCluster();
    const activeController = info.brokers.find(broker => broker.nodeId === info.controller)
    console.log('Server.ts Cluster Info:', activeController);
    return server;
}

export default ApolloServerStart();




//