/**
 * Set native value
 * {@link https://stackoverflow.com/a/53797269/9678258}
 * @param element Element
 * @param value Value
 */
export default function setNativeValue(element: HTMLElement | undefined, value: string) {
    const valueSetter = Object.getOwnPropertyDescriptor(element, 'value')?.set
    const prototype = Object.getPrototypeOf(element)
    const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set

    if (valueSetter && valueSetter !== prototypeValueSetter)
        prototypeValueSetter?.call(element, value)
    else
        valueSetter?.call(element, value)
}
