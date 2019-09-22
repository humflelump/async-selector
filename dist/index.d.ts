export declare type Selector<S, R, P = undefined> = (state: S, props: P) => R;
export declare type AsyncSelectorResult<SyncReturn, AsyncReturn> = {
    isWaiting: boolean;
    isResolved: boolean;
    isRejected: boolean;
    value: SyncReturn | AsyncReturn;
    previous: SyncReturn | AsyncReturn | undefined;
};
export declare type AsyncSelector<State, SyncReturn, AsyncReturn, Props = undefined> = ((state: State, props?: Props) => AsyncSelectorResult<SyncReturn, AsyncReturn>) & {
    forceUpdate: (state: State, props?: Props) => AsyncSelectorResult<SyncReturn, AsyncReturn>;
    getResult: () => AsyncSelectorResult<SyncReturn, AsyncReturn>;
};
export declare function createAsyncSelector<State, AsyncReturn, Props = undefined, SyncReturn = undefined>(params: {
    sync?: () => SyncReturn;
    async: () => Promise<AsyncReturn>;
    onResolve?: (result: AsyncReturn) => void;
    onReject?: (error: any) => void;
    onCancel?: (promise: Promise<AsyncReturn>) => void;
    shouldUseAsync?: () => boolean;
    omitStatus?: boolean;
    throttle?: (f: Function) => Function;
}): AsyncSelector<State, SyncReturn, AsyncReturn, Props>;
export declare function createAsyncSelector<State, R1, AsyncReturn, Props = undefined, SyncReturn = undefined>(params: {
    sync?: ((val1: R1) => SyncReturn);
    async: (val1: R1) => Promise<AsyncReturn>;
    onResolve?: (result: AsyncReturn, val1: R1) => void;
    onReject?: (error: any, val1: R1) => void;
    onCancel?: (promise: Promise<AsyncReturn>, val1: R1) => void;
    shouldUseAsync?: (val1: R1) => boolean;
    omitStatus?: boolean;
    throttle?: (f: Function) => Function;
}, s1: Selector<State, R1, Props>): AsyncSelector<State, SyncReturn, AsyncReturn, Props>;
export declare function createAsyncSelector<State, R1, AsyncReturn, Props = undefined, SyncReturn = undefined>(params: {
    sync?: ((val1: R1) => SyncReturn);
    async: (val1: R1) => Promise<AsyncReturn>;
    onResolve?: (result: AsyncReturn, val1: R1) => void;
    onReject?: (error: any, val1: R1) => void;
    onCancel?: (promise: Promise<AsyncReturn>, val1: R1) => void;
    shouldUseAsync?: (val1: R1) => boolean;
    omitStatus?: boolean;
    throttle?: (f: Function) => Function;
}, selectors: [Selector<State, R1, Props>]): AsyncSelector<State, SyncReturn, AsyncReturn, Props>;
export declare function createAsyncSelector<State, R1, R2, AsyncReturn, Props = undefined, SyncReturn = undefined>(params: {
    sync?: ((val1: R1, val2: R2) => SyncReturn);
    async: (val1: R1, val2: R2) => Promise<AsyncReturn>;
    onResolve?: (result: AsyncReturn, val1: R1, val2: R2) => void;
    onReject?: (error: any, val1: R1, val2: R2) => void;
    onCancel?: (promise: Promise<AsyncReturn>, val1: R1, val2: R2) => void;
    shouldUseAsync?: (val1: R1, val2: R2) => boolean;
    omitStatus?: boolean;
    throttle?: (f: Function) => Function;
}, s1: Selector<State, R1, Props>, s2: Selector<State, R2, Props>): AsyncSelector<State, SyncReturn, AsyncReturn, Props>;
export declare function createAsyncSelector<State, R1, R2, AsyncReturn, Props = undefined, SyncReturn = undefined>(params: {
    sync?: ((val1: R1, val2: R2) => SyncReturn);
    async: (val1: R1, val2: R2) => Promise<AsyncReturn>;
    onResolve?: (result: AsyncReturn, val1: R1, val2: R2) => void;
    onReject?: (error: any, val1: R1, val2: R2) => void;
    onCancel?: (promise: Promise<AsyncReturn>, val1: R1, val2: R2) => void;
    shouldUseAsync?: (val1: R1, val2: R2) => boolean;
    omitStatus?: boolean;
    throttle?: (f: Function) => Function;
}, selectors: [Selector<State, R1, Props>, Selector<State, R2, Props>]): AsyncSelector<State, SyncReturn, AsyncReturn, Props>;
export declare function createAsyncSelector<State, R1, R2, R3, AsyncReturn, Props = undefined, SyncReturn = undefined>(params: {
    sync?: ((val1: R1, val2: R2, val3: R3) => SyncReturn);
    async: (val1: R1, val2: R2, val3: R3) => Promise<AsyncReturn>;
    onResolve?: (result: AsyncReturn, val1: R1, val2: R2, val3: R3) => void;
    onReject?: (error: any, val1: R1, val2: R2, val3: R3) => void;
    onCancel?: (promise: Promise<AsyncReturn>, val1: R1, val2: R2, val3: R3) => void;
    shouldUseAsync?: (val1: R1, val2: R2, val3: R3) => boolean;
    omitStatus?: boolean;
    throttle?: (f: Function) => Function;
}, s1: Selector<State, R1, Props>, s2: Selector<State, R2, Props>, s3: Selector<State, R3, Props>): AsyncSelector<State, SyncReturn, AsyncReturn, Props>;
export declare function createAsyncSelector<State, R1, R2, R3, AsyncReturn, Props = undefined, SyncReturn = undefined>(params: {
    sync?: ((val1: R1, val2: R2, val3: R3) => SyncReturn);
    async: (val1: R1, val2: R2, val3: R3) => Promise<AsyncReturn>;
    onResolve?: (result: AsyncReturn, val1: R1, val2: R2, val3: R3) => void;
    onReject?: (error: any, val1: R1, val2: R2, val3: R3) => void;
    onCancel?: (promise: Promise<AsyncReturn>, val1: R1, val2: R2, val3: R3) => void;
    shouldUseAsync?: (val1: R1, val2: R2, val3: R3) => boolean;
    omitStatus?: boolean;
    throttle?: (f: Function) => Function;
}, selectors: [Selector<State, R1, Props>, Selector<State, R2, Props>, Selector<State, R3, Props>]): AsyncSelector<State, SyncReturn, AsyncReturn, Props>;
export declare function createAsyncSelector<State, R1, R2, R3, R4, AsyncReturn, Props = undefined, SyncReturn = undefined>(params: {
    sync?: ((val1: R1, val2: R2, val3: R3, val4: R4) => SyncReturn);
    async: (val1: R1, val2: R2, val3: R3, val4: R4) => Promise<AsyncReturn>;
    onResolve?: (result: AsyncReturn, val1: R1, val2: R2, val3: R3, val4: R4) => void;
    onReject?: (error: any, val1: R1, val2: R2, val3: R3, val4: R4) => void;
    onCancel?: (promise: Promise<AsyncReturn>, val1: R1, val2: R2, val3: R3, val4: R4) => void;
    shouldUseAsync?: (val1: R1, val2: R2, val3: R3, val4: R4) => boolean;
    omitStatus?: boolean;
    throttle?: (f: Function) => Function;
}, s1: Selector<State, R1, Props>, s2: Selector<State, R2, Props>, s3: Selector<State, R3, Props>, s4: Selector<State, R4, Props>): AsyncSelector<State, SyncReturn, AsyncReturn, Props>;
export declare function createAsyncSelector<State, R1, R2, R3, R4, AsyncReturn, Props = undefined, SyncReturn = undefined>(params: {
    sync?: ((val1: R1, val2: R2, val3: R3, val4: R4) => SyncReturn);
    async: (val1: R1, val2: R2, val3: R3, val4: R4) => Promise<AsyncReturn>;
    onResolve?: (result: AsyncReturn, val1: R1, val2: R2, val3: R3, val4: R4) => void;
    onReject?: (error: any, val1: R1, val2: R2, val3: R3, val4: R4) => void;
    onCancel?: (promise: Promise<AsyncReturn>, val1: R1, val2: R2, val3: R3, val4: R4) => void;
    shouldUseAsync?: (val1: R1, val2: R2, val3: R3, val4: R4) => boolean;
    omitStatus?: boolean;
    throttle?: (f: Function) => Function;
}, selectors: [Selector<State, R1, Props>, Selector<State, R2, Props>, Selector<State, R3, Props>, Selector<State, R4, Props>]): AsyncSelector<State, SyncReturn, AsyncReturn, Props>;
export declare function createAsyncSelector<State, R1, R2, R3, R4, R5, AsyncReturn, Props = undefined, SyncReturn = undefined>(params: {
    sync?: ((val1: R1, val2: R2, val3: R3, val4: R4, val5: R5) => SyncReturn);
    async: (val1: R1, val2: R2, val3: R3, val4: R4, val5: R5) => Promise<AsyncReturn>;
    onResolve?: (result: AsyncReturn, val1: R1, val2: R2, val3: R3, val4: R4, val5: R5) => void;
    onReject?: (error: any, val1: R1, val2: R2, val3: R3, val4: R4, val5: R5) => void;
    onCancel?: (promise: Promise<AsyncReturn>, val1: R1, val2: R2, val3: R3, val4: R4, val5: R5) => void;
    shouldUseAsync?: (val1: R1, val2: R2, val3: R3, val4: R4, val5: R5) => boolean;
    omitStatus?: boolean;
    throttle?: (f: Function) => Function;
}, s1: Selector<State, R1, Props>, s2: Selector<State, R2, Props>, s3: Selector<State, R3, Props>, s4: Selector<State, R4, Props>, s5: Selector<State, R5, Props>): AsyncSelector<State, SyncReturn, AsyncReturn, Props>;
export declare function createAsyncSelector<State, R1, R2, R3, R4, R5, AsyncReturn, Props = undefined, SyncReturn = undefined>(params: {
    sync?: ((val1: R1, val2: R2, val3: R3, val4: R4, val5: R5) => SyncReturn);
    async: (val1: R1, val2: R2, val3: R3, val4: R4, val5: R5) => Promise<AsyncReturn>;
    onResolve?: (result: AsyncReturn, val1: R1, val2: R2, val3: R3, val4: R4, val5: R5) => void;
    onReject?: (error: any, val1: R1, val2: R2, val3: R3, val4: R4, val5: R5) => void;
    onCancel?: (promise: Promise<AsyncReturn>, val1: R1, val2: R2, val3: R3, val4: R4, val5: R5) => void;
    shouldUseAsync?: (val1: R1, val2: R2, val3: R3, val4: R4, val5: R5) => boolean;
    omitStatus?: boolean;
    throttle?: (f: Function) => Function;
}, selectors: [Selector<State, R1, Props>, Selector<State, R2, Props>, Selector<State, R3, Props>, Selector<State, R4, Props>, Selector<State, R5, Props>]): AsyncSelector<State, SyncReturn, AsyncReturn, Props>;
export declare function createAsyncSelector<State, R1, R2, R3, R4, R5, R6, AsyncReturn, Props = undefined, SyncReturn = undefined>(params: {
    sync?: ((val1: R1, val2: R2, val3: R3, val4: R4, val5: R5, val6: R6) => SyncReturn);
    async: (val1: R1, val2: R2, val3: R3, val4: R4, val5: R5, val6: R6) => Promise<AsyncReturn>;
    onResolve?: (result: AsyncReturn, val1: R1, val2: R2, val3: R3, val4: R4, val5: R5, val6: R6) => void;
    onReject?: (error: any, val1: R1, val2: R2, val3: R3, val4: R4, val5: R5, val6: R6) => void;
    onCancel?: (promise: Promise<AsyncReturn>, val1: R1, val2: R2, val3: R3, val4: R4, val5: R5, val6: R6) => void;
    shouldUseAsync?: (val1: R1, val2: R2, val3: R3, val4: R4, val5: R5, val6: R6) => boolean;
    omitStatus?: boolean;
    throttle?: (f: Function) => Function;
}, s1: Selector<State, R1, Props>, s2: Selector<State, R2, Props>, s3: Selector<State, R3, Props>, s4: Selector<State, R4, Props>, s5: Selector<State, R5, Props>, s6: Selector<State, R6, Props>): AsyncSelector<State, SyncReturn, AsyncReturn, Props>;
export declare function createAsyncSelector<State, R1, R2, R3, R4, R5, R6, AsyncReturn, Props = undefined, SyncReturn = undefined>(params: {
    sync?: ((val1: R1, val2: R2, val3: R3, val4: R4, val5: R5, val6: R6) => SyncReturn);
    async: (val1: R1, val2: R2, val3: R3, val4: R4, val5: R5, val6: R6) => Promise<AsyncReturn>;
    onResolve?: (result: AsyncReturn, val1: R1, val2: R2, val3: R3, val4: R4, val5: R5, val6: R6) => void;
    onReject?: (error: any, val1: R1, val2: R2, val3: R3, val4: R4, val5: R5, val6: R6) => void;
    onCancel?: (promise: Promise<AsyncReturn>, val1: R1, val2: R2, val3: R3, val4: R4, val5: R5, val6: R6) => void;
    shouldUseAsync?: (val1: R1, val2: R2, val3: R3, val4: R4, val5: R5, val6: R6) => boolean;
    omitStatus?: boolean;
    throttle?: (f: Function) => Function;
}, selectors: [Selector<State, R1, Props>, Selector<State, R2, Props>, Selector<State, R3, Props>, Selector<State, R4, Props>, Selector<State, R5, Props>, Selector<State, R6, Props>]): AsyncSelector<State, SyncReturn, AsyncReturn, Props>;
export declare function createAsyncSelector<State, R1, R2, R3, R4, R5, R6, R7, AsyncReturn, Props = undefined, SyncReturn = undefined>(params: {
    sync?: ((val1: R1, val2: R2, val3: R3, val4: R4, val5: R5, val6: R6, val7: R7) => SyncReturn);
    async: (val1: R1, val2: R2, val3: R3, val4: R4, val5: R5, val6: R6, val7: R7) => Promise<AsyncReturn>;
    onResolve?: (result: AsyncReturn, val1: R1, val2: R2, val3: R3, val4: R4, val5: R5, val6: R6, val7: R7) => void;
    onReject?: (error: any, val1: R1, val2: R2, val3: R3, val4: R4, val5: R5, val6: R6, val7: R7) => void;
    onCancel?: (promise: Promise<AsyncReturn>, val1: R1, val2: R2, val3: R3, val4: R4, val5: R5, val6: R6, val7: R7) => void;
    shouldUseAsync?: (val1: R1, val2: R2, val3: R3, val4: R4, val5: R5, val6: R6, val7: R7) => boolean;
    omitStatus?: boolean;
    throttle?: (f: Function) => Function;
}, s1: Selector<State, R1, Props>, s2: Selector<State, R2, Props>, s3: Selector<State, R3, Props>, s4: Selector<State, R4, Props>, s5: Selector<State, R5, Props>, s6: Selector<State, R6, Props>, s7: Selector<State, R7, Props>): AsyncSelector<State, SyncReturn, AsyncReturn, Props>;
export declare function createAsyncSelector<State, R1, R2, R3, R4, R5, R6, R7, AsyncReturn, Props = undefined, SyncReturn = undefined>(params: {
    sync?: ((val1: R1, val2: R2, val3: R3, val4: R4, val5: R5, val6: R6, val7: R7) => SyncReturn);
    async: (val1: R1, val2: R2, val3: R3, val4: R4, val5: R5, val6: R6, val7: R7) => Promise<AsyncReturn>;
    onResolve?: (result: AsyncReturn, val1: R1, val2: R2, val3: R3, val4: R4, val5: R5, val6: R6, val7: R7) => void;
    onReject?: (error: any, val1: R1, val2: R2, val3: R3, val4: R4, val5: R5, val6: R6, val7: R7) => void;
    onCancel?: (promise: Promise<AsyncReturn>, val1: R1, val2: R2, val3: R3, val4: R4, val5: R5, val6: R6, val7: R7) => void;
    shouldUseAsync?: (val1: R1, val2: R2, val3: R3, val4: R4, val5: R5, val6: R6, val7: R7) => boolean;
    omitStatus?: boolean;
    throttle?: (f: Function) => Function;
}, selectors: [Selector<State, R1, Props>, Selector<State, R2, Props>, Selector<State, R3, Props>, Selector<State, R4, Props>, Selector<State, R5, Props>, Selector<State, R6, Props>, Selector<State, R7, Props>]): AsyncSelector<State, SyncReturn, AsyncReturn, Props>;
export declare function createAsyncSelector<State, R1, R2, R3, R4, R5, R6, R7, R8, AsyncReturn, Props = undefined, SyncReturn = undefined>(params: {
    sync?: ((val1: R1, val2: R2, val3: R3, val4: R4, val5: R5, val6: R6, val7: R7, val8: R8) => SyncReturn);
    async: (val1: R1, val2: R2, val3: R3, val4: R4, val5: R5, val6: R6, val7: R7, val8: R8) => Promise<AsyncReturn>;
    onResolve?: (result: AsyncReturn, val1: R1, val2: R2, val3: R3, val4: R4, val5: R5, val6: R6, val7: R7, val8: R8) => void;
    onReject?: (error: any, val1: R1, val2: R2, val3: R3, val4: R4, val5: R5, val6: R6, val7: R7, val8: R8) => void;
    onCancel?: (promise: Promise<AsyncReturn>, val1: R1, val2: R2, val3: R3, val4: R4, val5: R5, val6: R6, val7: R7, val8: R8) => void;
    shouldUseAsync?: (val1: R1, val2: R2, val3: R3, val4: R4, val5: R5, val6: R6, val7: R7, val8: R8) => boolean;
    omitStatus?: boolean;
    throttle?: (f: Function) => Function;
}, s1: Selector<State, R1, Props>, s2: Selector<State, R2, Props>, s3: Selector<State, R3, Props>, s4: Selector<State, R4, Props>, s5: Selector<State, R5, Props>, s6: Selector<State, R6, Props>, s7: Selector<State, R7, Props>, s8: Selector<State, R8, Props>): AsyncSelector<State, SyncReturn, AsyncReturn, Props>;
export declare function createAsyncSelector<State, R1, R2, R3, R4, R5, R6, R7, R8, AsyncReturn, Props = undefined, SyncReturn = undefined>(params: {
    sync?: ((val1: R1, val2: R2, val3: R3, val4: R4, val5: R5, val6: R6, val7: R7, val8: R8) => SyncReturn);
    async: (val1: R1, val2: R2, val3: R3, val4: R4, val5: R5, val6: R6, val7: R7, val8: R8) => Promise<AsyncReturn>;
    onResolve?: (result: AsyncReturn, val1: R1, val2: R2, val3: R3, val4: R4, val5: R5, val6: R6, val7: R7, val8: R8) => void;
    onReject?: (error: any, val1: R1, val2: R2, val3: R3, val4: R4, val5: R5, val6: R6, val7: R7, val8: R8) => void;
    onCancel?: (promise: Promise<AsyncReturn>, val1: R1, val2: R2, val3: R3, val4: R4, val5: R5, val6: R6, val7: R7, val8: R8) => void;
    shouldUseAsync?: (val1: R1, val2: R2, val3: R3, val4: R4, val5: R5, val6: R6, val7: R7, val8: R8) => boolean;
    omitStatus?: boolean;
    throttle?: (f: Function) => Function;
}, selectors: [Selector<State, R1, Props>, Selector<State, R2, Props>, Selector<State, R3, Props>, Selector<State, R4, Props>, Selector<State, R5, Props>, Selector<State, R6, Props>, Selector<State, R7, Props>, Selector<State, R8, Props>]): AsyncSelector<State, SyncReturn, AsyncReturn, Props>;
export default createAsyncSelector;
