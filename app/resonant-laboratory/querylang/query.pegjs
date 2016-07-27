{
  function makeNode (operator, operands) {
    return {
      operator: operator,
      operands: operands
    };
  }

  function between (lowValue, op1, field, op2, highValue) {
    if ((op1 !== '<' || op1 !== '<=') && (op2 !== '<' && op2 !== '<=')) {
      error('operators in a betweenness expression must be < or <=');
    }

    var opcopy = '>' + op1.slice(1);

    return {
      operator: 'and',
      operands: [
        makeNode(opcopy, [field, lowValue]),
        makeNode(op2, [field, highValue])
      ]
    };
  }
}

start
  = or

or
  = left:and _ "or" _ right:or { return makeNode('or', [left, right]); }
  / and

and
  = left:atom _ "and" _ right:and { return makeNode('and', [left, right]); }
  / atom

atom
  = "not" _ "(" expr:start _ ")" { return makeNode('not', expr); }
  / field:identifier _ op:inclusion _ matches:list { return makeNode(op, [field, matches]); }
  / field:identifier _ op:operator _ value:value { return makeNode(op, [field, value]); }
  / lowValue:value _ op1:operator _ field:identifier _ op2:operator _ highValue:value { return between(lowValue, op1, field, op2, highValue); }
  / "(" _ expr:start _ ")" { return expr; }

inclusion
  = "in"
  / "not in"

operator
  = "<="
  / "<"
  / ">="
  / ">"
  / "="
  / "!="

list
  = "[" _ values:value_list _ "]" { return values; }

value_list
  = first:value _ "," _ rest:value_list { return [first].concat(rest); }
  / value:value { return [value]; }
  / "" { return []; }

identifier
  = chars:([^ ():]*) type:("::" type)? { return {identifier: chars.join(''), type: type ? type[1] : null}; }
  / string

type
  = "number" / "integer" / "boolean" / "date" / "string"

value
  = number
  / string
  / boolean

number
  = negate:'-'? value:[0-9]+ frac:(('.'[0-9]*)?) {
    negate = negate ? -1 : 1;
    var intpart = value.join('');
    frac = frac ? '.' + frac[1].join('') : '';

    return negate * parseFloat(intpart + frac);
  }

string
  = '"' chars:([^\r\n"]*) '"' { return chars.join(''); }
  / "'" chars:([^\r\n']*) "'" { return chars.join(''); }

boolean
  = value:("true" / "false") { return value === "true"; }
 _
  = [ \t\n\r]*
