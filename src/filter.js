import React from 'react';
import R from 'ramda';

import { DOMProps } from './utils';

const isFn = val => R.equals(R.type(val), 'Function');

const filterProps = ({
  props,
  requiredProps = [],
  options: { includeDOMProps = false, mapProps = null },
}) => {
  const originalProps = R.clone(props);
  const finalProps = {};

  if (mapProps && R.type(mapProps) === 'Object') {
    R.forEachObjIndexed((value, propName) => {
      if (isFn(value)) {
        const { propName: newPropName, value: newValue } = value({
          propName,
          value: originalProps[propName],
        });

        originalProps[newPropName] = newValue;

        if (propName !== newPropName) {
          delete originalProps[propName];
        }
      } else if (R.type(value) === 'String' && value !== '') {
        const newPropName = value;

        originalProps[newPropName] = originalProps[propName];

        if (propName !== newPropName) {
          delete originalProps[propName];
        }
      }
    }, mapProps);
  }

  R.forEachObjIndexed((value, key) => {
    if (
      (includeDOMProps && R.contains(key, DOMProps)) ||
      R.contains(key, requiredProps)
    ) {
      finalProps[key] = value;
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
