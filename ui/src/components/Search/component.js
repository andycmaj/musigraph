import React from 'react';
import Select, { components } from 'react-select';
import StyledItemWithThumbnail from '../StyledItemWithThumbnail';
import OptionButtonGroup from '../OptionButtonGroup';

const Option = ({ data, children, ...props }) => (
  <components.Option {...props}>
    <img alt="" src={data.thumbnailUrl} />
    <span>{children}</span>
  </components.Option>
);

const Value = ({ data, children, ...props }) => (
  <components.SingleValue {...props}>
    <img alt={data.name} src={data.thumbnailUrl} />
    <span>{children}</span>
  </components.SingleValue>
);

const searchTypes = ['artist', 'release'];

const hidden = _ => ({
  display: 'none',
});

export default ({
  search: { selectedResult, loading, error, data },
  handleInputChange,
  handleChange,
  searchType,
  handleSearchTypeChange,
}) => (
  <section>
    <OptionButtonGroup
      selectedValue={searchType}
      onChange={handleSearchTypeChange}
      values={searchTypes}
    />
    <Select
      styles={{
        dropdownIndicator: hidden,
        indicatorSeparator: hidden,
        valueContainer: provided => ({
          ...provided,
          height: '50px',
        }),
        menu: provided => ({
          ...provided,
          zIndex: 100,
        }),
      }}
      value={selectedResult}
      isLoading={loading}
      components={{
        Option: StyledItemWithThumbnail(Option),
        SingleValue: StyledItemWithThumbnail(Value),
      }}
      filterOption={() => true}
      options={data}
      onChange={handleChange}
      onInputChange={handleInputChange}
      getOptionLabel={node => node.name}
      getOptionValue={node => node.id}
      closeMenuOnSelect={true}
      isClearable={true}
      placeholder={`Search ${searchType}s..`}
    />
  </section>
);