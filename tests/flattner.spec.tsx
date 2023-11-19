import { FC, PropsWithChildren, createContext } from "react";
import {
  FlatDetailedContextWrapperComponent,
  FlatDetailedWrapperComponent,
  FlatProvider,
} from "../lib/flattner";
import { DetailedFlatComponent } from "../lib/types";
import { render } from "@testing-library/react";

const TestProvider: FC<PropsWithChildren> = ({ children }) => (
  <div>{children}</div>
);

const SecondProvider: FC<PropsWithChildren> = ({ children }) => (
  <div>{children}</div>
);

const ThirdProvider: FC<PropsWithChildren> = ({ children }) => (
  <span>{children}</span>
);
const ActualContext = createContext<unknown>({});
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
  it("when using standard provider, should retain order and number of components", () => {
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
  it("when using standard provider and having children, should retain order and provide children", () => {
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
  it("when using standard provider and having children, should retain order and provide children even with a lot of providers", () => {
    const component = FlatProvider({
      elements: [
        <ThirdProvider />,
        <ThirdProvider />,
        <ThirdProvider />,
        <ThirdProvider />,
        <ThirdProvider />,
        <TestProvider />,
        <SecondProvider />,
        <ThirdProvider />,
      ],

      children: <TestProvider />,
    });

    const expected = (
      <ThirdProvider>
        <ThirdProvider>
          <ThirdProvider>
            <ThirdProvider>
              <ThirdProvider>
                <TestProvider>
                  <SecondProvider>
                    <ThirdProvider>
                      <TestProvider />
                    </ThirdProvider>
                  </SecondProvider>
                </TestProvider>
              </ThirdProvider>
            </ThirdProvider>
          </ThirdProvider>
        </ThirdProvider>
      </ThirdProvider>
    );

    expect(component).not.toBeNull();
    expect(component).toEqual(expected);
  });
  it("when using detailed providers , should provide expected result", () => {
    const component = FlatProvider({
      elements: [detailedComponent, <SecondProvider />],
    });
    const expected = (
      <FlatDetailedWrapperComponent component={detailedComponent}>
        <SecondProvider />
      </FlatDetailedWrapperComponent>
    );

    expect(component).not.toBeNull();
    expect(component).toEqual(expected);
  });

  it("when using detailed providers , enable function should have expected context value", () => {
    let value;
    const providerWithEnabled = {
      element: <TestProvider />,
      context: ActualContext,
      enabled: (context: unknown) => {
        value = context;
        return true;
      },
    };
    const component1 = FlatProvider({
      elements: [
        <ActualProvider value={1} />,
        <SecondProvider />,
        providerWithEnabled,
      ],
    });
    const component = (
      <FlatProvider
        elements={[
          <ActualProvider value={1} />,
          <SecondProvider />,
          providerWithEnabled,
        ]}
      />
    );
    const expected = (
      <ActualProvider value={1}>
        <SecondProvider>
          <FlatDetailedContextWrapperComponent
            component={providerWithEnabled}
          />
        </SecondProvider>
      </ActualProvider>
    );

    render(component);
    expect(component1).not.toBeNull();
    expect(component1).toEqual(expected);
    expect(value).not.toBeNull();
    expect(value).toEqual({ value: 1 });
  });

  it("when using detailed provider with enable being false, should not render the component in the stack ", () => {
    const inactiveDetailedComponent: DetailedFlatComponent = {
      element: <TestProvider />,
      enabled: () => false,
    };
    const component = FlatProvider({
      elements: [
        <SecondProvider />,
        inactiveDetailedComponent,
        <ThirdProvider />,
      ],
    });

    const expected = (
      <SecondProvider>
        <FlatDetailedWrapperComponent component={inactiveDetailedComponent}>
          <ThirdProvider />
        </FlatDetailedWrapperComponent>
      </SecondProvider>
    );
    expect(component).not.toBeNull();
    expect(component).toEqual(expected);
  });
  it("when using detailed provider, should be able to use same context in multiple children providers", () => {
    let value1, value2;
    const providerWithEnabled = {
      element: <TestProvider />,
      context: ActualContext,
      enabled: (context: unknown) => {
        value1 = context;
        return true;
      },
    };
    const providerWithEnabled1 = {
      element: <SecondProvider />,
      context: ActualContext,
      enabled: (context: unknown) => {
        value2 = context;
        return true;
      },
    };
    const component1 = FlatProvider({
      elements: [
        <ActualProvider value={1} />,
        providerWithEnabled,
        providerWithEnabled1,
      ],
    });
    const component = (
      <FlatProvider
        elements={[
          <ActualProvider value={1} />,
          providerWithEnabled,
          providerWithEnabled1,
        ]}
      />
    );
    const expected = (
      <ActualProvider value={1}>
        <FlatDetailedContextWrapperComponent component={providerWithEnabled}>
          <FlatDetailedContextWrapperComponent
            component={providerWithEnabled1}
          />
        </FlatDetailedContextWrapperComponent>
      </ActualProvider>
    );

    render(component);
    expect(component1).not.toBeNull();
    expect(component1).toEqual(expected);
    expect(value1).not.toBeNull();
    expect(value1).toEqual({ value: 1 });
    expect(value2).toEqual(value1);
  });
});
