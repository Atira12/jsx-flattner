import { Context, PropsWithChildren, ReactElement } from "react";

export interface DetailedFlatComponent {
  element: ReactElement;
  enabled: (contextValue?: unknown) => boolean;
  context?: Context<unknown>;
}
export type FlatComponent = ReactElement | DetailedFlatComponent;

export type FlatProviderPropsInterface = PropsWithChildren & {
  elements: FlatComponent[];
};
