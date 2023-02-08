<div align="center">
  <a href="https://https://github.com/oslabs-beta/kafe/">
    <img src="./src/client/assets/Logo2.png" alt="Logo" height="100px" width="200px"/> 
  </a><br><br>

  <p>An open-source Kafka visualizer with Dead Letter Queue support for failed messages. Built for JavaScript developers!<p>
  <a href="https://https://github.com/oslabs-beta/kafe/"><img src="https://img.shields.io/badge/license-MIT-blue"/></a>
  <a href="https://github.com/oslabs-beta/kafe/stargazers"><img alt="GitHub stars" src="https://img.shields.io/github/stars/oslabs-beta/kafe"></a>
  <a href="https://github.com/oslabs-beta/kafe/issues"><img alt="GitHub issues" src="https://img.shields.io/github/issues/oslabs-beta/kafe"></a>
  <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/oslabs-beta/kafe">
  
  <a href="https://google.com"><strong>Google.com</strong></a>
</div>

## Table of Contents

1. [About the Project](#about-the-project)
   - [Built With](#built-with)
1. [Getting Started](#getting-started)
   - [Requirements](#requirements)
   - [Installation](#installation)
   - [When you're ready to use Kafe](#when-youre-ready-to-use-franzview)
1. [Contributors](#contributors)
1. [Roadmap](#roadmap)
1. [Prometheus Server and Demo Cluster](#prometheus-server-and-demo-cluster)
1. [License](#license)

## About the Project

Kafe is an open-source application to help independent developers to monitor and to manage their Apache Kafka clusters, while offering debugging and failed messages support. With Kafe you can monitor key metrics to your cluster, brokers, and topic performance and take actions accordingly. Through the UI you are able to:

1. Monitor key performance metrics in cluster and brokers with real time charts, and insights of your cluster with info cards.
2. Diagnose and debug your topics with Dead Letter Queue failed messages table and analytic charts.
2. Create and delete topics within a cluster.
3. Reassign partition replicas to support with load balancing and solve for underreplication issues.

### Built With

- [KafkaJS](https://kafka.js.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Apollo GraphQL](https://www.apollographql.com/)
- [Prometheus](https://prometheus.io/)
- [React](https://reactjs.org/)
- [Chart.js](https://www.chartjs.org/docs/latest/)
- [D3js] (https://d3js.org/)
- [Material-UI](https://mui.com/)
- [Jest](https://jestjs.io/)

## Getting Started

### Requirements

Do the following to get set up with Kafe:

- Have node installed. Kafe is built to work on Node 14+.
- If you want to use our pre-configured Kafka cluster, have Docker Desktop and Docker Compose installed and follow the [demo instructions](#prometheus-server-and-pre-configured-cluster).
- Download [JMX exporter] (https://github.com/prometheus/jmx_exporter) and add it to your Kafka cluster configurations. You can find the configuration files and a copy of the JMX exporter jar file in the `configs/jmx_exp` folder in this repo. Use the earlier version (jmx_prometheus_javaagent-0.16.1)
  1. If you're starting your Kafka cluster from the CLI you can set up JMX exporter following these commands:
  ```
  export KAFKA_OPTS='-javaagent:{PATH_TO_JMX_EXPORTER}/jmx-exporter.jar={PORT}:{PATH_TO_JMX_EXPORTER_KAFKA.yml}/kafka.yml'
  ```
  2. Launch and start your brokers as you normally would.
- Be sure to have a Prometheus metrics server running with the proper targets exposed on your brokers. You can find an example of the Prometheus settings we use for our demo cluster in `configs/prometheus/prometheus.yml`

Refer to the docker-compose files on how to use Docker to launch a pre-configured cluster with proper exposure to Prometheus.

### Installation

1. Clone down this repository:

```
git clone https://github.com/oslabs-beta/Kafe.git
```

2. Create a `.env` file using the template in the `.env.template` file to set the environment variables.
3. In the Kafe root directory to install all dependencies:

```
npm install
```

4. Build your version of Kafe:

```
npm run build
```

## Contributors

- Oliver Zhang| [GitHub](https://github.com/zezang) | [Linkedin](https://www.linkedin.com/in/oliver-zhang91/)
- Yirou Chen | [GitHub](https://github.com/WarmDarkMatter) | [Linkedin](https://www.linkedin.com/in/yirouchen/)
- Jacob Cole| [GitHub](https://github.com/jacobcole34) | [Linkedin](https://www.linkedin.com/in/jacobcole34/)
- Caro Gomez | [GitHub](https://github.com/Caro-Gomez) | [Linkedin](https://www.linkedin.com/in/carolina-llano-g%C3%B3mez/)
- Kpange Kaitibi | [GitHub](https://github.com/KpangeKaitibi) | [Linkedin](https://www.linkedin.com/in/kpange-kaitibi-522b31102/)

## Roadmap

Franzview is in early stages, but we wanted to get it in the hands of developers as soon as possible to be able to start incorporating user feedback immediately. Here are features we're working on bringing to FranzView in the near future:

- Additional filtering options for topics and to filter data by time
- The option to auto-deploy a Prometheus server if one isn't passed in
- Additional authentication support for Kafka Clusters
- Log exploration to support with troubleshooting
- Consumer metrics to monitor consumer performance and make improvements
- Frontend querying tools so you can query data that is important to your team

If you don't see a feature that you're looking for listed above, find any bugs, or have any other suggestions, please feel free to [open an issue](https://github.com/oslabs-beta/franz/issues) and our team will work with you to get it implemented!

Also if you create a custom implementation of FranzView we'd love to see how you're using it!