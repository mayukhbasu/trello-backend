import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: 'https://trello-backend-gateway-1c7apg7g.uc.gateway.dev/user', // Replace with your API Gateway URL
  cache: new InMemoryCache(),
});

export default client;
