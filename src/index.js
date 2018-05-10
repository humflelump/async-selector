function validateParams(params) {
    if (typeof params !== 'object' || params === null) {
        throw new Exception('An object of parameters must be passed in');
    }
    if (typeof params.sync !== 'function') {
        throw new Exception('Looking for a function called "sync". This function is called to before the promise resolves');
    }
    if (typeof params.async !== 'function') {
        throw new Exception('Looking for a function called "async". This function returns a promise which handles asynchronous code');
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

    // User inputs
    let {sync, async, onReject, onResolve, onCancel, shouldUseAsync, omitStatus, throttle} = params;
    onReject = typeof onReject === 'function' ? onReject : emptyFunction;
    onResolve = typeof onResolve === 'function' ? onResolve : emptyFunction;
    onCancel = typeof onCancel === 'function' ? onCancel : emptyFunction;
    shouldUseAsync = typeof shouldUseAsync === 'function' ? shouldUseAsync : () => true;
    omitStatus = omitStatus === undefined ? false : omitStatus;
    throttle = typeof throttle === 'function' ? throttle : null;

    //selector state
    let memoizedResult = null;
    let isPromisePending = false;
    let oldInputs = null;
    let previousResolution = undefined;
    let f = null;

    const func = (state, forceUpdate = false, internal = false) => {
        const mapped = selectors.map(f => f(state));
        const changed = forceUpdate || hasChanged(oldInputs, mapped);
        //console.log(changed, mapped, internal)
        if (changed) {
            
            /*  Handle throttling / debouncing if required */
            if (throttle !== null && f === null) {
                f = throttle((state) => func(state, true, true));
            }
            if (f !== null && internal === false) {
                f(state, forceUpdate);
                memoizedResult = createResultObject(sync(...mapped), previousResolution, true, false, false, omitStatus);
                return memoizedResult;
            }
            /* //////////////////////////////////////////// */
            
            if (isPromisePending) {
                onCancel(promise, ...oldInputs);
            }
            oldInputs = mapped;

            memoizedResult = createResultObject(sync(...mapped), previousResolution, true, false, false, omitStatus);
            
            if (!shouldUseAsync(...mapped)) {
                return memoizedResult;
            }
            const promise = params.async(...mapped);
            isPromisePending = true;
            promise.then((promiseResolution) => {
                //console.log('resolution', promiseResolution, hasChanged(oldInputs, mapped))
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
    return func;
}

export default createAsyncSelector;