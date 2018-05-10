A simple, lightweight library inspired by [reselect](https://github.com/reduxjs/reselect) which allows you select data out of a remote database almost as easily as you would from local state. This library will normally be used in conjunction with redux and reselect but it has no dependencies.

# What It solves
A normal (naive) approach to handling fetching data from a database in redux would be
- Initiate a request is response to some event (app loaded, component mounted, search text changed, etc)
- dispatch an action to change a variable in state so you can render a loading message
- handle a promise rejection in a similar way
- handle a promise resolution by populating state with the new data

### Problems
This way has many common problems that just about everybody has experienced.
- An old request could potential overwrite the data of a newer request if you don't handle that edge case.
- During the time between the request being sent and the response received, you might be rendering stale data.
- Having many variables in state and associated actions/reducers for the query status is a lot of redundant, tedious code.
- If you have requests that depend on previous responses, this could result in callback hell and/or difficulty in reuse of the first response's data.
- There is no guarantee that multiple duplicate requests won't be made.
- Sending queries in response to user actions can result in brittle code and isn't really in the spirit of redux/reselect (Unless it's actually necessary). For example, if you call a function in a server based on many user inputs, you will have to write code to send a query for every input field.

# Async selectors to the rescue!
Wouldn't it be awesome to be able treat data in database the same way you treat data in the local state? Well actually you can (almost)! An async selector is just like a normal selector except you pass in a function that returns a promise. Until the promise resolves, the selector returns a default value. But once it resolves, it returns the result of the promise. Any stale promises are automatically cancelled so you will always see up-to-date data.

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

console.log('Employees: ', employees(store.getState()));
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
### Usage in redux
A serious problem with the above code is that when the promise resolves, the app doesn't re-render to show the new data. Instead of simply logging the employees in the onResolve callback, we need to dispatch an action to tell the app to re-render and call the selector. This is a bit of a hack because nothing in the state was changed. One thing to make sure of is that the action changes state in some way or a re-render event won't be triggered. Another thing to be careful to avoid is recursion resulting from the action causing the inputs of the selector to change.

```js
const triggerRerender = () => {
    return {
        type: 'RERENDER_APP',
    };
};

const params = {
  sync: (searchText) => [],
  async: getEmployees,
  onResolve: (employees, searchText) => store.dispatch(triggerRerender()),
  onReject: (error, searchText) => console.log(error),
  onCancel: (promise, searchText) => console.log(promise),
}
```
### Chaining async calls
A very powerful feature of using selectors for async calls is the ability to elegantly create a dependency graph just like you would with normal selectors. The only issue is that the selector another selector is dependent on may be in the "isWaiting" state and the value is useless. This is where the "shouldUseAsync" function is useful. With it, you can make the selector not make async calls unless the inputs are valid.

```js
// ....
const employees = createAsyncSelector(params, [getSearchText]);

const params2 = {
  sync: (employees) => [],
  async: getAgesForEmployees,
  onResolve: (ages, employees) => store.dispatch(triggerRerender()),
  onReject: (error, employees) => console.log(error),
  onCancel: (promise, employees) => console.log(promise),
  shouldUseAsync: (employees) => employees.isResolved === true,
}
const employeeAges = createAsyncSelector(params2, [employees]);
```

### Handling stateful APIs
Generally, a basic assumption of a selector is the function is pure - the inputs fully determine the output. Unfortunately, that is an assumption can't always be made when querying a database. For example, you might have a button that allows the user to refresh the data if the user is worried the data was changed. Fortunately, this isn't actually a big issue thanks to the "forceUpdate" parameter!

```js
function buttonClicked() {
  employeeAges(store.getState(), true) // "true" indicates that the selector should create a new promise regardless of whether the inputs changed
}
```

By passing true as the second parameter of the selector, the selector will be called as if the inputs changed thus automatically creating a new promise.

### Throttling queries
Often, you don't want to send queries too frequently. For example, if the user is typing into a textfield, you might only want to send a query after the user finished, so as to not spam the API. To solve this, you can use the "throttle" parameter.

```js
import _ from 'underscore';

const params = {
  sync: (searchText) => [],
  async: getEmployees,
  throttle: f => _.debounce(f, 250),
}
```
Internally, a debounced version of the selector is generated and it is (recursively) called every time the selector is called (if the inputs were changed).


# Documentation
createAsyncSelector takes in two arguments: 

```js
function createAsyncSelector(params, ...selectors) -> obj
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
Each selector is a function that takes in state as its argument just like in reselect. It memoizes its results so the only way for it to return a different value for the same inputs is if it contained a promise that was resolved. An async selector is only different from a normal selector in that you can pass in "forceUpdate" bool as the second parameter to force a promise to be made.
```js
function selector(state, forceUpdate=false) -> any
```
## params
params is an object
### params.sync (Required)
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