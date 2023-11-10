import { FC, ReactElement, cloneElement } from "react";
import { FlatProviderPropsInterface } from "./types";

export const FlatProvider: FC<FlatProviderPropsInterface> = ({
  children,
  elements,
}) => {
  const [FirstNode, ...otherElemenets] = elements;
  let StructureNode: ReactElement = FirstNode;
  let InnerNode: ReactElement = StructureNode;

  otherElemenets.forEach((FElement, index) => {
    StructureNode = cloneElement(
      StructureNode,
      {},
      InnerNode === StructureNode
        ? FElement
        : cloneElement(
            InnerNode,
            {},
            index + 1 === otherElemenets.length
              ? cloneElement(FElement, {}, children)
              : FElement,
          ),
    );
    InnerNode = FElement;
  });

  return StructureNode;
};
