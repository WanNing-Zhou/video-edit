/**
 * @param {Function} fn 目标函数
 * @param {Number} time 延迟执行毫秒数
 * @param {Boolean} immediate true - 立即执行 false - 延迟执行
 * @description 防抖函数
 */
export function debounce(fn, time, immediate = true) {
    let timer
    return function() {
        const that = this
        const args = arguments

        if (timer) clearTimeout(timer)
        if (immediate) {
            const callNow = !timer
            timer = setTimeout(() => {
                timer = null
            }, time)
            if (callNow) {
                fn.apply(that, args)
            }
        } else {
            timer = setTimeout(() => {
                fn.apply(that,args)
            }, time)
        }
    }
}