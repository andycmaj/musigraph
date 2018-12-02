import React from 'react';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import Select, { components } from 'react-select';
import debounceHandler from '@hocs/debounce-handler';
import { doSearch } from '../actions/search';
import { resetPath } from '../actions/path';
import styled from 'styled-components';
import StyledItemWithThumbnail from './StyledItemWithThumbnail';

const customStyles = {
  valueContainer: (provided) => ({
    ...provided,
    height: '50px',
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 100
  })
};

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

const Search = ({
  search: { loading, error, data },
  handleInputChange,
  handleChange,
}) => (
  <Select
    styles={customStyles}
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
  />
);

const mapStateToProps = ({ search }) => ({ search });
const mapDispatchToProps = { doSearch, resetPath };

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  debounceHandler('doSearch', 300),
  withHandlers({
    handleChange: props => (value, { action }) => {
      if (action === 'select-option') {
        props.resetPath(value);
      }
    },
    handleInputChange: props => (value, { action }) => {
      if (action === 'input-change') {
        props.doSearch(value);
      }
    },
  })
)(Search);
