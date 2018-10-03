import { VisComponent } from '@candela/core';

const BaseType = {
  numeric: 0,
  categorical: 1,
  color: 2
};

class FieldType {
  constructor (basetype) {
    if (this === undefined) {
      return new FieldType(...arguments);
    }
    this.type = basetype;
  }
}

class ValueType {
  constructor (basetype) {
    if (this === undefined) {
      return new ValueType(...arguments);
    }
    this.type = basetype;
  }
}

const Type = {
  numeric: BaseType.numeric,
  categorical: BaseType.categorical,
  color: BaseType.color,
  table: 3,
  field: FieldType,
  value: ValueType
};

class Field {
  constructor (field) {
    this.field = field;
  }
}

class Value {
  constructor (value) {
    this.value = value;
  }
}

function inferType (value) {

}

function isTable (v) {
  return isArray(v) && v.every(isObject);
}

function isNumeric (v) {
  return typeof v === 'number';
}

function isArray (v) {
  return Array.isArray(v);
}

function isField (v) {
  return v instanceof Field;
}

function isValue

function isObject (v) {
  return v && !isArray(v) && typeof v === 'object';
}

function matchType (typeSpec, types) {

}

function validate (opts, spec) {
  let errors = Object.keys(spec).map(s => {
    const present = opts.hasOwnProperty(s);

    if (s.required && !present) {
      return `required option ${s} is missing`;
    }

    if (present) {
      if (!matchType(spec[s], s.type)) {
        return `option ${s} must be one of: ${s.type.map(toString)}`;
      }
    }

    return null;
  });

  return errors.filter(e => e !== null);
}

export class ScatterPlot extends VisComponent {
  constructor (el, options) {
    super(el);

    const errors = validate(options, this.spec());
    if (errors) {
      throw new Error(errors);
    }
  }

  spec () {
    return {
      data: {
        required: true,
        type: [
          types.table
        ]
      },
      x: {
        required: true,
        type: [
          types.field(types.numeric)
        ]
      },
      y: {
        required: true,
        type: [
          types.field(types.numeric)
        ]
      },
      color: {
        required: false,
        type: [
          types.field(types.numeric),
          types.field(types.categorical),
          types.value(types.color)
        ]
      },
      size: {
        required: false,
        type: [
          types.field(types.numeric),
          types.value(types.color)
        ]
      },
      shape: {
        required: false,
        type: [
          types.field(types.categorical)
        ]
      }
    };
  }
};
