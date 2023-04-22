/**
 * 节流函数
 */
function throttle (fn, delay, debounce) {

    let currCall;
    let lastCall = 0;
    let lastExec = 0;
    let timer = null;
    let diff;
    let scope;
    let args;
    let debounceNextCall;

    delay = delay || 0;

    function exec () {
        lastExec = (new Date()).getTime();
        timer = null;
        fn.apply(scope, args || []);
    }

    let cb = function () {
        currCall = (new Date()).getTime();
        scope = this;
        args = arguments;
        let thisDelay = debounceNextCall || delay;
        let thisDebounce = debounceNextCall || debounce;
        debounceNextCall = null;
        diff = currCall - (thisDebounce ? lastCall : lastExec) - thisDelay;

        clearTimeout(timer);

        if (thisDebounce) {
            timer = setTimeout(exec, thisDelay);
        }
        else {
            if (diff >= 0) {
                exec();
            }
            else {
                timer = setTimeout(exec, -diff);
            }
        }

        lastCall = currCall;
    };

    /**
     * Clear throttle.
     * @public
     */
    cb.clear = function () {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
    };

    /**
     * Enable debounce once.
     */
    cb.debounceNextCall = function (debounceDelay) {
        debounceNextCall = debounceDelay;
    };

    return cb;
}

export default throttle;