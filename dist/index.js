"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function validateParams(params) {
    if (typeof params !== "object" || params === null) {
        throw new Error("An object of parameters must be passed in");
    }
    if (typeof params.async !== "function") {
        throw new Error('Looking for a function called "async". This function returns a promise which handles asynchronous code');
    }
}
function hasChanged(oldValues, newValues) {
    if (oldValues === null)
        return true;
    if (oldValues.length !== newValues.length)
        return true;
    for (var i = 0; i < oldValues.length; i++) {
        if (newValues[i] !== oldValues[i]) {
            return true;
        }
    }
    return false;
}
function createResultObject(value, previous, isWaiting, isResolved, isRejected, omitStatus) {
    if (omitStatus)
        return value;
    return { value: value, previous: previous, isWaiting: isWaiting, isResolved: isResolved, isRejected: isRejected };
}
var emptyFunction = function () { };
function createAsyncSelector(params) {
    var selectors = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        selectors[_i - 1] = arguments[_i];
    }
    validateParams(params);
    // if they passed in an array
    if (selectors.length === 1 && Array.isArray(selectors[0])) {
        selectors = selectors[0];
    }
    // User inputs
    var sync = params.sync, async = params.async, onReject = params.onReject, onResolve = params.onResolve, onCancel = params.onCancel, shouldUseAsync = params.shouldUseAsync, omitStatus = params.omitStatus, throttle = params.throttle;
    sync = typeof sync === "function" ? sync : emptyFunction;
    onReject = typeof onReject === "function" ? onReject : emptyFunction;
    onResolve = typeof onResolve === "function" ? onResolve : emptyFunction;
    onCancel = typeof onCancel === "function" ? onCancel : emptyFunction;
    shouldUseAsync =
        typeof shouldUseAsync === "function" ? shouldUseAsync : function () { return true; };
    omitStatus = omitStatus === void 0 ? false : omitStatus;
    throttle = typeof throttle === "function" ? throttle : null;
    //selector state
    var memoizedResult = null;
    var isPromisePending = false;
    var oldInputs = null;
    var oldPromise = null;
    var previousResolution = void 0;
    var f = null;
    var func = function (state, props, forceUpdate, internal) {
        if (forceUpdate === void 0) { forceUpdate = false; }
        if (internal === void 0) { internal = false; }
        var mapped = selectors.map(function (f) { return f(state, props); });
        var changed = forceUpdate || hasChanged(oldInputs, mapped);
        if (changed) {
            /*  Handle throttling / debouncing if required */
            if (f !== null && internal === false) {
                f(state, props, forceUpdate);
                memoizedResult = createResultObject(sync.apply(void 0, mapped), previousResolution, true, false, false, omitStatus);
                return memoizedResult;
            }
            /* //////////////////////////////////////////// */
            if (isPromisePending) {
                onCancel.apply(void 0, [oldPromise].concat(oldInputs));
            }
            oldInputs = mapped;
            memoizedResult = createResultObject(sync.apply(void 0, mapped), previousResolution, true, false, false, omitStatus);
            if (!shouldUseAsync.apply(void 0, mapped)) {
                return memoizedResult;
            }
            var promise = params.async.apply(params, mapped);
            oldPromise = promise;
            isPromisePending = true;
            promise
                .then(function (promiseResolution) {
                if (!hasChanged(oldInputs, mapped)) {
                    previousResolution = promiseResolution;
                    isPromisePending = false;
                    memoizedResult = createResultObject(promiseResolution, previousResolution, false, true, false, omitStatus);
                    onResolve.apply(void 0, [promiseResolution].concat(mapped));
                }
            })
                .catch(function (promiseRejection) {
                if (!hasChanged(oldInputs, mapped)) {
                    isPromisePending = false;
                    memoizedResult = createResultObject(promiseRejection, previousResolution, false, false, true, omitStatus);
                    onReject.apply(void 0, [promiseRejection].concat(mapped));
                }
            });
        }
        // If the inputs didn't change, simply return the old memoized result
        return memoizedResult;
    };
    if (throttle !== null && f === null) {
        var throttled_1 = throttle(function (state, props) {
            return func(state, props, true, true);
        });
        var old_1 = null;
        f = function (state, props) {
            var New = selectors.map(function (s) { return s(state, props); });
            if (hasChanged(old_1, New)) {
                old_1 = New;
                throttled_1(state, props);
            }
        };
    }
    func.forceUpdate = function (state, props) {
        return func(state, props, true, false);
    };
    func.getResult = function () { return memoizedResult; };
    return func;
}
exports.createAsyncSelector = createAsyncSelector;
exports.default = createAsyncSelector;
