import query from './query.pegjs';

export function parseToAst (string) {
  return query.parse(string);
}
