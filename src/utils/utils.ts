import {tv as tvBase, TV} from "tailwind-variants";

import {mappedSpacingScaleKeys} from "./types";

export const mapPropsVariants = <T extends Record<string, any>, K extends keyof T>(
    props: T,
    variantKeys?: K[],
    removeVariantProps = true,
): readonly [Omit<T, K> | T, Pick<T, K> | {}] => {
    if (!variantKeys) {
        return [props, {}];
    }

    const picked = variantKeys.reduce((acc, key) => {
        // Only include the key in `picked` if it exists in `props`
        if (key in props) {
            return {...acc, [key]: props[key]};
        } else {
            return acc;
        }
    }, {});

    if (removeVariantProps) {
        const omitted = Object.keys(props)
            .filter((key) => !variantKeys.includes(key as K))
            .reduce((acc, key) => ({...acc, [key]: props[key as keyof T]}), {});

        return [omitted, picked] as [Omit<T, K>, Pick<T, K>];
    } else {
        return [props, picked] as [T, Pick<T, K>];
    }
};

const COMMON_UNITS = ["small", "medium", "large"];

export const tv: TV = (options, config) =>
    tvBase(options, {
        ...config,
        twMerge: config?.twMerge ?? true,
        twMergeConfig: {
            ...config?.twMergeConfig,
            theme: {
                ...config?.twMergeConfig?.theme,
                opacity: ["disabled"],
                spacing: ["divider", "unit", ...mappedSpacingScaleKeys],
                borderWidth: COMMON_UNITS,
                borderRadius: COMMON_UNITS,
            },
            classGroups: {
                ...config?.twMergeConfig?.classGroups,
                shadow: [{shadow: COMMON_UNITS}],
                "font-size": [{text: ["tiny", ...COMMON_UNITS]}],
                "bg-image": ["bg-stripe-gradient"],
                "min-w": [
                    {
                        "min-w": ["unit", ...mappedSpacingScaleKeys],
                    },
                ],
                "min-h": [
                    {
                        "min-h": ["unit", ...mappedSpacingScaleKeys],
                    },
                ],
            },
        },
    });

/* eslint-disable no-shadow-restricted-names */
/* eslint-disable no-plusplus */
function toVal(mix: any) {
    var k,
        y,
        str = "";

    if (typeof mix === "string" || typeof mix === "number") {
        str += mix;
    } else if (typeof mix === "object") {
        if (Array.isArray(mix)) {
            for (k = 0; k < mix.length; k++) {
                if (mix[k]) {
                    if ((y = toVal(mix[k]))) {
                        str && (str += " ");
                        str += y;
                    }
                }
            }
        } else {
            for (k in mix) {
                if (mix[k]) {
                    str && (str += " ");
                    str += k;
                }
            }
        }
    }

    return str;
}

export function clsx(...args: any[]) {
    var i = 0,
        tmp,
        x,
        str = "";

    while (i < args.length) {
        if ((tmp = args[i++])) {
            if ((x = toVal(tmp))) {
                str && (str += " ");
                str += x;
            }
        }
    }

    return str;
}

type Booleanish = boolean | "true" | "false";
export const dataAttr = (condition: boolean | undefined) =>
    (condition ? "true" : undefined) as Booleanish;