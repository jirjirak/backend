import { isEmpty } from 'lodash';

export const ListToTree = (arr = []) => {
  const map = {};
  const res = [];
  let node;
  let i: number;

  for (i = 0; i < arr.length; i += 1) {
    map[arr[i].id] = i;
    arr[i].children = [];
  }

  for (i = 0; i < arr.length; i += 1) {
    node = arr[i];
    if (node.parent) {
      if (isEmpty(arr[map[node.parent]])) continue;
      arr[map[node.parent]].children.push(node);
    } else {
      res.push(node);
    }
  }

  return res;
};
