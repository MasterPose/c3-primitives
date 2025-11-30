import { getByPath } from 'dot-path-value';

export function dot(path: string, obj: any) {
  if (path === '.' || path === '') return obj;

  let value;

  try {
    value = getByPath(obj, path);
  } catch (error) {
    return undefined;
  }

  if (value === undefined || value === null) {
    return value;
  }

  switch (typeof value) {
    case typeof true:
      return value ? 1 : 0;
    case typeof 0:
      return value;
    case typeof {}:
    case typeof []:
      return JSON.stringify(value);
    default:
      return `${value}`;
  }
}
