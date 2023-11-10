import { PropsWithChildren, ReactElement, ReactNode } from "react";

export interface DetailedFlatComponent {
  element: ReactElement;
  enabled: (contextValue: unknown) => boolean;
}
export type FlatComponent = ReactElement | DetailedFlatComponent;
export type FlatProviderPropsInterface = PropsWithChildren & {
  elements: ReactElement[];
};
