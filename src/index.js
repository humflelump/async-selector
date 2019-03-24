function validateParams(params) {
    if (typeof params !== 'object' || params === null) {
        throw new Error('An object of parameters must be passed in');
    }
    if (typeof params.async !== 'function') {
        throw new Error('Looking for a function called "async". This function returns a promise which handles asynchronous code');
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

function createResultObject(value, previous, isWaiting, isResolved, isRejected, omitStatus) {
    if (omitStatus) return value;
    return {value, previous, isWaiting, isResolved, isRejected};
}

const emptyFunction = () => {};

function createAsyncSelector(params, ...selectors) {
    validateParams(params);


    // if they passed in an array
    if (selectors.length === 1 && Array.isArray(selectors[0])) {
        selectors = selectors[0];
    } 

    // User inputs
    let {sync, async, onReject, onResolve, onCancel, shouldUseAsync, omitStatus, throttle} = params;
    sync = typeof sync === 'function' ? sync : emptyFunction;
    onReject = typeof onReject === 'function' ? onReject : emptyFunction;
    onResolve = typeof onResolve === 'function' ? onResolve : emptyFunction;
    onCancel = typeof onCancel === 'function' ? onCancel : emptyFunction;
    shouldUseAsync = typeof shouldUseAsync === 'function' ? shouldUseAsync : () => true;
    omitStatus = omitStatus === (void 0) ? false : omitStatus;
    throttle = typeof throttle === 'function' ? throttle : null;

    //selector state
    let memoizedResult = null;
    let isPromisePending = false;
    let oldInputs = null;
    let oldPromise = null;
    let previousResolution = void 0;
    let f = null;

    const func = (state, props, forceUpdate = false, internal = false) => {
        const mapped = selectors.map(f => f(state, props));
        const changed = forceUpdate || hasChanged(oldInputs, mapped);
        if (changed) {
            /*  Handle throttling / debouncing if required */
            if (f !== null && internal === false) {
                f(state, props, forceUpdate);
                memoizedResult = createResultObject(sync(...mapped), previousResolution, true, false, false, omitStatus);
                return memoizedResult;
            }
            /* //////////////////////////////////////////// */
            
            if (isPromisePending) {
                onCancel(oldPromise, ...oldInputs);
            }
            oldInputs = mapped;

            memoizedResult = createResultObject(sync(...mapped), previousResolution, true, false, false, omitStatus);
            
            if (!shouldUseAsync(...mapped)) {
                return memoizedResult;
            }
            const promise = params.async(...mapped);
            oldPromise = promise;
            isPromisePending = true;
            promise.then((promiseResolution) => {
                if (!hasChanged(oldInputs, mapped)) {
                    previousResolution = promiseResolution;
                    isPromisePending = false;
                    memoizedResult = createResultObject(promiseResolution, previousResolution, false, true, false, omitStatus);
                    onResolve(promiseResolution, ...mapped)
                }
            }).catch((promiseRejection) => {
                if (!hasChanged(oldInputs, mapped)) {
                    isPromisePending = false;
                    memoizedResult = createResultObject(promiseRejection, previousResolution, false, false, true, omitStatus);
                    onReject(promiseRejection, ...mapped)
                }
            })
		}
		// If the inputs didn't change, simply return the old memoized result
        return memoizedResult;
    };
    if (throttle !== null && f === null) {
        const throttled = throttle((state, props) => func(state, props, true, true));
        let old = null;
        f = (state, props) => {
            const New = selectors.map(s => s(state, props));
            if (hasChanged(old, New)) {
                old = New;
                throttled(state, props);
            }
        }
    }
    func.forceUpdate = (state, props) => {
        return func(state, props, true, false);
    }
    func.getResult = () => memoizedResult;
    return func;
}

export default createAsyncSelector;