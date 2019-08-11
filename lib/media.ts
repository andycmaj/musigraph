import { css } from 'styled-components';
import { mapObjIndexed } from 'ramda';

const breakPoints = {
  phone: 500,
};

export default mapObjIndexed(
  width => (...args) => css`
    @media (max-width: ${width}px) {
      ${css(...args)};
    }
  `,
  breakPoints
);
