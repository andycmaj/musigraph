import React, { ComponentType } from 'react';
import styled from 'styled-components';

export default (
  WrappedComponent: ComponentType<any>,
  { swallowProps = [] } = {}
) => {
  const Wrapper = ({ children, ...props }) => {
    swallowProps.forEach(propName => {
      delete props[propName];
    });
    return <WrappedComponent {...props}>{children}</WrappedComponent>;
  };
  return styled(Wrapper);
};
