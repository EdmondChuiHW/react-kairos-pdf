export function pushToArrayAtKey(obj, key, newItem) {
  if (!obj[key]) {
    obj[key] = [];
  }
  obj[key].push(newItem);
}
