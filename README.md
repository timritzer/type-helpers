# type-helpers
A toolkit of additional Typescript Helper types including Object Path helpers


Some of the available types:


#### Path&lt;SomeType&gt;
  A generic type that is a union of all of the available property paths of the object at any level of nesting. 
  Useful for parameters of methods that need a path to a nested property.
Ex:
```
const anObject = { PropertyA: { PropertyB: "Hello!" } };
let paths: Path<typeof anObject> = "PropertyA"; // OK!
paths = "PropertyA.PropertyB"; // OK!
paths = "PropertyC"; // ERROR! Not a path of the object.
```
