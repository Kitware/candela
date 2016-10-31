/* tool to make any string a valid DOM id (resolves regex collisions) */
import { Set } from './SetOps.js';
let ID_LOOKUP = {};
let USED_IDS = new Set();
function makeValidId (str) {
  if (!ID_LOOKUP[str]) {
    let newID = str.replace(/^[^a-z]+|[^\w:.-]+/gi, '');
    let temp = newID;
    let i = 0;
    while (USED_IDS.has(temp)) {
      i += 1;
      temp = newID + i;
    }
    ID_LOOKUP[str] = temp;
    USED_IDS.add(temp);
  }
  return ID_LOOKUP[str];
}
export default makeValidId;
