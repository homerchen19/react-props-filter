import React from 'react';
import R from 'ramda';

import { DOMProps } from './utils';

const isFn = val => R.equals(R.type(val), 'Function');

const arrayToObject = array =>
  R.reduce(
    (result, prop) => {
      // eslint-disable-next-line no-param-reassign
      result[prop] = prop;

      return result;
    },
    {},
    array
  );

const DOMPropsObj = arrayToObject(DOMProps);

const filterProps = ({
  props,
  requiredProps = [],
  options: { withDOMProps = false, mapProps = null },
}) => {
  const originalProps = R.clone(props);
  const finalProps = {};

  if (R.type(requiredProps) === 'Array' && requiredProps.length !== 0) {
    // eslint-disable-next-line no-param-reassign
    requiredProps = arrayToObject(requiredProps);
  }

  if (mapProps && R.type(mapProps) === 'Object') {
    R.forEachObjIndexed((fn, key) => {
      if (isFn(fn)) {
        const { key: newKey, value: newValue } = fn({
          key,
          value: originalProps[key],
        });

        originalProps[newKey] = newValue;

        if (key !== newKey) {
          delete originalProps[key];
        }
      }
    }, mapProps);
  }

  R.forEachObjIndexed((value, key) => {
    if (withDOMProps && DOMPropsObj[key]) {
      finalProps[key] = value;
    } else if (requiredProps[key]) {
      if (isFn(requiredProps[key])) {
        finalProps[key] = requiredProps[key];
      } else {
        finalProps[key] = value;
      }
    }
  }, originalProps);

  return finalProps;
};

export default function filter(mapper) {
  const mapperKeys = R.keys(mapper);
  const Children = ({ children, ...rest }) =>
    children && isFn(children) && children(rest);

  Children.displayName = 'Filter';

  const reducer = (Component, key) => {
    const { requiredProps, options } = mapper[key];

    // eslint-disable-next-line react/prop-types
    const NewComponent = ({ children, ...rest }) => (
      <Component {...rest}>
        {props => {
          const propsToPass = filterProps({
            props: rest,
            requiredProps,
            options: options || {},
          });

          return children({
            ...props,
            [key]: propsToPass,
          });
        }}
      </Component>
    );

    return NewComponent;
  };

  return R.reduce(reducer, Children, mapperKeys);
}
