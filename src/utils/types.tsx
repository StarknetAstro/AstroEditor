/**
 * Part of this code is taken from @chakra-ui/system ❤️
 */
import {ClassValue} from "tailwind-variants";

/**
 * This Typescript utility transform a list of slots into a list of {slot: classes}
 */
export type SlotsToClasses<S extends string> = {
    [key in S]?: ClassValue;
};

export type As<Props = any> = React.ElementType<Props>;
export type DOMElements = keyof JSX.IntrinsicElements;
export type CapitalizedDOMElements = Capitalize<DOMElements>;

export interface DOMElement extends Element, HTMLOrSVGElement {}

type DataAttributes = {
    [dataAttr: string]: any;
};

export type DOMAttributes<T = DOMElement> = React.AriaAttributes &
    React.DOMAttributes<T> &
    DataAttributes & {
    id?: string;
    role?: React.AriaRole;
    tabIndex?: number;
    style?: React.CSSProperties;
};

export type OmitCommonProps<Target, OmitAdditionalProps extends keyof any = never> = Omit<
    Target,
    "transition" | "as" | "color" | OmitAdditionalProps
>;

export type RightJoinProps<
    SourceProps extends object = {},
    OverrideProps extends object = {},
> = OmitCommonProps<SourceProps, keyof OverrideProps> & OverrideProps;

export type MergeWithAs<
    ComponentProps extends object,
    AsProps extends object,
    AdditionalProps extends object = {},
    AsComponent extends As = As,
> = (RightJoinProps<ComponentProps, AdditionalProps> | RightJoinProps<AsProps, AdditionalProps>) & {
    as?: AsComponent;
};

export type InternalForwardRefRenderFunction<
    Component extends As,
    Props extends object = {},
    OmitKeys extends keyof any = never,
> = {
    <AsComponent extends As = Component>(
        props: MergeWithAs<
            React.ComponentPropsWithoutRef<Component>,
            Omit<React.ComponentPropsWithoutRef<AsComponent>, OmitKeys>,
            Props,
            AsComponent
        >,
    ): React.ReactElement | null;
    readonly $$typeof: symbol;
    defaultProps?: Partial<Props> | undefined;
    propTypes?: React.WeakValidationMap<Props> | undefined;
    displayName?: string | undefined;
};

/**
 * Extract the props of a React element or component
 */
export type PropsOf<T extends As> = React.ComponentPropsWithoutRef<T> & {
    as?: As;
};

export type Merge<M, N> = N extends Record<string, unknown> ? M : Omit<M, keyof N> & N;

export type HTMLNextUIProps<T extends As = "div", OmitKeys extends keyof any = never> = Omit<
    PropsOf<T>,
    "ref" | "color" | "slot" | OmitKeys
> & {
    as?: As;
};

export type PropGetter<P = Record<string, unknown>, R = DOMAttributes> = (
    props?: Merge<DOMAttributes, P>,
    ref?: React.Ref<any>,
) => R & React.RefAttributes<any>;

export const spacingScaleKeys = [
    "0",
    "xs",
    "sm",
    "md",
    "lg",
    "xl",
    "2xl",
    "3xl",
    "4xl",
    "5xl",
    "6xl",
    "7xl",
    "8xl",
    "9xl",
    "1",
    "2",
    "3",
    "3.5",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "20",
    "24",
    "28",
    "32",
    "36",
    "40",
    "44",
    "48",
    "52",
    "56",
    "60",
    "64",
    "72",
    "80",
    "96",
];

export const mappedSpacingScaleKeys = spacingScaleKeys.map((key) => `unit-${key}`);

export type SpacingScaleKeys = (typeof spacingScaleKeys)[number];

