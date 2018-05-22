import React from 'react';
import R from 'ramda';

import { DOMProps as allDOMProps } from './utils';

const isFn = val => R.equals(R.type(val), 'Function');

const filterProps = ({
  props,
  allowedProps = [],
  mapProps = null,
  options: { DOMProps = false },
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
      } else if (R.type(value) === 'String' && value !== '') {
        const newPropName = value;

        originalProps[newPropName] = originalProps[propName];
      }
    }, mapProps);
  }

  R.forEachObjIndexed((value, key) => {
    if (
      (DOMProps && R.contains(key, allDOMProps)) ||
      R.contains(key, allowedProps)
    ) {
      finalProps[key] = value;
    }
  }, originalProps);

  return finalProps;
};

export default function filter(mapper) {
  const Children = ({ children, ...rest }) =>
    children && isFn(children) && children(rest);

  const reducer = (Component, key, index) => {
    const { allowedProps, mapProps, options } = mapper[key];

    // eslint-disable-next-line react/prop-types
    const NewComponent = ({ children, ...rest }) => (
      <Component {...rest}>
        {props => {
          const propsToPass = filterProps({
            props: rest,
            allowedProps,
            mapProps,
            options: options || {},
          });

          return children(
            index === 0
              ? {
                  all: { ...rest },
                  [key]: propsToPass,
                }
              : {
                  ...props,
                  [key]: propsToPass,
                }
          );
        }}
      </Component>
    );

    NewComponent.displayName = 'PropsFilter';

    return NewComponent;
  };

  return R.keys(mapper).reduce(reducer, Children);
}
