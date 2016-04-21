# candela

* candela.[components](components#readme) - The built-in candela components.
* candela.[VisComponent](VisComponent#readme) - The base class and mixins for
candela components.
* candela.[util](util#readme) - Candela utility functions.
* [Sizing](#sizing)
* [Field Mappings](#field-mappings)
* [Data Types](#data-types)

## Sizing

Components often have a **width** and **height** option, which specify the
width and height of the component in pixels.

## Field Mappings

### Axis Scales

Several components have options that relate to the axes of the visualization.
These are commonly called **x** and **y** but may also have more descriptive
names. The component will often automatically detect the type of values in
the field being mapped to an axis and will create an appropriate axis type,
such as evenly-spaced values for string fields and a continuous-ranged axis for
numeric and date fields. Visualizations showing continuous-ranged axes
often allow pan and zoom of the axis by dragging and scrolling in the
visualization area.

### Color Scales

Many candela components contain a **color** option, which will color the
visual elements by the field specified. When possible, **color** will detect
the type of the column and use an appropriate color scale.
For fields containing string/text values, the visualization will use
a color scale with distinct colors for each unique value.
For fields containing numeric or date values, the visualization will use
a smooth color gradient from low to high values.

## Data Types

### Table

A candela table is an array of records of the form:

```json
[
  {
    "a": 1,
    "b": "Mark",
    "c": "Jun 1, 2010"
  },
  {
    "a": 2,
    "b": "Andy",
    "c": "Feb 6, 2010"
  },
  {
    "a": 3,
    "b": "Joe",
    "c": "Nov 27, 2010"
  }
]
```
