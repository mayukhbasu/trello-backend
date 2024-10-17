import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: 'https://user-service-104926798924.us-central1.run.app', // Replace with your API Gateway URL
  cache: new InMemoryCache(),
});

export default client;
