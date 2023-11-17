import {
  FC,
  Fragment,
  PropsWithChildren,
  ReactElement,
  cloneElement,
  isValidElement,
  useContext,
} from "react";
import { DetailedFlatComponent, FlatProviderPropsInterface } from "./types";

const FlatDetailedWrapperComponent: FC<
  PropsWithChildren & { component: DetailedFlatComponent }
> = ({ component, children }) => {
  const { element, context, enabled } = component;

  return enabled() ? cloneElement(element, {}, children) : <Fragment />;
};

export const FlatProvider: FC<FlatProviderPropsInterface> = ({
  children,
  elements,
}) => {
  let StructureNode: ReactElement;
  let InnerNode: ReactElement;

  const transformedElements = elements.map((element) => {
    if (isValidElement(element)) {
      return element;
    }
    return (
      <FlatDetailedWrapperComponent
        component={element as DetailedFlatComponent}
      />
    );
  });
  transformedElements.forEach((FElement, index) => {
    StructureNode = cloneElement(
      StructureNode,
      {},
      StructureNode
        ? FElement
        : cloneElement(
          InnerNode,
          {},
          index + 1 === elements.length
            ? cloneElement(FElement, {}, children)
            : FElement,
        ),
    );
    InnerNode = FElement;
  });

  //@ts-expect-error Expected for not to wrap in Fragment
  return StructureNode;
};
