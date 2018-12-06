import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';

const propTypes = {
  onChange: PropTypes.func,
  selectedValue: PropTypes.string,
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  box-sizing: border-box;
  margin: 20px 0;
`;

const neon = keyframes`
  0% {
    text-shadow: 0 0 10px #fff,
                0 0 15px  #fff,
                0 0 25px  #fff,
                0 0 40px  #FF9900,
                0 0 70px  #FF9900,
                0 0 90px  #FF9900,
                0 0 90px  #FF9900;
  }
  100% {
    text-shadow: 0 0 5px #fff,
                0 0 10px #fff,
                0 0 15px #fff,
                0 0 20px #FF9900,
                0 0 35px #FF9900,
                0 0 40px #FF9900,
                0 0 50px #FF9900;
  }
`;

const NeonButton = styled.button`
  text-transform: uppercase;
  flex: 0 0 auto;
  padding: 10px 20px;
  font-size: 1em;
  border: none;
  background: none;

  transition: all 220ms ease-in-out;
  animation: none;
  color: #AAA;

  &:focus {
    outline: 0;
  }

  &.active {
    color: #111;
    animation: ${neon} 1.5s ease-in-out infinite alternate;
    animation-delay: 90ms;
  }
`;

const OptionButton = ({ children, ...props }) => (
  <NeonButton {...props}>{children}</NeonButton>
);

class OptionButtonGroup extends Component {
  handleToggle(value) {
    const { onChange, selectedValue } = this.props;
    const isActive = selectedValue === value;

    if (!isActive) {
      onChange(value);
    }
  }

  render() {
    const { selectedValue, values, ...props } = this.props;

    return (
      <Container {...props}>
        {values.map(value => {
          const onClick = e => this.handleToggle(value, e);
          const className = value === selectedValue ? 'active' : 'inActive';

          return (
            <OptionButton key={value} value={value} className={className} onClick={onClick}>
              {value}
            </OptionButton>
          );
        })}
      </Container>
    );
  }
}

OptionButtonGroup.propTypes = propTypes;

export default OptionButtonGroup;
