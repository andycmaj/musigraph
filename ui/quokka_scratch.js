import {
  findIndex,
  and,
  curry,
  takeWhile,
  whereEq,
  not,
  props,
  concat,
  uniqBy,
  uniq,
  join,
  differenceWith,
  omit
} from 'ramda';

const crumbs = [{ source: 1, options: [1, 2, 3], loading: true }];
const newCrumb = {
  source: crumbs[0].source,
  options: crumbs[0].options,
  loading: false
};

const replaceTailNodes = (pathNodes, changedNode) => {
  const index = findIndex(whereEq(omit(['loading'], changedNode)))(pathNodes);
  return [
    ...pathNodes.slice(0, index),
    {
      ...pathNodes[index],
      loading: false,
    },
    { new: true },
  ];
};

console.log(replaceTailNodes(crumbs, newCrumb));
