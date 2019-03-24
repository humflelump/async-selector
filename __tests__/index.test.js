import createAsyncSelector from '../src/index';
import _ from '../src/underscore';


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

test('Test createAsyncSelector async value', done => {
  const employees = createAsyncSelector(params, state => state.text);

  const expected = { 
    value: ["Mark Metzger"],
    previous: ["Mark Metzger"],
    isWaiting: false,
    isResolved: true,
    isRejected: false 
  }
  employees(state)
  setTimeout(() => {
    try {
      expect(deepEqual(employees(state), expected)).toBe(true);
    } catch (e) {
      done.fail(e)
    }
    done();
  }, 200)
  
});

test('Test createAsyncSelector previous value', done => {
  const employees = createAsyncSelector(params, state => state.text);

  const expected = { 
    value: ["Steven Miller"],
    previous: ["Steven Miller"],
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
      try {
        expect(deepEqual(employees(state), expected)).toBe(true);
      } catch (e) {
        done.fail(e)
      }
      done()
    }, 200)
  }, 200)
});

test('Test createAsyncSelector rejected', done => {
  const employees = createAsyncSelector(params, state => state.text);
  const state = {text: 'Mar'};
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
      try {
        expect(deepEqual(employees(state), expected)).toBe(true);
      } catch (e) {
        done.fail(e)
      }
      done()
    }, 200)
  }, 200)
});

test('memoization', () => {
  let count = 0;
  let state = {text: 'gg'}
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
  employees.forceUpdate(state);
  employees.forceUpdate(state);
  expect(count).toBe(3);
});

test('cancel', () => {
  const onCancel = () => {count += 1};
  const employees = createAsyncSelector({...params, onCancel}, state => state.text);

  count = 0;
  employees(state);
  employees.forceUpdate(state);
  employees.forceUpdate(state);
  expect(count).toBe(2);
});

test('cancel', done => {
  const onCancel = () => {count += 1};
  const employees = createAsyncSelector({...params, onCancel}, state => state.text);

  count = 0;
  employees(state);
  employees.forceUpdate(state);
  setTimeout(() => {
    employees.forceUpdate(state);
    try {
      expect(count).toBe(1);
    } catch (e) {
      done.fail(e)
    }
    done()
    
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

test('onResolve', done => {
  let count = 0;
  const onResolve = () => {count += 1};
  const employees = createAsyncSelector({...params, onResolve}, state => state.text);
  
  employees(state);
  setTimeout(() => {
    employees(state);
    setTimeout(() => {
      employees(state);
      setTimeout(() => {
        try {
          expect(count).toBe(1);
        } catch (e) {
          done.fail(e)
        }
        done()
      }, 200);
    }, 200);
  }, 200);
});

test('onResolve forceUpdate', done => {
  let count = 0;
  const onResolve = () => {count += 1};
  const employees = createAsyncSelector({...params, onResolve}, state => state.text);
  count = 0;
  employees(state);
  setTimeout(() => {
    employees.forceUpdate(state);
    setTimeout(() => {
      employees.forceUpdate(state);
      setTimeout(() => {
        try {
          expect(count).toBe(3);
        } catch (e) {
          done.fail(e)
        }
        done()
      }, 200);
    }, 200);
  }, 200);
});

test('onResolve', done => {
  let count = 0;
  const onResolve = () => {count += 1};
  const employees = createAsyncSelector({...params, onResolve}, state => state.text);
  employees(state);
  setTimeout(() => {
    employees(state);
    setTimeout(() => {
      employees.forceUpdate(state);
      setTimeout(() => {
        try {
          expect(count).toBe(2);
        } catch (e) {
          done.fail(e)
        }
        done()
      }, 200);
    }, 200);
  }, 10);
});

test('debounce', done => {
  let c = 0;
  const throttle = f => _.debounce(f, 300);
  const onResolve = () => {c += 1};
  const employees = createAsyncSelector({...params, onResolve, throttle}, state => state.text);
  employees({text: 'a'});
  setTimeout(() => {
    employees({text: 'b'});
    setTimeout(() => {
      employees({text: 'c'});
      setTimeout(() => {
        employees({text: 'd'});
        setTimeout(() => {
          employees({text: 'e'});
          setTimeout(() => {
            try {
              expect(c).toBe(1);
            } catch (e) {
              done.fail(e)
            }
            done()
          }, 400);
        }, 400);
      }, 200);
    }, 200);
  }, 200);
});

test('debounce', done => {
  let c = 0;
  const throttle = f => _.debounce(f, 300);
  const onResolve = () => {c += 1};
  const employees = createAsyncSelector({...params, onResolve, throttle}, state => state.text);
  employees({text: 'a'});
  setTimeout(() => {
    employees({text: 'b'});
    setTimeout(() => {
      employees({text: 'c'});
      setTimeout(() => {
        employees({text: 'd'});
        setTimeout(() => {
          employees({text: 'e'});
          setTimeout(() => {
            try {
              expect(c).toBe(3);
            } catch (e) {
              done.fail(e)
            }
            done()
          }, 800);
        }, 400);
      }, 400);
    }, 200);
  }, 200);
});

test('throttle', done => {
  let c = 0;
  const throttle = f => _.throttle(f, 200);
  const onResolve = (val) => {c += 1;};
  const employees = createAsyncSelector({...params, onResolve, throttle}, state => state.text);
  employees({text: 'a'});
  setTimeout(() => {
    employees({text: 'b'});
    setTimeout(() => {
      employees({text: 'c'});
      setTimeout(() => {
        employees({text: 'd'});
        setTimeout(() => {
          employees({text: 'e'});
          setTimeout(() => {
            try {
              expect(c).toBe(2);
            } catch (e) {
              done.fail(e)
            }
            done()
          }, 60);
        }, 60);
      }, 60);
    }, 60);
  }, 60);
});

test('throttle', done => {
  let c = 0;
  const state = {text: 'Ma'};
  const throttle = f => _.throttle(f, 50);
  const onResolve = () => {c += 1};
  const employees = createAsyncSelector({...params, onResolve, throttle}, state => state.text);

  const expected = { 
    value: [],
    previous: ['Mark Metzger'],
    isWaiting: true,
    isResolved: false,
    isRejected: false 
  }

  employees(state);
  setTimeout(() => {
    employees({text: 'Marc'});
    const result = employees(state);
    try {
      expect(deepEqual(result, expected)).toBe(true);
    } catch (e) {
      done.fail(e)
    }
    done()
  },200)

});

test('throttle', done => {
  let c = 0;
  let state = {text: 'Ma'};
  const throttle = f => _.throttle(f, 50);
  const onResolve = () => {c += 1};
  const employees = createAsyncSelector({...params, onResolve, throttle}, state => state.text);

  const expected = { 
    value: 'Search Text Too Long',
    previous: ['Mark Metzger'],
    isWaiting: false,
    isResolved: false,
    isRejected: true, 
  }

  employees(state);
  setTimeout(() => {
    state = {text: 'aaaaaaaaaaaaaa'};
    employees(state);
    setTimeout(() => {
      const result = employees(state);
      try {
        expect(deepEqual(result, expected)).toBe(true);
      } catch (e) {
        done.fail(e)
      }
      done()
      
    }, 500);
  },200)
});

test('throttle memoization', done => {
  let c = 0;
  let state = {text: 'Ma'};
  const throttle = f => _.throttle(f, 50);
  const onResolve = () => {c += 1};
  const employees = createAsyncSelector({...params, onResolve, throttle}, state => state.text);

  const expected = { 
    value: 'Search Text Too Long',
    previous: ['Mark Metzger'],
    isWaiting: false,
    isResolved: false,
    isRejected: true, 
  }

  employees(state);
  employees(state);
  employees(state);
  employees(state);
  setTimeout(() => {
    state = {text: 'aaaaaaaaaaaaaa'};
    employees(state);
    setTimeout(() => {
      const result = employees(state);
      try {
        expect(c).toBe(1);
      } catch (e) {
        done.fail(e)
      }
      done();
    }, 500);
  },200)
});


function getAges(employees, maxAge) {
  
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const database = ["Mark Metzger", "Steven Miller"];
      const ages = [12, 34];
      if (maxAge < 3) {
        reject('too young');
      } else {
        const employeeAges = employees.map(name => {
          return ages[database.indexOf(name)]
        });
        resolve(employeeAges.filter(age => age <= maxAge));
      }
    }, 100);
  });
}

const params2 = {
  sync:(employees, ages) => [],
  async: getAges,
}

test('multiple params', () => {
  let c = 0;
  let state = {employees: ['Mark Metzger'], maxAge: 40};
  const ages = createAsyncSelector(params2, s => s.employees, s => s.maxAge);
  const result = ages(state);

  const expected = { 
    value: [],
    previous: undefined,
    isWaiting: true,
    isResolved: false,
    isRejected: false, 
  }

  expect(deepEqual(result, expected)).toBe(true);
  
});

test('multiple params2', done => {
  let c = 0;
  let state = {employees: ['Mark Metzger'], maxAge: 40};
  const ages = createAsyncSelector(params2, s => s.employees, s => s.maxAge);

  const expected = { 
    value: [12],
    previous: [12],
    isWaiting: false,
    isResolved: true,
    isRejected: false, 
  }
  
  ages(state);
  setTimeout(() => {
    const result = ages(state);
    try {
      expect(deepEqual(result, expected)).toBe(true);
    } catch (e) {
      done.fail(e)
    }
    done();
  }, 300);
});

test('multiple params3', done => {
  let c = 0;
  let state = {employees: ['Mark Metzger'], maxAge: 10};
  const ages = createAsyncSelector(params2, s => s.employees, s => s.maxAge);
  const result = ages(state);

  const expected = { 
    value: [],
    previous: [],
    isWaiting: false,
    isResolved: true,
    isRejected: false, 
  }

  ages(state);
  setTimeout(() => {
    const result = ages(state);
    
    try {
      expect(deepEqual(result, expected)).toBe(true);
    } catch (e) {
      done.fail(e)
    }
    done();
  }, 200);
});

test('debounced memoized', done => {
  let c = 0;
  let state = {employees: ['Mark Metzger'], maxAge: 10};
  const throttle = f => _.debounce(f, 100)
  const onResolve = () => {c++}
  const ages = createAsyncSelector(
    {...params2, throttle, onResolve }, 
    s => s.employees, 
    s => s.maxAge);

  ages(state);
  setTimeout(() => {
    ages(state);
    setTimeout(() => {
      ages(state);
      setTimeout(() => {
        ages(state);
        setTimeout(() => {
          ages(state);
          setTimeout(() => {
            try {
              expect(c).toBe(1);
            } catch (e) {
              done.fail(e)
            }
            done();
          }, 122);
        }, 122);
      }, 122);
    }, 120);
  }, 120);
});

test('debounced memoized 2', done => {
  let c = 0;
  let state = {employees: ['Mark Metzger'], maxAge: 10};
  const throttle = f => _.debounce(f, 100)
  const onResolve = () => {c++}
  const ages = createAsyncSelector(
    {...params2, throttle, onResolve }, 
    s => s.employees, 
    s => s.maxAge);


  ages(state);
  ages(state);
  setTimeout(() => {
    ages(state);
    setTimeout(() => {
      ages(state);
      setTimeout(() => {
        ages(state);
        setTimeout(() => {
          ages(state);
          setTimeout(() => {
            try {
              expect(c).toBe(1);
            } catch (e) {
              done.fail(e)
            }
            done();
          }, 122);
        }, 122);
      }, 122);
    }, 120);
  }, 120);
});

test('debounced memoized 3', done => {
  let c = 0;
  let state = {employees: ['Mark Metzger'], maxAge: 10};
  const throttle = f => _.debounce(f, 100)
  const onResolve = () => {c++}
  const ages = createAsyncSelector(
    {...params2, throttle, onResolve }, 
    s => s.employees, 
    s => s.maxAge);

  ages(state);
  ages(state);
  setTimeout(() => {
    ages(state);
    setTimeout(() => {
      ages(state);
      setTimeout(() => {
        ages({employees: ['Mark Metzger'], maxAge: 9})
        setTimeout(() => {
          ages(state);
          setTimeout(() => {
            try {
              expect(c).toBe(2);
            } catch (e) {
              done.fail(e)
            }
            done();
          }, 88);
        }, 188);
      }, 88);
    }, 80);
  }, 180);
});

test('debounced memoized 4', done => {
  let c = 0;
  let state = {employees: ['Mark Metzger'], maxAge: 100};
  const throttle = f => _.debounce(f, 100)
  const onResolve = () => {c++}
  const ages = createAsyncSelector(
    {...params2, throttle, onResolve }, 
    s => s.employees, 
    s => s.maxAge);

  const expected = { 
    value: [],
    previous: [],
    isWaiting: false,
    isResolved: true,
    isRejected: false, 
  }

  ages(state);
  ages(state);
  setTimeout(() => {
    ages(state);
    setTimeout(() => {
      ages(state);
      setTimeout(() => {
        const n = {employees: ['Mark Metzger'], maxAge: 9};
        ages(n);
        setTimeout(() => {
          ages(state);
          setTimeout(() => {
            const result = ages(n);
            try {
              expect(deepEqual(expected, result)).toBe(true);
            } catch (e) {
              done.fail(e)
            }
            done();
          }, 88);
        }, 188);
      }, 88);
    }, 80);
  }, 180);
});


test('debounced memoized 5', done => {
  let c = 0;
  let state = {employees: ['Mark Metzger'], maxAge: 10};
  const throttle = f => _.debounce(f, 100)
  const onResolve = () => {c++}
  const ages = createAsyncSelector(
    {...params2, throttle, onResolve }, 
    s => s.employees, 
    s => s.maxAge);

  const expected = { 
    value: [],
    previous: [12],
    isWaiting: true,
    isResolved: false,
    isRejected: false, 
  }

  ages(state);
  ages(state);
  setTimeout(() => {
    ages(state);
    setTimeout(() => {
      ages(state);
      setTimeout(() => {
        const n = {employees: ['Mark Metzger'], maxAge: 20};
        ages(n);
        setTimeout(() => {
          ages(state);
          setTimeout(() => {
            const result = ages({employees: ['Mark Metzger'], maxAge: 20});
            try {
              expect(deepEqual(expected, result)).toBe(true);
            } catch (e) {
              done.fail(e)
            }
            done();
          }, 88);
        }, 188);
      }, 88);
    }, 80);
  }, 180);
});

test('cancel result', () => {
  let state = {employees: ['Mark Metzger'], maxAge: 10};
  let result = null
  const onCancel = (promise, n, a) => {result=[n,a]}
  const ages = createAsyncSelector(
    {...params2, onCancel }, 
    s => s.employees, 
    s => s.maxAge);

  ages(state);
  ages({employees: ['Mark Metzger'], maxAge: 11});
  expect(deepEqual(result, [['Mark Metzger'], 10])).toBe(true);
});

test('resolve result', done => {
  let state = {employees: ['Mark Metzger'], maxAge: 10};
  let result = null
  const onResolve = (r, n, a) => {result=[r,n,a]}
  const ages = createAsyncSelector(
    {...params2, onResolve }, 
    s => s.employees, 
    s => s.maxAge);

  ages(state);
  ages(state);
  setTimeout(() => {
    try {
      expect(deepEqual(result, [[], ['Mark Metzger'], 10])).toBe(true);
    } catch (e) {
      done.fail(e)
    }
    done();
  }, 200);
});

test('reject result', done => {
  let state = {employees: ['Mark Metzger'], maxAge: 1};
  let result = null
  const onReject = (r, n, a) => {result=[r,n,a]}
  const ages = createAsyncSelector(
    {...params2, onReject }, 
    s => s.employees, 
    s => s.maxAge);

  ages(state);
  ages(state);
  setTimeout(() => {
    try {
      expect(deepEqual(result, ['too young', ['Mark Metzger'], 1])).toBe(true);
    } catch (e) {
      done.fail(e)
    }
    done();
  }, 200);
});

test('throttled and forced', done => {
  let state = {employees: ['Mark Metzger'], maxAge: 1};
  let result = null
  const throttle = f => _.debounce(f, 150);
  const onCancel = (r, n, a) => {result=[r,n,a]}
  const ages = createAsyncSelector(
    {...params2, throttle, onCancel}, 
    s => s.employees, 
    s => s.maxAge);

  ages(state);
  ages.forceUpdate(state);
  ages.forceUpdate(state);
  setTimeout(() => {
    try {
      expect(deepEqual(result, null)).toBe(true);
    } catch (e) {
      done.fail(e)
    }
    done();
  }, 200);
});

test('Throw error', () => {
  try {
    createAsyncSelector();
  } catch (e) {
    expect(e.message).toBe('An object of parameters must be passed in');
  }
});

test('selector.getResult', done => {
  let c = 0;
  let state = {employees: ['Mark Metzger'], maxAge: 10};
  const ages = createAsyncSelector(params2, s => s.employees, s => s.maxAge);
  const result = ages(state);

  const expected = { 
    value: [],
    previous: [],
    isWaiting: false,
    isResolved: true,
    isRejected: false, 
  }

  ages(state);
  setTimeout(() => {
    
    try {
      expect(deepEqual(ages.getResult(), expected)).toBe(true);
    } catch (e) {
      done.fail(e)
    }
    done();
  }, 200);
});


test('debounces only memoized version', done => {
  let state = {employees: ['Mark Metzger'], maxAge: 15};
  let result = null
  const throttle = f => _.debounce(f, 150);
  const ages = createAsyncSelector(
    {...params2, throttle}, 
    s => s.employees, 
    s => s.maxAge);

  const expected1 = { 
    value: [],
    previous: undefined,
    isWaiting: true,
    isResolved: false,
    isRejected: false, 
  }

  const expected2 = { 
    value: [12],
    previous: [12],
    isWaiting: false,
    isResolved: true,
    isRejected: false, 
  }

  const result1 = ages(state);
  expect(deepEqual(result1, expected1)).toBe(true);

  setTimeout(() => {
    const result2 = ages(state);
    expect(deepEqual(result2, expected1)).toBe(true);
    setTimeout(() => {
      const result3 = ages(state);
      expect(deepEqual(result3, expected1)).toBe(true);
      setTimeout(() => {
        const result4 = ages(state);
        expect(deepEqual(result4, expected2)).toBe(true);
        setTimeout(() => {
          const result5 = ages(state);
          expect(deepEqual(result5, expected2)).toBe(true);
          done();
        }, 100);
      }, 100);
    }, 100);
  }, 100);
});


test('sync by default returns undefined', done => {
  let state = {employees: ['Mark Metzger'], maxAge: 15};
  const ages = createAsyncSelector(
    {...params2, sync: null}, 
    [s => s.employees, 
    s => s.maxAge]);

  const expected1 = { 
    value: undefined,
    previous: undefined,
    isWaiting: true,
    isResolved: false,
    isRejected: false, 
  }

  const result = ages(state);
  expect(deepEqual(result, expected1)).toBe(true);
  done();
});


test('passed in state and props', done => {
  let state = {employees: ['Mark Metzger'], maxAge: 15};
  let props = { id: 'wow' };
  const ages = createAsyncSelector(
    {
      async: (concat) => new Promise((resolve) => {
        resolve(concat + '!');
      }),
    }, 
    [(s, props) => s.maxAge + props.id]);

  const expected1 = { 
    value: undefined,
    previous: undefined,
    isWaiting: true,
    isResolved: false,
    isRejected: false, 
  }

  const expected2 = { 
    value: '15wow!',
    previous: '15wow!',
    isWaiting: false,
    isResolved: true,
    isRejected: false, 
  }

  const result = ages(state, props);
  expect(deepEqual(result, expected1)).toBe(true);
  setTimeout(() => {
    const result2 = ages(state, props);
    expect(deepEqual(result2, expected2)).toBe(true);
    done();
  }, 10);
});


test('cancelling works as expected', done => {
  let state = {employees: ['Mark Metzger'], maxAge: 15};
  let success = false;
  const ages = createAsyncSelector(
    {
      async: (n) => {
        const promise = new Promise((resolve) => {
          setTimeout(() => resolve(n), 50);
        });
        promise.id = 'abc';
        return promise;
      },
      onCancel: (promise) => {
        success = (promise.id === 'abc' && success === false);
      }
    }, 
    [(s) => s.employees]
  );

  ages(state);
  ages(state);
  ages(state);
  state.employees = [];
  ages(state);
  setTimeout(() => {
    expect(success).toBe(true);
    done();
  });
  
});