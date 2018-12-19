import React from 'react';
import OptionButtonGroup from '../OptionButtonGroup';

const searchTypes = ['artist', 'release'];

const Header = ({ searchType, handleSearchTypeChange }) => (
  <section>
    <OptionButtonGroup
      selectedValue={searchType}
      onChange={handleSearchTypeChange}
      values={searchTypes}
    />
  </section>
);

export default Header;