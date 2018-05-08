import createAsyncSelector from '../src/index';

const state = {
  text: "Ma",
}
let count = 0;

function getEmployees(text) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const database = ["Mark Metzger", "Steven Miller"];
      if (text.length > 10) {
        reject('Search Text Too Long');
      } else {
        resolve(database.filter(name => name.includes(text)));
      }
    }, 100);
  });
}

function deepEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

const params = {
  sync:(text) => [],
  async: getEmployees,
}

test('Test createAsyncSelector is function', () => {
  expect(typeof createAsyncSelector === 'function').toBe(true);
});

test('Test createAsyncSelector default value', () => {
  const employees = createAsyncSelector(params, state => state.text);

  const expected = { 
    value: [],
    previous: undefined,
    isWaiting: true,
    isResolved: false,
    isRejected: false 
  }
  expect(deepEqual(employees(state), expected)).toBe(true);
});

test('Test createAsyncSelector async value', () => {
  const employees = createAsyncSelector(params, state => state.text);

  const expected = { 
    value: ["Mark Metzger"],
    previous: undefined,
    isWaiting: false,
    isResolved: true,
    isRejected: false 
  }
  employees(state)
  setTimeout(() => {
    expect(deepEqual(employees(state), expected)).toBe(true);
  }, 200)
  
});

test('Test createAsyncSelector previous value', () => {
  const employees = createAsyncSelector(params, state => state.text);

  const expected = { 
    value: ["Steven Miller"],
    previous: ["Mark Metzger"],
    isWaiting: false,
    isResolved: true,
    isRejected: false 
  }

  employees(state)
  setTimeout(() => {
    employees(state)
    state.text = "St";
    employees(state);
    setTimeout(() => {
      expect(deepEqual(employees(state), expected)).toBe(true);
    }, 200)
  }, 200)
});

test('Test createAsyncSelector rejected', () => {
  const employees = createAsyncSelector(params, state => state.text);

  const expected = { 
    value: "Search Text Too Long",
    previous: ["Mark Metzger"],
    isWaiting: false,
    isResolved: false,
    isRejected: true 
  }

  employees(state)
  setTimeout(() => {
    employees(state)
    state.text = "Sttttttttttttt";
    employees(state);
    setTimeout(() => {
      expect(deepEqual(employees(state), expected)).toBe(true);
    }, 200)
  }, 200)
});

test('memoization', () => {
  const sync = () => {count += 1};
  const employees = createAsyncSelector({...params, sync}, state => state.text);

  count = 0;
  employees(state);
  employees(state);
  state.text = "St";
  employees(state);
  expect(count).toBe(2);
});

test('memoization', () => {
  const sync = () => {count += 1};
  const employees = createAsyncSelector({...params, sync}, state => state.text);

  count = 0;
  employees(state);
  employees(state);
  employees(state);
  expect(count).toBe(1);
});

test('lack of memoization', () => {
  const sync = () => {count += 1};
  const employees = createAsyncSelector({...params, sync}, state => state.text);

  count = 0;
  employees(state);
  employees(state, true);
  employees(state, true);
  expect(count).toBe(3);
});

test('cancel', () => {
  const onCancel = () => {count += 1};
  const employees = createAsyncSelector({...params, onCancel}, state => state.text);

  count = 0;
  employees(state);
  employees(state, true);
  employees(state, true);
  expect(count).toBe(2);
});

test('cancel', () => {
  const onCancel = () => {count += 1};
  const employees = createAsyncSelector({...params, onCancel}, state => state.text);

  count = 0;
  employees(state);
  employees(state, true);
  setTimeout(() => {
    employees(state, true);
    expect(count).toBe(1);
  }, 500);
});

test('omitStatus', () => {
  const omitStatus = true;
  const employees = createAsyncSelector({...params, omitStatus}, state => state.text);
  expect(deepEqual(employees(state), [])).toBe(true);
});

test('onResolve', () => {
  const onResolve = () => {count += 1};
  const employees = createAsyncSelector({...params, onResolve}, state => state.text);
  count = 0;
  employees(state);
  employees(state);
  employees(state);
  expect(count).toBe(0);
});

test('onResolve', () => {
  const onResolve = () => {count += 1};
  const employees = createAsyncSelector({...params, onResolve}, state => state.text);
  count = 0;
  employees(state);
  setTimeout(() => {
    employees(state);
    setTimeout(() => {
      employees(state);
      setTimeout(() => {
        expect(count).toBe(1);
      }, 200);
    }, 200);
  }, 200);
});

test('onResolve', () => {
  const onResolve = () => {count += 1};
  const employees = createAsyncSelector({...params, onResolve}, state => state.text);
  count = 0;
  employees(state);
  setTimeout(() => {
    employees(state, true);
    setTimeout(() => {
      employees(state, true);
      setTimeout(() => {
        expect(count).toBe(3);
      }, 200);
    }, 200);
  }, 200);
});

test('onResolve', () => {
  const onResolve = () => {count += 1};
  const employees = createAsyncSelector({...params, onResolve}, state => state.text);
  count = 0;
  employees(state);
  setTimeout(() => {
    employees(state, true);
    setTimeout(() => {
      employees(state, true);
      setTimeout(() => {
        expect(count).toBe(2);
      }, 200);
    }, 200);
  }, 10);
});

test('onResolve', () => {
  const onResolve = () => {count += 1};
  const shouldUseAsync = (text) => text === '';
  const employees = createAsyncSelector({...params, onResolve, shouldUseAsync}, state => state.text);
  count = 0;
  employees({text: 'Ma'});
  setTimeout(() => {
    employees({text: ''});
    employees({text: ''});
    setTimeout(() => {
      employees(state, {text: 'Ma'});
      setTimeout(() => {
        expect(count).toBe(1);
      }, 200);
    }, 200);
  }, 10);
});