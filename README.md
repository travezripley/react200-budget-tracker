# React/Redux Budget Tracker

A bare bones react starter set of files

## Setup


```
npm install
```
```
npm run build
```
> `run build` has been modified to watch for changes.
```
npm start

```
-------------

# Budget Tracker with Redux

We're going to walk through creating a React application with Redux. 

React has a mechanism for managing state, but it's most effective for controlling state at the component level. Though it can be used to manage state for the whole application, inter-component state can be very difficult to manage.

Lets say you have 2 components, A and B, that need to share and update some information. So you create a Parent component C that can pass the data and update functions as props to the child components.
```bash
|- C
  |- A
  |- B
```

Now we have some data that component D needs to share with C. So we'll need another parent component.

```bash
|- E
  |- C
    |- A
    |- B
  |- D
```

This solution can get out of hand very quickly as it's also very likely that many components don't need data and only exist to pass data to other components, but all that code needs to be written anyway. This is when we start to look for solutions for managing the state of our application as a whole.


## What is Redux

Redux is a library for managing the state of your entire application. The core concept of Redux is that all state (or data) for your application is kept in one place called the Store. This way any component can get the data that it specifically needs. And any components subscribed to the store are informed when changes to the store have been made.

It is actually very simple.

Imagine your application's state is described as a plain object. For example, the state of a todo app might look like this:

#### Store
```js
{
  todos: [
    {
      text: 'Eat food',
      completed: true
    }, {
      text: 'Exercise',
      completed: false
    }
  ],
  visibilityFilter: 'SHOW_COMPLETED'
}
```

This object is like a “model” except that there are no setters. Meaning there is no way to directly update a property's value, only read it.
This is so that different parts of the code can’t change the state arbitrarily, causing hard-to-reproduce bugs.

We'll call this state-containing object the **Store**.

To change something in the **Store**, you need to **dispatch** an **action**. An **action** is a plain JavaScript object (notice how we still haven't introduced any magic?) that describes what happened. Here are a few example actions:

#### Actions
```js
{ type: 'ADD_TODO', text: 'Go to swimming pool' }
{ type: 'TOGGLE_TODO', index: 1 }
{ type: 'SET_VISIBILITY_FILTER', filter: 'SHOW_ALL' }
```

Enforcing that every change is described as an action allows us have a clear understanding of what’s going on in the application. If something has changed, we know why it changed. **Actions** are like breadcrumbs of what has happened.

Finally, to tie the **store** and **actions** together, we write a function called a **reducer**. Again, nothing magical about it—it’s just a function that takes the previous state and an action as arguments, and returns the next state of the app. It would be hard to write such a function for a big app, so we write smaller functions managing parts of the state:

#### Reducers
```js
function visibilityFilter(state = 'SHOW_ALL', action) {
  if (action.type === 'SET_VISIBILITY_FILTER') {
    return action.filter
  } else {
    return state
  }
}

function todos(state = [], action) {
  switch (action.type) {
    case 'ADD_TODO':
      return state.concat([{ text: action.text, completed: false }])
    case 'TOGGLE_TODO':
      return state.map(
        (todo, index) =>
          action.index === index
            ? { text: todo.text, completed: !todo.completed }
            : todo
      )
    default:
      return state
  }
}
```
And we write another reducer that manages the complete state of our app by calling those two reducers for the corresponding state keys:

```js
function todoApp(state = {}, action) {
  return {
    todos: todos(state.todos, action),
    visibilityFilter: visibilityFilter(state.visibilityFilter, action)
  }
}
```
This is basically the whole idea of Redux, that you describe how your state is updated over time in response to action objects, and 90% of the code you write is just plain JavaScript, with no use of Redux itself, its APIs, or any _magic_.


## Understanding One-way Data Flow

Redux architecture revolves around a strict unidirectional (one-way) data flow.

This means that all data in an application follows the same lifecycle pattern, making the logic of your app more predictable and easier to understand.

#### Redux LifeCycle Pattern
```
Some event comes in (e.g. click, user typing, form submission)
  Which dispatches an Action
    The Reducer calculates a new state (based on previous state and the action)
      Which updates the Store
        Which updates the view (e.g. React Components)
          Now the user can trigger a new event
```
By making sure that every change in the whole application follows this pattern, debugging any issue becomes very simple because you can just work backwards through the lifecycle.

It also encourages data normalization, meaning not ending up with multiple, independent copies of the same data that are unaware of one another.

## Getting Started

It's much easier to show rather than tell.

**And you learn a lot more, by typing it all out, rather than copying**.
_Just saying._

For this project we'll be building a very very simple budget tracker where we can create line items and have them be calculated into a summary as we add them.

Start by cloning the repository from [Github](https://github.com/SanDiegoCodeSchool/react200-budget-tracker)

Don't forget to run `npm install`

For this project we'll also be implementing a helpful tool creatively named "Redux DevTools" as a Chrome extension. [It can be installed here](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en). It will attach itself to the normal Chrome DevTools, and _will only show on pages that implement it's use_.

![Budget Tracker Example](https://i.imgur.com/0CTXSTz.png)


#### File Structure
```
  react200-budget-tracker
  |- src/
    |- js/
      |- index.jsx
      |- app.jsx
```

While we're working on this let's open 2 terminals to the `react200-budget-tracker` directory. In one terminal run `npm run build` this script has been modified to automatically watch for changes so keep it running while developing. In the other terminal run `npm start` this will start the node server. 

Now let's check the page at [http://localhost:3000](http://localhost:3000)

It should like the example image above.

## Making Components

In this case the HTML and CSS work has already been done and moved into React, our job is to implement the logic using Redux. First we have to break up this application into components.

Let's start by adding new files and folders. Just make empty files for now, we'll fill them in as we go.

#### File Structure
```
  react200-budget-tracker
  |- src/
    |- js/
      |- components/
        |- ExpenseEntries/
          |- ExpenseEntries.jsx
          |- index.js
        |- IncomeEntries/
          |- IncomeEntries.jsx
          |- index.js
        |- Summary/
          |- Summary.jsx
          |- index.js
      |- rootReducer.js
      |- rootStore.js
      |- index.jsx
      |- app.jsx
```

Let's create the ExpenseEntries components first.

#### ExpenseEntries.jsx
```js
import React from 'react';

export default class ExpenseEntries extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='card border-danger mb-3'>
        <div className='card-header text-white bg-danger'>Expense Entries</div>
        <div className='card-body'>
          <form>
            <div className='form-group'>
              <label htmlFor='expense-description'>Description</label>
              <input
                type='text'
                className='form-control'
                id='expense-description'
              />
            </div>
            <div className='form-group'>
              <label htmlFor='expense-amount'>Amount</label>
              <div className='input-group'>
                <span className='input-group-addon'>$</span>
                <input
                  type='text'
                  className='form-control'
                  id='expense-amount'
                />
              </div>
            </div>
            <button
              type='button'
              className='btn btn-danger col-12 mb-5'
            >+ Add Expense
            </button>
            <table className='table table-sm table-hover'>
              <thead>
                <tr>
                  <th>Description</th>
                  <th style={ { width: 120 } } >Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Rent</td>
                  <td>$1,500.00</td>
                </tr>
              </tbody>
            </table>
          </form>
        </div>
      </div>
    );
  }
}

```

For the IncomeEntries component we can copy the same code, and only change anywhere it says `expenses` to `income`.
And change the class names from `danger` to `success`.

Now let's create the Summary component
#### Summary.jsx
```js
import React from 'react';

export default class Summary extends React.Component {
  render() {
    return (
      <div className='card border-info mb-3'>
        <div className='card-header text-white bg-info'>Summary</div>
        <div className='card-body'>
          <div className='container'>
            <div className='row'>
              <div className='col-6 text-center'>
                <h6 className='h6 strong'>Total Income</h6>
                <p>$4,000.00</p>
              </div>
              <div className='col-6 text-center'>
                <h6 className='h6 strong'>Total Expense</h6>
                <p>$1,500.00</p>
              </div>
            </div>
            <div className='row justify-content-center'>
              <div className='col-6 text-center'>
                <h6 className='h6 strong'>Left after spending</h6>
                <p>$1,500.00</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

```

To make it easier them easier to import in the `index.js`  **of each component** simply `import` and `export default` the same component. This file will have more later, but for now it allows us to shorten our import path from `'./components/IncomeEntries/IncomeEntries'` to `'./components/IncomeEntries'`. 

#### ExpenseEntries/index.js
```js
import ExpenseEntries from './ExpenseEntries';

export default ExpenseEntries;

```

Now that we have our components separated we can update the `app.jsx` file to use them.
#### App.jsx
```js
import React from 'react';
import IncomeEntries from './components/IncomeEntries';
import ExpenseEntries from './components/ExpenseEntries';
import Summary from './components/Summary';

export default class App extends React.Component {
  render() {
    return (
      <div className='container'>
        <div className='jumbotron' >
          <h1 className='display-3 text-center'>Budget Tracker</h1>
        </div>
        <div className='row'>
          <div className='col-12 col-md-6 mb-4'>
            <IncomeEntries />
          </div>
          <div className='col-12 col-md-6 mb-4'>
            <ExpenseEntries />
          </div>
        </div>
        <div className='row justify-content-center'>
          <div className='col-12 col-md-6'>
            <Summary />
          </div>
        </div>
      </div>
    );
  }
}

```

The application isn't going to look any different but we have taken the next step to building something scaleable.

> If everything is working now would be a great time to make a git commit. Remember to make them often and as much as possible only when things are working.

## Setting up the Store

Now here normally we would have to `npm install redux rect-redux`, but I've included it already.

We need to create the store and attach any middleware. In this case the only middleware we'll use is the Redux DevTools. By attaching it as middleware the Redux DevTools will be able to see all the changes that pass through the Store.


Also note for now, since we haven't created any reducers we need an empty temporary one.

#### rootStore.js
```js
import { createStore } from 'redux';

function tempReducer () {
  return null;
}

const rootStore = createStore(
  tempReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default rootStore;

```

In order for React to make use of the store we'll need to use a special `connect()` function later. And for that `connect()` function to work we need to wrap our `<App/>` in the `<Provider>` component. So let's do that now.

#### index.jsx
```js
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import App from './app';
import store from './rootStore';

render(
  <Provider store={ store }>
    <App />
  </Provider>,
  document.getElementById('root')
);

```

The Provider will provide the store to the `connect()` function using some of the more complex layers of React called the context.

Again, at this point the application isn't going to look any different.

> And again since everything is working, now would be a great time to make a git commit. Remember to make them often and as much as possible only when things are working.

## Creating and Connecting Reducers

Now that our store is working and connected to React, we need to create and connect our reducers. These will define how the Actions affect or change the store.

Since input to our application is only coming from the two `Entries` components we only need to create reducers for those components.

This file should either live in the same directory as the component or it could be in it's own directory if it doesn't have a matching component.

In the file we also need to create a default state for the part of the Store this reducer is responsible for. Since this component has two input fields we'll need two properties with empty strings, and of course we'll start with an empty list (array) of line Items.

#### ExpenseEntries/expenseReducer.js
```js

const defaultState = {
  description: '',
  amount: '',
  lineItems: []
};

export default function ExpenseReducer (state = defaultState, action) {
  // the `state = defaultState` above is new ES6 syntax
  // for defining a default value on a parameter
  return state;
}

```

Again for  `IncomeEntries/incomeReducer.js` we can use the exact same code just changing the name from expense to income. And making sure it's in the correct directory.

Now that we have some reducers and we need to combine them, because the store ultimately only accepts one reducer.

Let's update the rootReducer file
#### rootReducer.js
```js
import { combineReducers } from 'redux';
import expenseReducer from './components/ExpenseEntries/expenseReducer';
import incomeReducer from './components/IncomeEntries/incomeReducer';

const rootReducer = combineReducers({
  expense: expenseReducer,
  income: incomeReducer
});

export default rootReducer;

```

And we need to update the store to use our new reducer.

#### rootStore.js
```js
import { createStore } from 'redux';
import rootReducer from './rootReducer';

const rootStore = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default rootStore;

```

With this our Store object officially has a shape that we can observe using the Redux DevTools. You can see it under the State tab.

![Redux DevTools](https://i.imgur.com/fb64Quq.png)

Now we can see some changes in our DevTools, but still nothing in our UI.

> Last reminder, If your app is in a working state (and it should be). Make a git commit.

## Using Action Creators

Next we need a way to create the actions that the reducer needs to change the store.

Remember that Actions are just objects that describe a change, we'll have our action adhere to the [Flux Standard Action](https://github.com/acdlite/flux-standard-action) pattern.

An FSA action should have at minimum a type and a payload.
The type and payload are used by the reducer to identify and modify the state.

#### Flux Standard Action
```js
{
  type: 'ADD_TODO',
  payload: {
    text: 'Go to swimming pool'
  }
}
```

The goal of actions is to predefine all state changes, but the `text` of that example could be any user input. So we need a way to dynamically create actions, hence Actions Creators.

Action Creators are just functions that return Actions, simple.

Create a file next to the expenseEntries component called `expenseActions.js`.

In the actions file we're going to create our action types and the action creators. We'll export the action types in order to reuse them in the reducer.

#### expenseActions.js
```js
// Action Creators
export function updateExpenseDescription(description) {
  return {
    type: 'UPDATE_EXPENSE_DESCRIPTION',
    payload: { description }
  };
}

export function updateExpenseAmount(amount) {
  return {
    type: 'UPDATE_EXPENSE_AMOUNT',
    payload: { amount }
  };
}

export function addExpense(description, amount) {
  return {
    type: 'ADD_EXPENSE',
    payload: {
      description,
      amount: parseFloat(amount)
    }
  };
}

```

Now that we have an idea of what our actions are going to be we can update the reducers to use those actions.

We'll import the types from the actions file. And to the reducer functions we will add a switch-case statement that will return a different state based on the action that come in.

#### expenseReducer.js
```js
const defaultState = {
  description: '',
  amount: '',
  lineItems: []
};

export default function ExpenseReducer(state = defaultState, action) {
  const { type, payload } = action;

  switch (type) {
    // Here in the case of the update description action 
    case 'UPDATE_EXPENSE_DESCRIPTION': {
      // we'll return an object
      return {
        // with all the previous state
        ...state,
        // but overwriting the description
        description: payload.description
      };
    }

    case 'UPDATE_EXPENSE_AMOUNT': {
      return {
        ...state,
        amount: payload.amount
      };
    }

    case 'ADD_EXPENSE': {
      const { description, amount } = action.payload;
      return {
        description: '',
        action: '',
        lineItems: [
          // here we have all the previous line items
          ...state.lineItems,
          // plus a new object
          { description, amount }
        ]
      };
    }

    default: {
      return state;
    }
  }
}

```

Again, you can copy both files for the IncomeEntries component, just changing the names.

## Connecting Redux

Now we can finally start connecting the individual components.

We'll use the `connect()` function from the `react-redux` library. This will allow us to translate data from the store to the props of the component.

#### ExpenseEntries/index.js
```js
import { connect } from 'react-redux';
import ExpenseEntries from './ExpenseEntries';

// This function takes the store and returns an object
// that's passed to the props of the component.
function mapStoreToProps(store) {
  return {
    description: store.expense.description,
    amount: store.expense.amount,
    lineItems: store.expense.lineItems
  };
}

// This might look odd but, connect returns a function,
// that is then called with the component itself.
export default connect(mapStoreToProps)(ExpenseEntries);

```

Repeat for the IncomeEntries Component.

## Dispatching Actions

Finally we can update the components themselves to start using all these pieces.

In addition to pushing the store to props, `connect()` also pushed the store's dispatch method as a prop. Dispatch is the function that we pass actions to, in order to change the store.

#### expenseEntries.jsx
```js
import React from 'react';

// We'll need to import all those action creators.
import {
  updateExpenseDescription,
  updateExpenseAmount,
  addExpense
} from './expenseActions';

export default class ExpenseEntries extends React.Component {
  constructor(props) {
    super(props);

    // Here we're binding these methods to the context
    // of the components. This only has to be done,
    // because these methods are called back by
    // event emitters (which lose context).
    this.handleDescriptionInput = this.handleDescriptionInput.bind(this);
    this.handleAmountInput = this.handleAmountInput.bind(this);
    this.handleAddExpense = this.handleAddExpense.bind(this);
  }

  handleDescriptionInput(event) {
    // dispatch was provided by connect()
    const { dispatch } = this.props;
    const { value } = event.target;
    dispatch(updateExpenseDescription(value));
  }

  handleAmountInput(event) {
    const { dispatch } = this.props;
    const { value } = event.target;
    dispatch(updateExpenseAmount(value));
  }

  handleAddExpense() {
    const { description, amount, dispatch } = this.props;
    dispatch(addExpense(description, amount));
  }

  render() {
    // These values were provided by connect()
    const { description, amount, lineItems } = this.props;
    return (
      <div className='card border-danger mb-3'>
        <div className='card-header text-white bg-danger'>Expense Entries</div>
        <div className='card-body'>
          <form>
            <div className='form-group'>
              <label htmlFor='expense-description'>Description</label>
              <input
                type='text'
                className='form-control'
                id='expense-description'
                value={ description }
                onChange={ this.handleDescriptionInput }
              />
            </div>
            <div className='form-group'>
              <label htmlFor='expense-amount'>Amount</label>
              <div className='input-group'>
                <span className='input-group-addon'>$</span>
                <input
                  type='text'
                  className='form-control'
                  id='expense-amount'
                  value={ amount }
                  onChange={ this.handleAmountInput }
                />
              </div>
            </div>
            <button
              type='button'
              className='btn btn-danger col-12 mb-5'
              onClick={ this.handleAddExpense }
            >+ Add Expense
            </button>
            <table className='table table-sm table-hover'>
              <thead>
                <tr>
                  <th>Description</th>
                  <th style={ { width: 120 } } >Amount</th>
                </tr>
              </thead>
              <tbody>
                {
                  lineItems.map(lineItem => (
                    <tr>
                      <td>{ lineItem.description }</td>
                      <td>${ lineItem.amount.toFixed(2) }</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </form>
        </div>
      </div>
    );
  }
}

```

There are quite a few changes in this file, take your time to go through each line to understand how the data is going to flow using all that you've learned so far.

To recap the LifeCycle of the React-Redux implementation:
```
Element's onChange fires the handleChange method
  HandleChange dispatches an action-created action
    A Reducer catches the action and updates the store
      connect() function updates a component by it's props
        The component rerenders and now reflects the new state
```

#### Updating the Summary

You'll note that we never created a place in the store for the Summary component. This is not usually the case with patterns like MVC. That's because all the data needed to calculate the summary is in the line items in `income` and `expense`. In other words we can derive the information from existing data.


Let's start by updating the Summary component's index.js.
#### Summary/index.js
```js
import { connect } from 'react-redux';
import Summary from './Summary';

function mapStoreToProps(store) {
  return {
    expenseItems: store.expense.lineItems,
    incomeItems: store.income.lineItems
  };
}

export default connect(mapStoreToProps)(Summary);

```

Now let's use the lineItems as props to calculate the final tallies.
#### Summary/Summary.jsx
```js
import React from 'react';

function calculateSum(lineItems) {
  return lineItems.reduce((acc, lineItem) => acc + lineItem.amount, 0);
}

function formatCurrency(amount) {
  if (amount >= 0) {
    const dollars = Math.floor(amount);
    const cents = Math.floor((amount - dollars) * 100).toString().padEnd(2, '0');
    return `$${dollars.toLocaleString()}.${cents}`;
  }

  const dollars = Math.ceil(amount);
  const cents = Math.floor((amount - dollars) * 100 * -1).toString().padEnd(2, '0');
  return `-$${(dollars * -1).toLocaleString()}.${cents}`;
}

class Summary extends React.Component {
  render() {
    const { incomeItems, expenseItems } = this.props;

    const incomeTotal = calculateSum(incomeItems) / 100;
    const expenseTotal = calculateSum(expenseItems) / 100;
    const difference = Math.round(incomeTotal - expenseTotal) / 100;

    return (
      <div className='card border-info mb-3'>
        <div className='card-header text-white bg-info'>Summary</div>
        <div className='card-body'>
          <div className='container'>
            <div className='row'>
              <div className='col-6 text-center'>
                <h6 className='h6 strong'>Total Income</h6>
                <p>{ formatCurrency(incomeTotal) }</p>
              </div>
              <div className='col-6 text-center'>
                <h6 className='h6 strong'>Total Expenses</h6>
                <p>{ formatCurrency(expenseTotal) }</p>
              </div>
            </div>
            <div className='row justify-content-center'>
              <div className='col-6 text-center'>
                <h6 className='h6 strong'>Left after spending</h6>
                <p>{ formatCurrency(difference) }</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Summary;

```
## Exit Criteria
- Deploy the app to Heroku
- Submit the live URL in the LMS

## Bonus Items
- Add `prop-types` to all components
- Update the Entries component to delete or edit a line item.
- Refactor the income and expense components into one component that can handle both.

## Project Submission

To submit this project for instructor evaluation, please do the following:

* Push this project to GitHub
* Create a Heroku application
* Create a CircleCI project
* Configure automatic Heroku deployment
* Trigger a successful deployment

Once you have done the above, [Submit your project](https://goo.gl/forms/wx8DLSus7s88lk043)

##