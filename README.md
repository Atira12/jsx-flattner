# JSX Flattner

## Description

Component flattner for dealing with React provider hell.

Larger provider pyramids will can be hard to read, so "jsx-flattner" can be used to improve the code readability and structure.

## Examples

```
// Provider Pyramid:

return (
  <FirstProvider>
     <SecondProvider>
        <ThirdProvider>
           <ForthProvider>
              <FifthProvider>
                 <SixthProvider>
                    <SeventhProvider>
                            <Component/>
                    </SeventhProvider>
                 </SixthProvider>
              </FifthProvider>
           </ForthProvider>
        </ThirdProvider>
     </SecondProvider>
     </FirstProvider>
);

// List of providers:

const providerList = [
 <FirstProvider/>
 <SecondProvider/>
 <ThirdProvider/>
 <ForthProvider/>
 <FifthProvider/>
 <SixthProvider/>
 <SeventhProvider/>
]

 return (
 <FlatProvider elements={providerList}>
    <Component/>
 </FlatProvider>
 );
```

## Enabled Components

There is the option to provide for detailed components to the list which can be added in/removed from the React component tree.
Depending on state changes or value of providers that have been created above the current component.
Using the "context" option , the context value of a previously added provider (in the list) can be used to enable/disable the current detailed
component;

```
const providerList = [
 <FirstProvider/>,
 <SecondProvider/>,
 {
   element:  <ThirdProvider/>,
   enabled: ({enable }: firstProviderContextValue) =>  enable,
   context: FirstProviderContext
 }

]

 return (
 <FlatProvider elements={providerList}>
    <Component/>
 </FlatProvider>
 );
```

## Detailed Infromation

Example Structure:

- Flattner without detailed components
  This will only nest each component in the previous one.

```
  <FirstProvider>
     <SecondProvider>
        <ThirdProvider>
           <ForthProvider>
                 <Component/>
           </ForthProvider>
        </ThirdProvider>
      </SecondProvider>
  </FirstProvider>
```

- Flattner with detailed components
  For each detailed component there will be created a FlatWrapperComponent which will allow to enable/disable the component depending on
  state change.

```
  <FirstProvider>
    <FlatWrapperComponent>
     <SecondProvider>
      <FlatWrapperComponent>
        <ThirdProvider>
           <ForthProvider>
                 <Component/>
           </ForthProvider>
        </ThirdProvider>
      </FlatWrapperComponent>
      </SecondProvider>
    </FlatWrapperComponent>
  </FirstProvider>
```
