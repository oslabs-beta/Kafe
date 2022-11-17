import express from 'express';
import path from 'path';
import { ApolloServer } from '@apollo/server';
import { typeDefs } from './graphQL/typeDefs';
import resolvers from './graphQL/resolvers';
import { expressMiddleware } from '@apollo/server/express4';
import http from 'http';
import cors from 'cors';
import PrometheusAPI from './graphQL/dataSources/prometheusAPI';



const PORT: number | string = process.env.PORT || 3000;

const app: express.Express = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', express.static(path.resolve(__dirname, '../../build')));

const ApolloServerStart = async() => {
    const httpServer = http.createServer(app);
    //create apolo server by passing in schema and resolver
    const server = new ApolloServer({ typeDefs, resolvers });
    await server.start();

    app.use(
        '/',
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
    )

    await new Promise<void>((resolve => httpServer.listen({ port: process.env.PORT || 3000}, resolve)));
    return server;
}

ApolloServerStart();




