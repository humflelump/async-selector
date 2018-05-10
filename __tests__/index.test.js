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

test('cancel', done => {
  const onCancel = () => {count += 1};
  const employees = createAsyncSelector({...params, onCancel}, state => state.text);

  count = 0;
  employees(state);
  employees(state, true);
  setTimeout(() => {
    employees(state, true);
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
    employees(state, true);
    setTimeout(() => {
      employees(state, true);
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
      employees(state, true);
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
  const onResolve = (val) => {console.log(val); c += 1;};
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
            console.log(result);
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
