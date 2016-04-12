# [candela](..#readme).VisComponent

The base class for Candela visualization components.

This class is intentionally very minimal, because there are only a few common features of
all Candela components:

1. Candela components perform some type of visualization that may be rendered in a web environment.
2. Candela components are instantiated with the syntax [new VisComponent(el, options)](#new-viscomponentel-options).
3. Candela components report their expected inputs in [VisComponent.spec](#viscomponentspec).

## new VisComponent(el, options)

**Note**: The constructor for the abstract superclass is empty. You should use the constructor for specific subclasses of VisComponent.

* **el** is a valid container for the visualization. The container will often be
a DOM element such as `<div>`, but may need to be another type for certain
visualizations.

* **options** is an object containing the initial options for the visualization.
This includes any data, visual mappings, or other settings pertinent to the
visualization. Options are specified in the form `{name: value}`.

## VisComponent.spec

**Note**: The specification for the abstract superclass is empty.

The `spec` field is a static property on the component's class which describes
how to set up the visualization.

| Property    | Type   | Description  |
| :--------   | :----- | :----------- |
| container   | Class  | Optional. The type of container this visualization can be added to. Default is DOMElement if unset. |
| options     | Array of [Option](#option-specification) | A specification of options needed for this visualization. This is used to introspect the component to implement features such as automatic UI building. |

### Option Specification

The specification for an option is an object containing the following properties:

| Property    | Type   | Description  |
| :--------   | :----- | :----------- |
| name        | String | The name of the option. |
| type        | String | The type of the option. Type and format follow [girder_worker types/formats](http://girder-worker.readthedocs.org/en/latest/types-and-formats.html). |
| format      | String | The format (specific encoding within a type) of the option. Type and format follow [girder_worker types/formats](http://girder-worker.readthedocs.org/en/latest/types-and-formats.html). |
| domain      | [Domain](#domain-specification) | Optional. A restriction on this option’s set of allowed values. |

### Domain Specification

The domain of an option restricts the set of allowed values for an option. It is an object with the following properties:

| Property    | Type   | Description  |
| :--------   | :----- | :----------- |
| mode        | String | The domain mode, one of `'choice'` or `'field'`. The `'choice'` mode will allow a fixed set of options set in the `'from'` field. The `'field'` mode will allow a field or list of fields from another input. If the option type is `'string'`, the option is a single field, and if the option type is `'string_list'`, the option accepts a list of fields. |
| from        | Array or String | If the mode is `'choice'`, it is the list of strings to use as a dropdown. If the mode is `'field'`, it is the name of the input from which to extract fields.
| fieldTypes  | Array of String | If mode is `'field'`, this specifies the types of fields to support. This array may contain any combination of [datalib's supported field types](https://github.com/vega/datalib/wiki/Import#dl_type_infer) which include `'string'`, `'date'`, `'number'`, `'integer'`, and `'boolean'`. |
