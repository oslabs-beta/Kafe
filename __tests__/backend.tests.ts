const request = require('supertest');
import { admin } from '../src/server/kafkaAdmin/admin';

import apolloServer from '../src/server/server';
import PrometheusAPI from '../src/server/graphQL/dataSources/prometheusAPI';

const server = "http://localhost:3000/"

beforeAll(async () => {
    global.apolloServer = await apolloServer;
    global.kafkaAdmin = await admin;
});

afterAll(async () => {
    await global.apolloServer.stop();
    await global.kafkaAdmin.disconnect();
});

//Testing for bad endpoints 
describe('Bad endpoints', () => {
    it('Should send 404 status with POST request', () => {
        return request(server).post('/api/post').expect(404);
    });
    
    it('Should send 404 status with PUT request', () => {
      return request(server).post('/api/put').expect(404);
    });

    it('Should send 404 status with DELETE request', () => {
        return request(server).post('/api/delete').expect(404);
    });
  
});

//Testing graphQL queries
describe('graphQL queries', () => {
  describe('Cluster Query', ()=> {
    it('Cluster query should return all nested data including broker info, activeController and so on', async() => {
      const result = await global.apolloServer.executeOperation({
        query: `query Cluster {
          cluster {
            brokers {
              id
              port
              host
          }
          brokerCount
          }           
        }`
      },
      {
        contextValue: {
            dataSources: {
                prometheusAPI: new PrometheusAPI(),
            }
        }
      });
      
      expect(Array.isArray(result.body.singleResult.data.cluster.brokers)).toBeTruthy();
      expect(typeof result.body.singleResult.data.cluster.brokerCount).toBe("number");
    });

    it('Should be able to query cluster metrics from Prometheus', async () => {
        const result = await global.apolloServer.executeOperation({
          query: `query Cluster {
            cluster {
              activeControllersCount
              underreplicatedPartitionsCount
              offlinePartitionsCount
              underMinISRCount
            }
          }`
        },
        {
            contextValue: {
                dataSources: {
                    prometheusAPI: new PrometheusAPI(),
                }
            }
        })
        console.log('result:', result.body.singleResult);
        expect(result.body.singleResult.data.cluster.activeControllersCount).toBeGreaterThanOrEqual(0);
        expect(result.body.singleResult.data.cluster.underreplicatedPartitionsCount).toBeGreaterThanOrEqual(0);
        expect(result.body.singleResult.data.cluster.offlinePartitionsCount).toBeGreaterThanOrEqual(0);
        expect(result.body.singleResult.data.cluster.underMinISRCount).toBeGreaterThanOrEqual(0);
    });
  });
});