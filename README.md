<h1 align="center">
  MOMENTVM UI
</h1>

Frontend gatsby app for MOMENTVM CMS.

## 🚀 Quick start

### 1. Environment

Create a `.env.development` file an put the following variables;

```
GATSBY_API_URL = http://localhost:5000
GATSBY_CABLE_URL = wss://localhost:5000/cable
```

### 2. Run in development mode

```sh
npm install
npm start
```

### 3. Run in production mode

```
npm build
npm run serve
```

Note: It's a good idea to run the build command before doing a commit, to check if the build still works.

## App Structure

### Pages

All the app's pages are in `src/pages`. When you create a new file here gatsby automatically creates a new page that is available at `/page-name`

### Components

All the components are in `src/components`. Components used for some specific feature or part of the app are further namespaced inside folders.

### Typescript

The application uses typescript, define types in the file you use them in. Or if they are reusable define them in `src/types`

## Using GraphQL

The way we do queries and mutations in the app is with Apollo Client using hooks.  
Its recomended to install the Apollo Client Devtools extension in your browser so you can see the graphql schema of the api as well as the requests the app is making to the api.

An example query:  
First define the query

```js
const GET_TEMPLATE = gql`
  query GetTemplate($id: ID!) {
    template(id: $id) {
      id
      name
      body
    }
  }
`;
```

Then make the hook

```js
useQuery(GET_TEMPLATE, {
    variables: { id: templateId },
    onCompleted: (data) => {
          // Put data.templates into the local state
      }
    },
  });
```

To see all the config option on useQuery check the apollo docs  
https://www.apollographql.com/docs/react/api/react/hooks/#usequery

Mutations work in a similar way. Define the query, create a hook, and add an event listener to fire the mutation.

```js
const [addTodo, { data }] = useMutation(ADD_TODO);
return <button onClick={() => addTodo()}>Add Todo</button>;
```
