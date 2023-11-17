import { FC, PropsWithChildren, createContext } from "react";
import { FlatProvider } from "../lib/flattner";
import { DetailedFlatComponent } from "../lib/types";

const TestProvider: FC<PropsWithChildren> = ({ children }) => (
  <div>{children}</div>
);

const SecondProvider: FC<PropsWithChildren> = ({ children }) => (
  <div>{children}</div>
);

const ThirdProvider: FC<PropsWithChildren> = ({ children }) => (
  <span>{children}</span>
);
const ActualContext = createContext({});
const ActualProvider: FC<PropsWithChildren & { value: unknown }> = ({
  children,
  value,
}) => {
  return (
    <ActualContext.Provider value={{ value }}>
      {children}
    </ActualContext.Provider>
  );
};
const detailedComponent: DetailedFlatComponent = {
  element: <TestProvider />,
  enabled: () => true,
};
describe("FlatProvider tests", () => {
  it("when flattner is called , should output appropriate providers ", () => {
    const component = FlatProvider({ elements: [<TestProvider />] });
    const expected = <TestProvider />;
    expect(component).not.toBeNull();
    expect(component).toEqual(expected);
  });

  it("when flattener is called with multiple components, should return in valid order", () => {
    const component = FlatProvider({
      elements: [<TestProvider />, <SecondProvider />],
    });

    const expected = (
      <TestProvider>
        <SecondProvider />
      </TestProvider>
    );
    const invalid = (
      <SecondProvider>
        <TestProvider />
      </SecondProvider>
    );
    expect(component).not.toBeNull();
    expect(component).toEqual(expected);
    expect(component).not.toEqual(invalid);
  });
  it("when nested, should retain order and number of components", () => {
    const component = FlatProvider({
      elements: [<TestProvider />, <SecondProvider />, <ThirdProvider />],
    });

    const expected = (
      <TestProvider>
        <SecondProvider>
          <ThirdProvider />
        </SecondProvider>
      </TestProvider>
    );

    expect(component).not.toBeNull();
    expect(component).toEqual(expected);
  });
  it("when nested and having children, should retain order and provide children", () => {
    const component = FlatProvider({
      elements: [<TestProvider />, <SecondProvider />, <ThirdProvider />],
      children: <TestProvider />,
    });

    const expected = (
      <TestProvider>
        <SecondProvider>
          <ThirdProvider>
            <TestProvider />
          </ThirdProvider>
        </SecondProvider>
      </TestProvider>
    );

    expect(component).not.toBeNull();
    expect(component).toEqual(expected);
  });
  it("when using detailed providers , should provide expected result", () => {
    const component = FlatProvider({
      elements: [detailedComponent, <SecondProvider />],
    });
    const expected = (
      <TestProvider>
        <SecondProvider />
      </TestProvider>
    );

    expect(component).not.toBeNull();
    expect(component).toEqual(expected);
  });
  it("when using detailed providers , enable function should have all previous contexts", () => {
    let value;
    const component = FlatProvider({
      elements: [
        <ActualProvider value={1} />,
        <SecondProvider />,
        {
          element: <TestProvider />,
          context: ActualContext,
          enabled: (context) => {
            value = context;
            return true;
          },
        },
      ],
    });
    const expected = (
      <TestProvider>
        <SecondProvider />
      </TestProvider>
    );

    expect(component).not.toBeNull();
    expect(component).toEqual(expected);
    expect(value).not.toBeNull();
    expect(value).toEqual({ value: 1 });
  });
});
