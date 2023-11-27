
# JSX Flattner

# Description

JSX structure flattner for dealing with React pyramid of doom.

# Installation 

```
npm install jsx-flattner
```

# Standard Component

```
// Pyramid of doom:

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

// List of providers/components with children:

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

# Detailed (Enabled) Components

Components can be added to the list as a object type:

- Permanently present components
```
 const components = [
  <PreviousContextProviderUsedInEnable/>
  {
   // element to be wrapped
   element: <Component {...parameters}/>,
   
   // when should this element be available in the react structure
   enabled: () => true, 
  }
 ]
```

- Conditionally present components
```
 const components = [
  <PreviousContextProviderUsedInEnable/>
  {
   // element to be wrapped
   element: <Component {...parameters}/>,
   
   // when should this element be available in the react structure
   enabled: (prevContextValue) => prevContextValue.checkState, 

   // Context of previously added Provider
   context: PreviousContextProviderUsedInEnable
  }
 ]
```
