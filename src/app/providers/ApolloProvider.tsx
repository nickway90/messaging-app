import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  split,
  ApolloProvider
} from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { WebSocketLink } from "@apollo/client/link/ws";

type ApolloProviderType = {
  children: React.ReactNode
};

const httpLink = new HttpLink({
  uri: "https://optimal-cub-76.hasura.app/v1/graphql",
  headers: {
    "x-hasura-admin-secret":
      "",
  },
});

const wsLink = new WebSocketLink({
  uri: "wss://optimal-cub-76.hasura.app/v1/graphql",
  options: {
    reconnect: true,
    connectionParams: {
      headers: {
        "x-hasura-admin-secret":
          "",
      },
    },
  },
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);
const client = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
  });

const Provider = ({children}: ApolloProviderType) => {
  return (
      <ApolloProvider client={client}>{children}</ApolloProvider>
  );
};

export default Provider;
