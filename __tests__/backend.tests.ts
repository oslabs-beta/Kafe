const request = require('supertest');
import { admin } from '../src/server/kafkaAdmin/admin';
// jest.useFakeTimers();
import apolloServer from '../src/server/server';
import PrometheusAPI from '../src/server/graphQL/dataSources/prometheusAPI';
import { faker } from '@faker-js/faker';

const server = 'http://localhost:3000/';


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

  //Cluster queries
  xdescribe('Cluster Query', ()=> {
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

        expect(result.body.singleResult.data.cluster.activeControllersCount).toBeGreaterThanOrEqual(0);
        expect(result.body.singleResult.data.cluster.underreplicatedPartitionsCount).toBeGreaterThanOrEqual(0);
        expect(result.body.singleResult.data.cluster.offlinePartitionsCount).toBeGreaterThanOrEqual(0);
        expect(result.body.singleResult.data.cluster.underMinISRCount).toBeGreaterThanOrEqual(0);
    });
  });

  //Broker queries
  xdescribe('Broker queries', ()=> {

    //Kafka admin query
    it('Should be able to query basic information of all active brokers with kafkaAdmin', async () => {
      const result = await global.apolloServer.executeOperation({
        query: `query Brokers {
          brokers {
            id
            host
            port
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

      expect(result.body.singleResult.data.brokers).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            host: expect.any(String),
            port: expect.any(Number),
          })
        ])
      );
    });

    //Single DataPoint queries
    it('Should return a single DataPoint for fetch TimeMs broker queries',  async () => {
      const result = await global.apolloServer.executeOperation({
        query: `query Brokers {
          brokers{
            id
            produceTotalTimeMs {
              time
              value
            }
            fetchConsumerTotalTimeMs {
              time
              value
            }
            fetchFollowerTotalTimeMs {
              time
              value
            }
          }
        }`
      },
      {
        contextValue: {
          dataSources: {
            prometheusAPI: new PrometheusAPI(),
          },
        },
      });

      expect(result.body.singleResult.data.brokers).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            produceTotalTimeMs: expect.objectContaining({
              time: expect.any(String),
              value: expect.any(Number),
            }),
            fetchConsumerTotalTimeMs: expect.objectContaining({
              time: expect.any(String),
              value: expect.any(Number),
            }),
            fetchFollowerTotalTimeMs: expect.objectContaining({
              time: expect.any(String),
              value: expect.any(Number),
            }),
          })
        ])
      )
    });

    //DataPoint array broker queries
    it('Should be able to acquire time series metrics for all brokers', async () => {
      const result = await global.apolloServer.executeOperation({
        query: `query Brokers {
          brokers {
            id
            underreplicatedPartitionsCount
            CPUUsageOverTime {
              time
              value
            }
            JVMMemoryUsedOverTime {
              time
              value
            }
          }
        }`
      },
      {
        contextValue: {
          dataSources: {
            prometheusAPI: new PrometheusAPI(),
          },
        },
      });

      // console.log('Brokers metrics result: ', result.body.singleResult)
      expect(result.body.singleResult.data.brokers).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            underreplicatedPartitionsCount: expect.any(Number),
            CPUUsageOverTime: expect.arrayContaining([
              expect.objectContaining({
                time: expect.any(String),
                value: expect.any(Number),
              })
            ]),
            JVMMemoryUsedOverTime: expect.arrayContaining([
              expect.objectContaining({
                time: expect.any(String),
                value: expect.any(Number),
              })
            ]),
          })
        ])
      );
    });

    //Data series queries
    it('Should be able to acquire data series metrics for all brokers', async () => {
      const result = await global.apolloServer.executeOperation({
        query: `query Brokers {
          brokers {
            id
            bytesInPerSecOverTime {
              topic
              values {
                time
                value
              }
            }
            bytesOutPerSecOverTime {
              topic
              values {
                time
                value
              }
            }
          }
        }`
      },
      {
        contextValue: {
          dataSources: {
            prometheusAPI: new PrometheusAPI(),
          },
        },
      });

      expect(result.body.singleResult.data.brokers).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            bytesInPerSecOverTime: expect.arrayContaining([
              expect.objectContaining({
                topic: expect.any(String),
                values: expect.arrayContaining([
                  expect.objectContaining({
                    time: expect.any(String),
                    value: expect.any(Number),
                  })
                ]),
              })
            ]),
            bytesOutPerSecOverTime: expect.arrayContaining([
              expect.objectContaining({
                topic: expect.any(String),
                values: expect.arrayContaining([
                  expect.objectContaining({
                    time: expect.any(String),
                    value: expect.any(Number),
                  })
                ]),
              })
            ]),
          })
        ])
      );
    });

  });

  //Topics query
  xdescribe('Topics query', () => {
    it('Should be able to gather basic topic information using kafkaAdmin', async () => {
      const result = await global.apolloServer.executeOperation({
        query: `query Topics {
          topics {
            name
            partitions {
              partitionId
            }
            partitionsCount
            offsets {
              offset
              low
              high
            }
          }
        }`
      },
      {
        contextValue: {
          dataSources: {
            prometheusAPI: new PrometheusAPI(),
          },
        },
      });

      // console.log(typeof result.body.singleResult.data.topics)
      expect(result.body.singleResult.data.topics).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: expect.any(String),
            partitions: expect.arrayContaining([
              expect.objectContaining({
                partitionId: expect.any(Number),
              })
            ]),
            partitionsCount: expect.any(Number),
            offsets: expect.arrayContaining([
              expect.objectContaining({
                offset: expect.any(String),
                low: expect.any(String),
                high: expect.any(String),
              })
            ]),
          })
        ])
      );
    });

  });

  //Mutations
  describe('Mutation queries', () => {
    //Topic mutations
    xdescribe('Topic mutations', () => {
      it('Should add a topic if it does not exist', async () => {
        const nonExistentResult = await global.apolloServer.executeOperation({
          query: `query getTopic ($name: String!) {
            topic (name: $name){
              name
            }
          }`,
          variables: { name: 'ToBeCreated7'}
        });
        expect(nonExistentResult.body.singleResult.data.topic).toBeNull();

        const result = await global.apolloServer.executeOperation({
          query: `mutation CreateTopic ($name: String!) {
            createTopic(name: $name){
              name
            }
          }`, variables: { name: 'ToBeCreated7' }
        });
        // console.log('createTopic result', result.body.singleResult.data)
        expect(result.body.singleResult.data.createTopic).toBeTruthy();
      });

      it('deleteTopic mutation should delete a topic and return the topic that was deleted', async()=> {

        //need to set server config to enable topic deletion
        const result = await global.apolloServer.executeOperation({
          query:`mutation deleteTopic ($name: String!) {
            deleteTopic(name: $name){
              name
            }
          }`, variables: {name: 'ToBeCreated7'}
        });
        // console.log('deleteTopic result', result.body.singleResult.data);
        expect(result.body.singleResult.data.deleteTopic).toBeTruthy();

        const deletedTopic = await global.apolloServer.executeOperation({
          query: `query getTopic ($name: String!) {
            topic (name: $name){
              name
            }
          }`,
          variables: { name: 'ToBeCreated7'}
        });

        expect(deletedTopic.body.singleResult.data.topic).toBeNull();
      });

    });

    jest.setTimeout(10000);
    describe('Partitions mutations', () => {
      
      let testTopic;
      //Create test topic to reassign partitions for
      beforeAll(async() => {

        testTopic = faker.random.alphaNumeric(10);

        try {
          const topics = await global.kafkaAdmin.listTopics();

          const newTopic = await global.kafkaAdmin.createTopics({
            topics: [{
              topic: testTopic,
              replicaAssignment: [{ partition: 0, replicas: [1, 0]}]
            }],
            waitForLeaders: true,
          });

          
          console.log('All topics before creation ', topics);
          return;
        } catch(err) {
          console.log('Partition reassignment error creating topic: ', err);
        };
        
      });

      
      afterAll(async() => {
        jest.setTimeout(10000);
        return await global.kafkaAdmin.deleteTopics({
          topics: [testTopic],
        });
      });

      it('Should reassign partitions', async () => {
        const result = await global.apolloServer.executeOperation({
          query: `mutation ReassignPartitions($topics: [PartitionReassignment]) {
            reassignPartitions (topics: $topics) {
              name
              partitions {
                partition
                replicas
                addingReplicas
                removingReplicas
              }
            }
          }`,
          variables: {
            topics: [
              {
                topic: testTopic,
                partitionAssignment: [{ partition: 0, replicas: [2, 3]}],
              },
            ],
          },
        });

        // console.log(result.body.singleResult.data.reassignPartitions);
        expect(result.body.singleResult.data.reassignPartitions.filter((topic) => 
          topic.name === testTopic
        )).toEqual([{
          name: testTopic,
          partitions: [
            {
              partition: 0,
              replicas: [2, 3, 1, 0],
              addingReplicas: [2, 3],
              removingReplicas: [1, 0],
            },
          ],
        }]);
      });

    });


  });

});