A simple, lightweight library inspired by [reselect](https://github.com/reduxjs/reselect) which allows you select data using async functions. This package will normally be used in conjunction with redux and reselect but it has no dependencies.

# Installation
```
npm install --save async-selector
```

# What it solves
Simply put, it solves the same problem normal selectors solve. It allows you to treat actions as the _implementation details_ of state. For example, if you were designing a search dropdown, the incorrect approach would be calculate the search results whenever a specific action is dispatched, say "TYPE_SEARCH_TEXT". This would be a brittle approach because if another developer adds a different action, say "CLEAR_TEXT" or "UNDO", the app will no longer function correctly. The search calculation should be done inside a selector whether it is done synchronously on the client or asynchronously on the server.

On that note, here are some concrete examples of problems async-selector solves:
- **Elegantly removes the boilerplate associated making an API call.** The reducers, actions, state variables, and middleware associated with getting the request status and results are replaced with a single selector.
- **Save/Reload will work without any added code.** You need to make sure no stale data coming from an API or request statuses are persisted or you risk buggy behavior. Treating this as derived data instantly solves this problem.
- **Undo/Redo will work without any added code.** Using selectors allow you to use derived state without knowing anything about the actions that effect it. This is critical for the scalability of more complex apps.
- **Helps guarantee stale data is never rendered.** A common bug occurs when a new request is made but the rendered data doesn't change until the response successfully returns.
- **Helps prevent unnecessary requests.** Since async selectors are memoized, duplicate requests won't be made.
- **Allows debouncing/throttling of expensive selectors.** This is extremely useful because the alternative is debouncing the actions themselves or making extra state variables which can result in extremely brittle, buggy code. A common use case would be calculations performed during zoom events.
- **Prevents over-rendering when a page loads.** In some complex apps, you make many queries when the page loads to construct the page. You can easily batch these re-render events which can improve performance on slower devices.
- **Avoids over-use of component lifecycle methods.** Ideally, React components are just functions of props and don't contain any logic other that needed for rendering the UI. Initializing data fetches onComponentDidMount is a brittle anti-pattern than can avoided with async selectors.
- **Allows seamless movement of code from the client to the server.** If, for example, you need to move an algorithm off the client because it is too computationally expensive, all you have to do is swap the reselect selector with an async selector. No far-reaching changes are necessary.

# Example Usage
Here is a basic usage example:

```js
import createAsyncSelector from 'async-selector'
import { store } from './index' // get store somehow

// searchText might be a value in some textfield
const getSearchText = state => state.searchText;

// Your real request code goes here. This is just for example.
const getEmployees = (searchText) => {
  return new Promise((resolve, reject) => {
    const database = ['Mark Metzger', 'Steve Miller'];
    setTimout(() => {
      if (searchText.length > 50) {
        reject('Search Text too long');
      } else {
        resolve(database.filter(name => searchText.includes(name)));
      }
    }, 1000)
  });
}

const params = {
  sync: (searchText) => [],
  async: getEmployees,
  onResolve: (employees, searchText) => console.log(employees),
  onReject: (error, searchText) => console.log(error),
  onCancel: (promise, searchText) => console.log(promise),
}

const employees = createAsyncSelector(params, [getSearchText]);
console.log(employees(store.getState()));

// {
//   value: [],
//   previous: undefined,
//   isWaiting: true,
//   isResolved: false,
//   isRejected: false,
// }
```
When you call the new selector there are three types of values it could return, depending on the status of the promise.

```js
// Request in progress
{
  value: [],
  previous: ['Steve Miller'], // This value is the just the result of the last promise resolution or undefined if it was never resolved
  isWaiting: true,
  isResolved: false,
  isRejected: false,
}

// Promise Resolved
{
  value: ['Mark'],
  previous: ['Mark'], // when resolved, previous always equals value
  isWaiting: false,
  isResolved: true,
  isRejected: false,
}

// Promise Rejected
{
  value: 'Search Text too long',
  previous: ['Steve Miller'],
  isWaiting: false,
  isResolved: false,
  isRejected: true,
}
```
### Example of real usage
An important thing missing in the example above is a way to re-render the app with the new data when the promise resolves. Let's create a new action which, by convention, will do nothing other than trigger a re-render. You will need to have this new "RERENDER_APP" action handled in your reducer. How you choose to handle it is up to you, but it is important a reference to a new state object is returned so everything is correctly re-rendered. Here is an example of how you might handle it. It logs the current state of the async selector for debugging convenience.
```js
import { combineReducers, createStore } from 'redux'

const rootReducer = combineReducers({
  // Your other sub-reducers go here ...

  AsyncSelectorLog: (state, action) => {
    if (action.type === 'RERENDER_APP') {
      return { ...state, [action.key]: action.value };
    }
    return state;
  },
});

export const store = createStore(rootReducer);
```
Now we need to make sure the onResolve and onReject callbacks actually dispatch that action. Duplicating the logic for dispatching this action for every selector is not ideal. For this reason, it is recommended you make an async-selector wrapper containing any logic you want all or most of your instances to share. For example, it could look like this.

```js
import createAsyncSelector from 'async-selector';
import { store } from './store'

// You could optionally throttle re-render events here.
function rerender(data, id='n/a') {
  store.dispatch({
    type: 'RERENDER_APP',
    key: id,
    value: data,
  });
}

// You could optionally show an error popup to the user here
function rerenderError(error, id='n/a') {
  store.dispatch({
    type: 'RERENDER_APP',
    key: id,
    value: String(error),
  });
}

export function createCustomAsyncSelector(params, ...selectors) {
  return createAsyncSelector({
    onResolve: result => rerender(result, params.id),
    onReject: error => rerenderError(error, params.id),
    ...params,
  }, ...selectors);
}
```
Now that all that is setup, here is how you can use your async selector in an actual redux app.
```js
import { createCustomAsyncSelector } from './custom-async-selector';
import { getSearchResults } from './search-api';

const getSearchText = state => state.searchText;

const getSearchResponse = createCustomAsyncSelector({
  async: getSearchResults,
  id: 'getSearchResponse', // id is so we can easily look up the result in state
}, [getSearchText]);

export const searchResults = createSelector(
  [getSearchResponse], d => d.isResolved ? d.value : []
);

export const isWaitingForSearchResults = createSelector(
  [getSearchResponse], d => d.isWaiting
)

export const searchResultsErrorMessage = createSelector(
  [getSearchResponse], d => d.isRejected ? String(d.value) : null
)

// If creating 3 separate selectors for each of the 3 states seems boilerplate-y
// feel free have this logic in './custom-async-selector' to avoid duplicate code
```
### Chaining async calls
A very powerful feature of using selectors for async calls is the ability to elegantly create a dependency graph just like you would with normal selectors. The only issue is that the selector may be in the "isWaiting" state and the value is useless. This is where the "shouldUseAsync" function is useful. With it, you can make the selector not make async calls unless the inputs are valid.
```js
// ....
const employees = createAsyncSelector(params, [getSearchText]);

const params2 = {
  async: employees => getAgesForEmployees(employees.value),
  onResolve: (ages, employees) => store.dispatch(triggerRerender()),
  shouldUseAsync: (employees) => employees.isResolved === true,
}
const employeeAges = createAsyncSelector(params2, [employees]);
console.log('Ages:', employeeAges(store.getState()))
```
### Throttling queries
Often, you don't want to send queries too frequently. For example, if the user is typing into a textfield, you might only want to send a query after the user finished, so as to not spam the API. To solve this, you can use the "throttle" parameter.
```js
import { debounce } from 'lodash';

const params = {
  sync: (searchText) => [],
  async: getEmployees,
  throttle: f => debounce(f, 250),
}
```
Internally, a debounced version of the selector is generated and it is (recursively) called every time the selector is called (if the inputs were changed).
### Custom caching
A common issue is the need to cache API calls. For example, if you are looking at last month's stock market data, then zoom to today's data, then zoom back to last month's data, you shouldn't have to query for a month's worth of data again. To handle this, simply put any custom caching logic in the async function you pass in. As long as the function returns a promise that resolves the same value given the same inputs, it is perfectly fine to do this. This caching logic can be as simple or complex as needed. A slight flaw in this approach is that it may not be desirable to dispatch an extra "RERENDER" action when the data already exists in memory. See the Recipes section for a solution to this.
### Handling stateful APIs
Generally, a basic assumption of a selector is the function is pure - the inputs fully determine the output. Unfortunately, that is an assumption can't always be made when querying a database. For example, you might have a button that allows the user to refresh the data if the user is worried the data was changed. Fortunately, this isn't actually a big issue thanks to the "forceUpdate" parameter!

```js
function buttonClicked() {
  const result = employeeAges.forceUpdate(store.getState()) // the selector will create a new promise regardless of whether the inputs changed. It will always return an object in the "isWaiting" state.
}
```

The selector will be called as if the inputs changed thus automatically creating a new promise. With this technique, an async selector could simply be treated like a memoized function and state variable combo.

### Avoiding over-rendering
A useful feature of using an async selector is that every time a new set of inputs are used, it immediately returns a default value. This avoids the dangerous bug of having data show up that looks correct while the promise is waiting to be resolved. However, in some cases flipping between a default value and a resolved value is undesirable. For example, if the user is typing and the search suggestions are constantly appearing and disappearing, it could be jarring. The simple solution is to use ".previous" instead ".value". "previous" is initially undefined, but otherwise it is the result of the most recent promise resolution.
```js
const searchResults = createAsyncSelector(params, searchText);
console.log('results:', searchResults(store.getState()).previous || [])
// previous === value when isResolved is true.
```

### Usage across multiple instances of a component
Just like in reselect, an async selector can take in two variables (for example, global state and component props). Reselect has examples of this [here](https://github.com/reduxjs/reselect#selectorstodoselectorsjs-1).

# Documentation
createAsyncSelector takes in two arguments: 

```js
function createAsyncSelector(params: Object, ...selectors) -> func
```
It outputs an object with the following form:
```
{
  value: Either the resolved value, rejected value, or the output of "sync",
  previous: The previously resolved value (useful when you don't want to render the output of "sync"),
  isWaiting: true if the promise is not resolved or rejected and the value is from the "sync" function,
  isResolved: true if the value is the resolved value,
  isRejected: true if the value is the rejected value,
}
```
## selectors
Each selector is a function that takes in state (and optionally a second variable) as its argument just like in reselect. It memoizes its results so the only way for it to return a different value for the same inputs is if it contained a promise that was resolved. An async selector is only different from a normal selector in that you can call ".forceUpdate(state)" of state which will automatically create a new promise and return an object in the "isWaiting" state.
```js
function selector(state, ?props) -> any
selector.forceUpdate(state, ?props) -> any
```
## params
params is an object
### params.sync (Optional)
```js
function sync(...selectorResults) -> any
```
sync is a function that takes as input all the selectors evaluated using state. It is usually used to simply return some default value like an empty list.
### params.async (Required)
```js
function async(...selectorResults) -> promise
```
async is a function that takes as input all the selectors evaluated using state and returns a promise. The promise should always either resolve or reject.
### params.onResolve
```js
function onResolve(resolvedValue, ...selectorResults) -> void
```
This is a callback function that takes in theresolved value of the promise and the selector results
### params.onReject
```js
function onReject(rejectedValue, ...selectorResults) -> void
```
This is a callback function that takes in the rejected value of the promise and the selector results
### params.onCancel
```js
function onCancel(cancelledPromise, ...selectorResults) -> void
```
This is a callback function that takes in the cancelled promise and the selector results. A promise is cancelled when a new promise is created before the old one is resolved or rejected.
### params.shouldUseAsync
```js
function shouldUseAsync(...selectorResults) -> bool
```
This function can be used to stop the creation of a new promise if the inputs are invalid. It takes in the selectorResults and should output true or false
### params.omitStatus
```js
omitStatus: bool
```
This is a convenience variable. If it is set to true, the selector will only output a value not the entire object.

### params.throttle
```js
function throttle(func) -> func
```
This function is passed a selector and the new version of that function is recursively called every time the selector is called and the inputs were changed.

# Recipes
Here are some patterns to can use to solve common problems
### Debouncing/Throttling reselect selectors
A very cool thing is the ability to throttle computationally expensive selectors. Here's a generic function that accomplishes the task
```js
import createAsyncSelector from 'async-selector';
import { createSelector } from 'reselect';
import { store, triggerRerender } from './somewhere';

export function throttleSelector(selector, throttleFunc) {
  const asyncSelector = createAsyncSelector({
    async: val => new Promise(res => res(val)),
    throttle: throttleFunc,
    onResolve: () => store.dispatch(triggerRerender()),
  }, [selector]);
 
  return createSelector(
    [asyncSelector, selector],
    (resp, val) => {
      return resp.isResolved 
       ? resp.value 
       : (resp.previous || val);
    }
  );
}
```
### Handling custom caching
To handle custom caching, you should simply handle the caching logic in your async function. A problem you may have is that even if the data is in memory, a promise will need to be resolved and re-render action will be dispatched. In most cases, this is such a small issue that it isn't worth worrying about. But you can avoid this extra re-render action by following this pattern.
```js
import api from './api'
import createAsyncSelector from 'async-selector';
import { createSelector } from 'reselect';
import { store, triggerRerender } from './somewhere';

const getSearchText = state => state.searchText;

const isCached = createSelector(
  [getSearchText], text => api.isInCache(text)
);

const resultsFromCache = createSelector(
  [isCached, getSearchText], (isCached, text) => {
    if (!isCached) return undefined;
    return api.getFromCache(text);
  }
);

const searchResultsAsyncSelector = createAsyncSelector({
  shouldUseAsync: (text, isCached) => !isCached,
  async: text => api.getResults(text),
  onResolve: () => store.dispatch(triggerRerender()),
}, [getSearchText, isCached]);

export const searchResults = createSelector(
  [searchResultsAsyncSelector, isCached, resultsFromCache]
  (resp, isCached, cachedResults) => {
    if (isCached) return cachedResults;
    return resp.isResolved ? resp.value : [];
  }
);

export const isWaiting = createSelector(
  [searchResultsAsyncSelector, isCached]
  (resp, isCached, cachedResults) => {
    if (isCached) return false;
    return resp.isWaiting;
  }
);

// If this is a common issue, you can put this logic into a helper function.
```
### Batching rerender events
A useful trick is to be able throttle re-render events for performance reasons. This can be safely done without risk of the app behaving incorrectly (but will be generally slightly slower). This is very simple to do in your async selector wrapper.
```js
import createAsyncSelector from 'async-selector';
import { store } from './store'
import { throttle } from 'lodash';

const rerender = throttle((data, id='n/a') => {
  store.dispatch({
    type: 'RERENDER_APP',
    key: id,
    value: data,
  });
}, 100);

export function createCustomAsyncSelector(params, ...selectors) {
  return createAsyncSelector({
    onResolve: result => rerender(result, params.id),
    ...params,
  }, ...selectors);
}
```
### Handling boilerplate
A common thing you want to do is render a loading message or an error message depending on the status of the request. You could simply pass the results of the async selector directly into the component. This may not be ideal because it tightly couples the component to the async-selector package. The other option is to create 3 selectors (results, isWaiting, errorMessage) for every async selector. This is better but can result in a lot of boilerplate. We can make a helper function to reduce this boilerplate.
```js
import createAsyncSelector from 'async-selector';
import { store } from './store'

const rerender = (data, id='n/a') => {
  store.dispatch({
    type: 'RERENDER_APP',
    key: id,
    value: data,
  });
})

export function createCustomAsyncSelector(params, ...selectors) {
  const asyncSelector = createAsyncSelector({
    onResolve: result => rerender(result, params.id),
    onReject: error => rerender(String(error), params.id),
    ...params,
  }, ...selectors);

  const isWaiting = createSelector(
    [asyncSelector], d => d.isWaiting
  );

  const errorMessage = createSelector(
    [asyncSelector], d => d.isRejected ? String(d.value) : null
  );

  const results = createSelector(
    [asyncSelector], d => d.isResolved ? d.value : params.defaultValue
  );

  return [results, isWaiting, errorMessage];
}

// example usage
export const [
  searchResults,
  searchInProgress,
  searchError,
] = createCustomAsyncSelector({
  async: api.getSearchResults,
  id: 'search',
  defaultValue: [],
}, [state => state.searchText])
```
