import fetch from 'isomorphic-fetch';
import { ApolloClient, HttpLink, InMemoryCache, split, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import ActionCableLink from 'graphql-ruby-client/subscriptions/ActionCableLink';
import { navigate } from 'gatsby';
import { toast } from 'react-toastify';
import * as ActionCable from '@rails/actioncable';
import { getMainDefinition } from '@apollo/client/utilities';

// * Enable detailed console logging
ActionCable.logger.enabled = true;

// * Instead of apollo we use the subscription stuff provided by rails
const cable = ActionCable.createConsumer(
  `${process.env.GATSBY_CABLE_URL}/cable?token=${localStorage.getItem('apiToken')}`,
);
const actionCableLink = new ActionCableLink({ cable });

// * Setup the apollo http link for normal queries and mutations
const httpLink = new HttpLink({
  uri: `${process.env.GATSBY_API_URL}/graphql`,
  fetch, // according to documentation, this is required for SSR
});

// To add a error notification to toast
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path, extensions }) => {
      toast.error(message);
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      );
      if (extensions && extensions.code === 'AUTHENTICATION_ERROR') {
        localStorage.removeItem('apiToken');
        navigate('/login/');
      }
      return graphQLErrors;
    });
  if (networkError) {
    console.log(networkError.response);
  }
});

// The user is logged in via the session token, add that to headers
const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      apiToken: localStorage.getItem('apiToken'),
    },
  };
});

// const compositeLink = ApolloLink.from([errorLink, authLink.concat(httpLink)]);

// * We are splitting the link depending on if its a subscription or not
const authenticatedHttpLink = from([authLink, httpLink]);
// Redirect subscriptions to the action cable link, while using the HTTP link for other queries
const dualLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);

    return (
      definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
    );
  },
  actionCableLink,
  authenticatedHttpLink,
);

/// Tried ws link but didnt work with rails
// const wsLink = new GraphQLWsLink(
//   createClient({
//     url: `${process.env.GATSBY_CABLE_URL}/cable?token=${localStorage.getItem(
//       'apiToken',
//     )}`,
//     connectionParams: () => {
//       return {
//         Authorization: `Bearer`,
//         token: localStorage.getItem('apiToken'),
//         foo: 'hey there from node!',
//       };
//     },
//   }),
// );
// * Although Apollo Client can use your GraphQLWsLink to execute all operation types,
// * in most cases it should continue using HTTP for queries and mutations.
// * This is because queries and mutations don't require a stateful or long-lasting connection,
// * making HTTP more efficient and scalable if a WebSocket connection isn't already present.
// * To support this, the @apollo/client library provides a split function that lets you use one of two different Links,
// * according to the result of a boolean check.
// * The following example expands on the previous one by initializing both a GraphQLWsLink and an HttpLink.
// * It then uses the split function to combine those two Links into a single Link that uses one or the other according to the type of operation being executed.

// const splitLink = split(
//   ({ query }) => {
//     const definition = getMainDefinition(query);
//     return (
//       definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
//     );
//   },
//   wsLink,
//   compositeLink,
// );

//* Http link must be the last in the chain, see apollo documentation
export const client = new ApolloClient({
  link: from([errorLink, dualLink]),
  cache: new InMemoryCache(),
});

export default client;
