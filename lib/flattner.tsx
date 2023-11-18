import {
  FC,
  PropsWithChildren,
  ReactElement,
  cloneElement,
  isValidElement,
  useContext,
} from "react";
import { DetailedFlatComponent, FlatProviderPropsInterface } from "./types";

export const FlatDetailedContextWrapperComponent: FC<
  PropsWithChildren & { component: Required<DetailedFlatComponent> }
> = ({ component, children }) => {
  const { element, context, enabled } = component;

  const contextValue = useContext(context);
  return enabled(contextValue) ? cloneElement(element, {}, children) : children;
};

export const FlatDetailedWrapperComponent: FC<
  PropsWithChildren & { component: Omit<DetailedFlatComponent, "context"> }
> = ({ component, children }) => {
  const { element, enabled } = component;

  return enabled() ? cloneElement(element, {}, children) : children;
};

export const FlatProvider: FC<FlatProviderPropsInterface> = ({
  children,
  elements,
}) => {
  const [firstElement, ...transformedElements] = elements.map((element) => {
    if (isValidElement(element)) {
      return element;
    }
    if ((element as DetailedFlatComponent).context) {
      return (
        <FlatDetailedContextWrapperComponent
          //@ts-expect-error Element is checked for existing context field
          component={element as DetailedFlatComponent}
        />
      );
    }
    return (
      <FlatDetailedWrapperComponent
        component={element as DetailedFlatComponent}
      />
    );
  });

  let StructureNode: ReactElement = firstElement;
  let InnerNode: ReactElement = StructureNode;

  transformedElements.forEach((FElement, index) => {
    StructureNode = cloneElement(
      StructureNode,
      {},
      InnerNode === StructureNode
        ? FElement
        : cloneElement(
          InnerNode,
          {},
          index + 1 === transformedElements.length
            ? cloneElement(FElement, {}, children)
            : FElement,
        ),
    );
    InnerNode = FElement;
  });

  return StructureNode;
};
