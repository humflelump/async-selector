function validateParams(params) {
  if (typeof params !== "object" || params === null) {
    throw new Error("An object of parameters must be passed in");
  }
  if (typeof params.async !== "function") {
    throw new Error(
      'Looking for a function called "async". This function returns a promise which handles asynchronous code'
    );
  }
}

function hasChanged(oldValues, newValues) {
  if (oldValues === null) return true;
  if (oldValues.length !== newValues.length) return true;
  for (let i = 0; i < oldValues.length; i++) {
    if (newValues[i] !== oldValues[i]) {
      return true;
    }
  }
  return false;
}

function createResultObject(
  value,
  previous,
  isWaiting,
  isResolved,
  isRejected,
  omitStatus
) {
  if (omitStatus) return value;
  return { value, previous, isWaiting, isResolved, isRejected };
}

const emptyFunction = () => {};


export declare type Selector<S, R, P = undefined> = (state: S, props: P) => R;

export declare type AsyncSelectorResult<SyncReturn, AsyncReturn> = {
  isWaiting: boolean;
  isResolved: boolean;
  isRejected: boolean;
  value: SyncReturn | AsyncReturn;
  previous: SyncReturn | AsyncReturn | undefined;
};

export declare type AsyncSelector<State, SyncReturn, AsyncReturn, Props = undefined> = ((
  state: State,
  props?: Props
) => AsyncSelectorResult<SyncReturn, AsyncReturn>) & {
  forceUpdate: (
    state: State,
    props?: Props
  ) => AsyncSelectorResult<SyncReturn, AsyncReturn>;
  getResult: () => AsyncSelectorResult<SyncReturn, AsyncReturn>;
};

export function createAsyncSelector<
  State,
  AsyncReturn,
  Props = undefined,
  SyncReturn = undefined
>(params: {
  sync?: () => SyncReturn;
  async: () => Promise<AsyncReturn>;
  onResolve?: (result: AsyncReturn) => void;
  onReject?: (error: any) => void;
  onCancel?: (promise: Promise<AsyncReturn>) => void;
  shouldUseAsync?: () => boolean;
  omitStatus?: boolean;
  throttle?: (f: Function) => Function;
}): AsyncSelector<State, SyncReturn, AsyncReturn, Props>;

export function createAsyncSelector<State, R1, AsyncReturn, Props = undefined, SyncReturn = undefined>(
    params: {
        sync?: ((val1: R1) => SyncReturn),
        async: (val1: R1) => Promise<AsyncReturn>,
        onResolve?: (result: AsyncReturn, val1: R1) => void
        onReject?: (error: any, val1: R1) => void,
        onCancel?: (promise: Promise<AsyncReturn>, val1: R1) => void
        shouldUseAsync?: (val1: R1) => boolean,
        omitStatus?: boolean,
        throttle?: (f: Function) => Function,
    },
    s1: Selector<State, R1, Props>
) : AsyncSelector<State, SyncReturn, AsyncReturn, Props>;

export function createAsyncSelector<State, R1, AsyncReturn, Props = undefined, SyncReturn = undefined>(
    params: {
        sync?: ((val1: R1) => SyncReturn),
        async: (val1: R1) => Promise<AsyncReturn>,
        onResolve?: (result: AsyncReturn, val1: R1) => void
        onReject?: (error: any, val1: R1) => void,
        onCancel?: (promise: Promise<AsyncReturn>, val1: R1) => void
        shouldUseAsync?: (val1: R1) => boolean,
        omitStatus?: boolean,
        throttle?: (f: Function) => Function,
    },
    selectors: [Selector<State, R1, Props>]
) : AsyncSelector<State, SyncReturn, AsyncReturn, Props>;


export function createAsyncSelector<State, R1, R2, AsyncReturn, Props = undefined, SyncReturn = undefined>(
    params: {
        sync?: ((val1: R1, val2: R2) => SyncReturn),
        async: (val1: R1, val2: R2) => Promise<AsyncReturn>,
        onResolve?: (result: AsyncReturn, val1: R1, val2: R2) => void
        onReject?: (error: any, val1: R1, val2: R2) => void,
        onCancel?: (promise: Promise<AsyncReturn>, val1: R1, val2: R2) => void
        shouldUseAsync?: (val1: R1, val2: R2) => boolean,
        omitStatus?: boolean,
        throttle?: (f: Function) => Function,
    },
    s1: Selector<State, R1, Props>, s2: Selector<State, R2, Props>
) : AsyncSelector<State, SyncReturn, AsyncReturn, Props>;

export function createAsyncSelector<State, R1, R2, AsyncReturn, Props = undefined, SyncReturn = undefined>(
    params: {
        sync?: ((val1: R1, val2: R2) => SyncReturn),
        async: (val1: R1, val2: R2) => Promise<AsyncReturn>,
        onResolve?: (result: AsyncReturn, val1: R1, val2: R2) => void
        onReject?: (error: any, val1: R1, val2: R2) => void,
        onCancel?: (promise: Promise<AsyncReturn>, val1: R1, val2: R2) => void
        shouldUseAsync?: (val1: R1, val2: R2) => boolean,
        omitStatus?: boolean,
        throttle?: (f: Function) => Function,
    },
    selectors: [Selector<State, R1, Props>, Selector<State, R2, Props>]
) : AsyncSelector<State, SyncReturn, AsyncReturn, Props>;


export function createAsyncSelector<State, R1, R2, R3, AsyncReturn, Props = undefined, SyncReturn = undefined>(
    params: {
        sync?: ((val1: R1, val2: R2, val3: R3) => SyncReturn),
        async: (val1: R1, val2: R2, val3: R3) => Promise<AsyncReturn>,
        onResolve?: (result: AsyncReturn, val1: R1, val2: R2, val3: R3) => void
        onReject?: (error: any, val1: R1, val2: R2, val3: R3) => void,
        onCancel?: (promise: Promise<AsyncReturn>, val1: R1, val2: R2, val3: R3) => void
        shouldUseAsync?: (val1: R1, val2: R2, val3: R3) => boolean,
        omitStatus?: boolean,
        throttle?: (f: Function) => Function,
    },
    s1: Selector<State, R1, Props>, s2: Selector<State, R2, Props>, s3: Selector<State, R3, Props>
) : AsyncSelector<State, SyncReturn, AsyncReturn, Props>;

export function createAsyncSelector<State, R1, R2, R3, AsyncReturn, Props = undefined, SyncReturn = undefined>(
    params: {
        sync?: ((val1: R1, val2: R2, val3: R3) => SyncReturn),
        async: (val1: R1, val2: R2, val3: R3) => Promise<AsyncReturn>,
        onResolve?: (result: AsyncReturn, val1: R1, val2: R2, val3: R3) => void
        onReject?: (error: any, val1: R1, val2: R2, val3: R3) => void,
        onCancel?: (promise: Promise<AsyncReturn>, val1: R1, val2: R2, val3: R3) => void
        shouldUseAsync?: (val1: R1, val2: R2, val3: R3) => boolean,
        omitStatus?: boolean,
        throttle?: (f: Function) => Function,
    },
    selectors: [Selector<State, R1, Props>, Selector<State, R2, Props>, Selector<State, R3, Props>]
) : AsyncSelector<State, SyncReturn, AsyncReturn, Props>;


export function createAsyncSelector<State, R1, R2, R3, R4, AsyncReturn, Props = undefined, SyncReturn = undefined>(
    params: {
        sync?: ((val1: R1, val2: R2, val3: R3, val4: R4) => SyncReturn),
        async: (val1: R1, val2: R2, val3: R3, val4: R4) => Promise<AsyncReturn>,
        onResolve?: (result: AsyncReturn, val1: R1, val2: R2, val3: R3, val4: R4) => void
        onReject?: (error: any, val1: R1, val2: R2, val3: R3, val4: R4) => void,
        onCancel?: (promise: Promise<AsyncReturn>, val1: R1, val2: R2, val3: R3, val4: R4) => void
        shouldUseAsync?: (val1: R1, val2: R2, val3: R3, val4: R4) => boolean,
        omitStatus?: boolean,
        throttle?: (f: Function) => Function,
    },
    s1: Selector<State, R1, Props>, s2: Selector<State, R2, Props>, s3: Selector<State, R3, Props>, s4: Selector<State, R4, Props>
) : AsyncSelector<State, SyncReturn, AsyncReturn, Props>;

export function createAsyncSelector<State, R1, R2, R3, R4, AsyncReturn, Props = undefined, SyncReturn = undefined>(
    params: {
        sync?: ((val1: R1, val2: R2, val3: R3, val4: R4) => SyncReturn),
        async: (val1: R1, val2: R2, val3: R3, val4: R4) => Promise<AsyncReturn>,
        onResolve?: (result: AsyncReturn, val1: R1, val2: R2, val3: R3, val4: R4) => void
        onReject?: (error: any, val1: R1, val2: R2, val3: R3, val4: R4) => void,
        onCancel?: (promise: Promise<AsyncReturn>, val1: R1, val2: R2, val3: R3, val4: R4) => void
        shouldUseAsync?: (val1: R1, val2: R2, val3: R3, val4: R4) => boolean,
        omitStatus?: boolean,
        throttle?: (f: Function) => Function,
    },
    selectors: [Selector<State, R1, Props>, Selector<State, R2, Props>, Selector<State, R3, Props>, Selector<State, R4, Props>]
) : AsyncSelector<State, SyncReturn, AsyncReturn, Props>;


export function createAsyncSelector<State, R1, R2, R3, R4, R5, AsyncReturn, Props = undefined, SyncReturn = undefined>(
    params: {
        sync?: ((val1: R1, val2: R2, val3: R3, val4: R4, val5: R5) => SyncReturn),
        async: (val1: R1, val2: R2, val3: R3, val4: R4, val5: R5) => Promise<AsyncReturn>,
        onResolve?: (result: AsyncReturn, val1: R1, val2: R2, val3: R3, val4: R4, val5: R5) => void
        onReject?: (error: any, val1: R1, val2: R2, val3: R3, val4: R4, val5: R5) => void,
        onCancel?: (promise: Promise<AsyncReturn>, val1: R1, val2: R2, val3: R3, val4: R4, val5: R5) => void
        shouldUseAsync?: (val1: R1, val2: R2, val3: R3, val4: R4, val5: R5) => boolean,
        omitStatus?: boolean,
        throttle?: (f: Function) => Function,
    },
    s1: Selector<State, R1, Props>, s2: Selector<State, R2, Props>, s3: Selector<State, R3, Props>, s4: Selector<State, R4, Props>, s5: Selector<State, R5, Props>
) : AsyncSelector<State, SyncReturn, AsyncReturn, Props>;

export function createAsyncSelector<State, R1, R2, R3, R4, R5, AsyncReturn, Props = undefined, SyncReturn = undefined>(
    params: {
        sync?: ((val1: R1, val2: R2, val3: R3, val4: R4, val5: R5) => SyncReturn),
        async: (val1: R1, val2: R2, val3: R3, val4: R4, val5: R5) => Promise<AsyncReturn>,
        onResolve?: (result: AsyncReturn, val1: R1, val2: R2, val3: R3, val4: R4, val5: R5) => void
        onReject?: (error: any, val1: R1, val2: R2, val3: R3, val4: R4, val5: R5) => void,
        onCancel?: (promise: Promise<AsyncReturn>, val1: R1, val2: R2, val3: R3, val4: R4, val5: R5) => void
        shouldUseAsync?: (val1: R1, val2: R2, val3: R3, val4: R4, val5: R5) => boolean,
        omitStatus?: boolean,
        throttle?: (f: Function) => Function,
    },
    selectors: [Selector<State, R1, Props>, Selector<State, R2, Props>, Selector<State, R3, Props>, Selector<State, R4, Props>, Selector<State, R5, Props>]
) : AsyncSelector<State, SyncReturn, AsyncReturn, Props>;


export function createAsyncSelector<State, R1, R2, R3, R4, R5, R6, AsyncReturn, Props = undefined, SyncReturn = undefined>(
    params: {
        sync?: ((val1: R1, val2: R2, val3: R3, val4: R4, val5: R5, val6: R6) => SyncReturn),
        async: (val1: R1, val2: R2, val3: R3, val4: R4, val5: R5, val6: R6) => Promise<AsyncReturn>,
        onResolve?: (result: AsyncReturn, val1: R1, val2: R2, val3: R3, val4: R4, val5: R5, val6: R6) => void
        onReject?: (error: any, val1: R1, val2: R2, val3: R3, val4: R4, val5: R5, val6: R6) => void,
        onCancel?: (promise: Promise<AsyncReturn>, val1: R1, val2: R2, val3: R3, val4: R4, val5: R5, val6: R6) => void
        shouldUseAsync?: (val1: R1, val2: R2, val3: R3, val4: R4, val5: R5, val6: R6) => boolean,
        omitStatus?: boolean,
        throttle?: (f: Function) => Function,
    },
    s1: Selector<State, R1, Props>, s2: Selector<State, R2, Props>, s3: Selector<State, R3, Props>, s4: Selector<State, R4, Props>, s5: Selector<State, R5, Props>, s6: Selector<State, R6, Props>
) : AsyncSelector<State, SyncReturn, AsyncReturn, Props>;

export function createAsyncSelector<State, R1, R2, R3, R4, R5, R6, AsyncReturn, Props = undefined, SyncReturn = undefined>(
    params: {
        sync?: ((val1: R1, val2: R2, val3: R3, val4: R4, val5: R5, val6: R6) => SyncReturn),
        async: (val1: R1, val2: R2, val3: R3, val4: R4, val5: R5, val6: R6) => Promise<AsyncReturn>,
        onResolve?: (result: AsyncReturn, val1: R1, val2: R2, val3: R3, val4: R4, val5: R5, val6: R6) => void
        onReject?: (error: any, val1: R1, val2: R2, val3: R3, val4: R4, val5: R5, val6: R6) => void,
        onCancel?: (promise: Promise<AsyncReturn>, val1: R1, val2: R2, val3: R3, val4: R4, val5: R5, val6: R6) => void
        shouldUseAsync?: (val1: R1, val2: R2, val3: R3, val4: R4, val5: R5, val6: R6) => boolean,
        omitStatus?: boolean,
        throttle?: (f: Function) => Function,
    },
    selectors: [Selector<State, R1, Props>, Selector<State, R2, Props>, Selector<State, R3, Props>, Selector<State, R4, Props>, Selector<State, R5, Props>, Selector<State, R6, Props>]
) : AsyncSelector<State, SyncReturn, AsyncReturn, Props>;


export function createAsyncSelector<State, R1, R2, R3, R4, R5, R6, R7, AsyncReturn, Props = undefined, SyncReturn = undefined>(
    params: {
        sync?: ((val1: R1, val2: R2, val3: R3, val4: R4, val5: R5, val6: R6, val7: R7) => SyncReturn),
        async: (val1: R1, val2: R2, val3: R3, val4: R4, val5: R5, val6: R6, val7: R7) => Promise<AsyncReturn>,
        onResolve?: (result: AsyncReturn, val1: R1, val2: R2, val3: R3, val4: R4, val5: R5, val6: R6, val7: R7) => void
        onReject?: (error: any, val1: R1, val2: R2, val3: R3, val4: R4, val5: R5, val6: R6, val7: R7) => void,
        onCancel?: (promise: Promise<AsyncReturn>, val1: R1, val2: R2, val3: R3, val4: R4, val5: R5, val6: R6, val7: R7) => void
        shouldUseAsync?: (val1: R1, val2: R2, val3: R3, val4: R4, val5: R5, val6: R6, val7: R7) => boolean,
        omitStatus?: boolean,
        throttle?: (f: Function) => Function,
    },
    s1: Selector<State, R1, Props>, s2: Selector<State, R2, Props>, s3: Selector<State, R3, Props>, s4: Selector<State, R4, Props>, s5: Selector<State, R5, Props>, s6: Selector<State, R6, Props>, s7: Selector<State, R7, Props>
) : AsyncSelector<State, SyncReturn, AsyncReturn, Props>;

export function createAsyncSelector<State, R1, R2, R3, R4, R5, R6, R7, AsyncReturn, Props = undefined, SyncReturn = undefined>(
    params: {
        sync?: ((val1: R1, val2: R2, val3: R3, val4: R4, val5: R5, val6: R6, val7: R7) => SyncReturn),
        async: (val1: R1, val2: R2, val3: R3, val4: R4, val5: R5, val6: R6, val7: R7) => Promise<AsyncReturn>,
        onResolve?: (result: AsyncReturn, val1: R1, val2: R2, val3: R3, val4: R4, val5: R5, val6: R6, val7: R7) => void
        onReject?: (error: any, val1: R1, val2: R2, val3: R3, val4: R4, val5: R5, val6: R6, val7: R7) => void,
        onCancel?: (promise: Promise<AsyncReturn>, val1: R1, val2: R2, val3: R3, val4: R4, val5: R5, val6: R6, val7: R7) => void
        shouldUseAsync?: (val1: R1, val2: R2, val3: R3, val4: R4, val5: R5, val6: R6, val7: R7) => boolean,
        omitStatus?: boolean,
        throttle?: (f: Function) => Function,
    },
    selectors: [Selector<State, R1, Props>, Selector<State, R2, Props>, Selector<State, R3, Props>, Selector<State, R4, Props>, Selector<State, R5, Props>, Selector<State, R6, Props>, Selector<State, R7, Props>]
) : AsyncSelector<State, SyncReturn, AsyncReturn, Props>;


export function createAsyncSelector<State, R1, R2, R3, R4, R5, R6, R7, R8, AsyncReturn, Props = undefined, SyncReturn = undefined>(
    params: {
        sync?: ((val1: R1, val2: R2, val3: R3, val4: R4, val5: R5, val6: R6, val7: R7, val8: R8) => SyncReturn),
        async: (val1: R1, val2: R2, val3: R3, val4: R4, val5: R5, val6: R6, val7: R7, val8: R8) => Promise<AsyncReturn>,
        onResolve?: (result: AsyncReturn, val1: R1, val2: R2, val3: R3, val4: R4, val5: R5, val6: R6, val7: R7, val8: R8) => void
        onReject?: (error: any, val1: R1, val2: R2, val3: R3, val4: R4, val5: R5, val6: R6, val7: R7, val8: R8) => void,
        onCancel?: (promise: Promise<AsyncReturn>, val1: R1, val2: R2, val3: R3, val4: R4, val5: R5, val6: R6, val7: R7, val8: R8) => void
        shouldUseAsync?: (val1: R1, val2: R2, val3: R3, val4: R4, val5: R5, val6: R6, val7: R7, val8: R8) => boolean,
        omitStatus?: boolean,
        throttle?: (f: Function) => Function,
    },
    s1: Selector<State, R1, Props>, s2: Selector<State, R2, Props>, s3: Selector<State, R3, Props>, s4: Selector<State, R4, Props>, s5: Selector<State, R5, Props>, s6: Selector<State, R6, Props>, s7: Selector<State, R7, Props>, s8: Selector<State, R8, Props>
) : AsyncSelector<State, SyncReturn, AsyncReturn, Props>;

export function createAsyncSelector<State, R1, R2, R3, R4, R5, R6, R7, R8, AsyncReturn, Props = undefined, SyncReturn = undefined>(
    params: {
        sync?: ((val1: R1, val2: R2, val3: R3, val4: R4, val5: R5, val6: R6, val7: R7, val8: R8) => SyncReturn),
        async: (val1: R1, val2: R2, val3: R3, val4: R4, val5: R5, val6: R6, val7: R7, val8: R8) => Promise<AsyncReturn>,
        onResolve?: (result: AsyncReturn, val1: R1, val2: R2, val3: R3, val4: R4, val5: R5, val6: R6, val7: R7, val8: R8) => void
        onReject?: (error: any, val1: R1, val2: R2, val3: R3, val4: R4, val5: R5, val6: R6, val7: R7, val8: R8) => void,
        onCancel?: (promise: Promise<AsyncReturn>, val1: R1, val2: R2, val3: R3, val4: R4, val5: R5, val6: R6, val7: R7, val8: R8) => void
        shouldUseAsync?: (val1: R1, val2: R2, val3: R3, val4: R4, val5: R5, val6: R6, val7: R7, val8: R8) => boolean,
        omitStatus?: boolean,
        throttle?: (f: Function) => Function,
    },
    selectors: [Selector<State, R1, Props>, Selector<State, R2, Props>, Selector<State, R3, Props>, Selector<State, R4, Props>, Selector<State, R5, Props>, Selector<State, R6, Props>, Selector<State, R7, Props>, Selector<State, R8, Props>]
) : AsyncSelector<State, SyncReturn, AsyncReturn, Props>;

export function createAsyncSelector(params, ...selectors) {
  validateParams(params);

  // if they passed in an array
  if (selectors.length === 1 && Array.isArray(selectors[0])) {
    selectors = selectors[0];
  }

  // User inputs
  let {
    sync,
    async,
    onReject,
    onResolve,
    onCancel,
    shouldUseAsync,
    omitStatus,
    throttle
  } = params;
  sync = typeof sync === "function" ? sync : emptyFunction;
  onReject = typeof onReject === "function" ? onReject : emptyFunction;
  onResolve = typeof onResolve === "function" ? onResolve : emptyFunction;
  onCancel = typeof onCancel === "function" ? onCancel : emptyFunction;
  shouldUseAsync =
    typeof shouldUseAsync === "function" ? shouldUseAsync : () => true;
  omitStatus = omitStatus === void 0 ? false : omitStatus;
  throttle = typeof throttle === "function" ? throttle : null;

  //selector state
  let memoizedResult = null;
  let isPromisePending = false;
  let oldInputs: any = null;
  let oldPromise = null;
  let previousResolution = void 0;
  let f: any = null;

  const func: any = (state, props, forceUpdate = false, internal = false) => {
    const mapped = selectors.map(f => f(state, props));
    const changed = forceUpdate || hasChanged(oldInputs, mapped);
    if (changed) {
      /*  Handle throttling / debouncing if required */
      if (f !== null && internal === false) {
        f(state, props, forceUpdate);
        memoizedResult = createResultObject(
          sync(...mapped),
          previousResolution,
          true,
          false,
          false,
          omitStatus
        );
        return memoizedResult;
      }
      /* //////////////////////////////////////////// */

      if (isPromisePending) {
        onCancel(oldPromise, ...oldInputs);
      }
      oldInputs = mapped;

      memoizedResult = createResultObject(
        sync(...mapped),
        previousResolution,
        true,
        false,
        false,
        omitStatus
      );

      if (!shouldUseAsync(...mapped)) {
        return memoizedResult;
      }
      const promise = params.async(...mapped);
      oldPromise = promise;
      isPromisePending = true;
      promise
        .then(promiseResolution => {
          if (!hasChanged(oldInputs, mapped)) {
            previousResolution = promiseResolution;
            isPromisePending = false;
            memoizedResult = createResultObject(
              promiseResolution,
              previousResolution,
              false,
              true,
              false,
              omitStatus
            );
            onResolve(promiseResolution, ...mapped);
          }
        })
        .catch(promiseRejection => {
          if (!hasChanged(oldInputs, mapped)) {
            isPromisePending = false;
            memoizedResult = createResultObject(
              promiseRejection,
              previousResolution,
              false,
              false,
              true,
              omitStatus
            );
            onReject(promiseRejection, ...mapped);
          }
        });
    }
    // If the inputs didn't change, simply return the old memoized result
    return memoizedResult;
  };
  if (throttle !== null && f === null) {
    const throttled = throttle((state, props) =>
      func(state, props, true, true)
    );
    let old: any = null;
    f = (state, props) => {
      const New = selectors.map(s => s(state, props));
      if (hasChanged(old, New)) {
        old = New;
        throttled(state, props);
      }
    };
  }
  func.forceUpdate = (state, props) => {
    return func(state, props, true, false);
  };
  func.getResult = () => memoizedResult;
  return func;
}

export default createAsyncSelector;
