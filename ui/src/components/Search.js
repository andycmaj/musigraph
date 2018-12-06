import React from 'react';
import { compose, withHandlers, withState } from 'recompose';
import { connect } from 'react-redux';
import Select, { components } from 'react-select';
import debounceHandler from '@hocs/debounce-handler';
import { doSearch } from '../actions/search';
import { resetPath, clearPath } from '../actions/path';
import StyledItemWithThumbnail from './StyledItemWithThumbnail';
import OptionButtonGroup from './OptionButtonGroup';

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

const Search = ({
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
        indicatorsContainer: _ => ({
          display: 'none'
        }),
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

const mapStateToProps = ({ search }) => ({ search });
const mapDispatchToProps = { doSearch, resetPath, clearPath };

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  debounceHandler('doSearch', 300),
  withState('searchType', 'setSearchType', 'artist'),
  withHandlers({
    handleChange: props => (value, { action }) => {
      if (action === 'select-option') {
        props.resetPath(value);
      }
    },
    handleInputChange: props => (value, { action }) => {
      if (action === 'input-change') {
        props.doSearch(props.searchType, value);
      }
    },
    handleSearchTypeChange: props => (value) => {
      props.setSearchType(value);
      props.clearPath();
    }
  })
)(Search);
