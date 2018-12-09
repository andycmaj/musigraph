import { css } from 'styled-components';

const screenWidths = {
  phone: 500,
};

// https://www.styled-components.com/docs/advanced#media-templates
export default Object.keys(screenWidths).reduce((acc, label) => {
  acc[label] = (...args) => css`
    @media (max-width: ${screenWidths[label]}px) {
      ${css(...args)};
    }
  `;
  return acc;
}, {});
