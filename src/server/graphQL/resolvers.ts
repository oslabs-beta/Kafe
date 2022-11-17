
const resolvers = {
    Broker: {
        hello: (): String => 'hello'
    },
    Topic: {
        hello: (): String => 'topic1'
    }
};

export default resolvers;