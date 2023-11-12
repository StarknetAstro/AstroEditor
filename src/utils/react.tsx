import React, {forwardRef as baseForwardRef, Ref, RefObject, useImperativeHandle, useRef} from "react";
import type {As, RightJoinProps, PropsOf, InternalForwardRefRenderFunction} from "./types";

export function forwardRef<
    Component extends As,
    Props extends object,
    OmitKeys extends keyof any = never,
>(
    component: React.ForwardRefRenderFunction<
        any,
        RightJoinProps<PropsOf<Component>, Props> & {
        as?: As;
    }
    >,
) {
    return baseForwardRef(component) as InternalForwardRefRenderFunction<Component, Props, OmitKeys>;
}

export type ReactRef<T> = React.RefObject<T> | React.MutableRefObject<T> | React.Ref<T>;

export function useDOMRef<T extends HTMLElement = HTMLElement>(
    ref?: RefObject<T | null> | Ref<T | null>,
) {
    const domRef = useRef<T>(null);

    useImperativeHandle(ref, () => domRef.current);

    return domRef;
}