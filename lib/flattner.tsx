import {
  FC,
  PropsWithChildren,
  ReactElement,
  ReactNode,
  cloneElement,
  isValidElement,
  useContext,
} from "react";
import {
  DetailedFlatComponent,
  FlatComponent,
  FlatProviderPropsInterface,
} from "./types";

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

const generateCurrentNode = (
  [usedElement, ...passableElements]: ReactElement[],
  children: ReactNode,
): ReactNode => {
  if (passableElements.length == 0) {
    return cloneElement(usedElement, {}, children);
  }
  return cloneElement(
    usedElement,
    {},
    generateCurrentNode(passableElements, children),
  );
};

export const FlatProvider: FC<FlatProviderPropsInterface> = ({
  children,
  elements,
}) => {
  const transformedElements = elements.map((element) => {
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

  return generateCurrentNode(transformedElements, children);
};
