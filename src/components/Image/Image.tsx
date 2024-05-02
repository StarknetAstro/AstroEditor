import React, {cloneElement, forwardRef as baseForwardRef} from "react";

import {UseImageProps, useImage} from "./use-image";
import {As, InternalForwardRefRenderFunction, PropsOf, RightJoinProps} from "@/utils/types";

export interface ImageProps extends Omit<UseImageProps, "showSkeleton"> {}

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

export const Image = forwardRef<"img", ImageProps>((props, ref) => {
    const {
        Component,
        domRef,
        slots,
        classNames,
        isBlurred,
        isZoomed,
        fallbackSrc,
        removeWrapper,
        disableSkeleton,
        getImgProps,
        getWrapperProps,
        getBlurredImgProps,
    } = useImage({
        ...props,
        ref,
    });

    const img = <Component ref={domRef} {...getImgProps()} />;

    if (removeWrapper) {
        return img;
    }

    const zoomed = (
        <div className={slots.zoomedWrapper({class: classNames?.zoomedWrapper})}>{img}</div>
    );

    if (isBlurred) {
        // clone element to add isBlurred prop to the cloned image
        return (
            <div {...getWrapperProps()}>
                {isZoomed ? zoomed : img}
                {cloneElement(img, getBlurredImgProps())}
            </div>
        );
    }

    // when zoomed or showSkeleton, we need to wrap the image
    if (isZoomed || !disableSkeleton || fallbackSrc) {
        return <div {...getWrapperProps()}> {isZoomed ? zoomed : img}</div>;
    }

    return img;
});

Image.displayName = "NextUI.Image";