import styled from 'styled-components';

export default component => styled(component)`
  display: flex;
  flex-direction: row;
  align-items: center;

  img,
  svg {
    height: 40px;
    width: 40px;
    margin-right: 10px;
  }
`;
