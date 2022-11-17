
const resolvers = () => {
    Broker: {
        hello: (): String => 'hello'
    },
    Topic: {
        topic: (): String => 'topic1'
    }
};

export default resolvers;