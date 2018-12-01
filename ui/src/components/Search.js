import React from 'react';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import Select, { components } from 'react-select';
import debounceHandler from '@hocs/debounce-handler';
import { doSearch } from '../actions/search';
import { resetPath } from '../actions/path';
import styled from 'styled-components';

const Option = ({ data, children, ...props }) => (
  <components.Option {...props}>
    {children}
    <img alt={data.name} src={data.thumbnailUrl} />
  </components.Option>
);

const WithSmallThumbnail = component => styled(component)`
  img {
    height: 20px;
    width: 20px;
  }
`;

const Value = ({ data, children, ...props }) => (
  <components.SingleValue {...props}>
    {children}
    <img alt={data.name} src={data.thumbnailUrl} />
  </components.SingleValue>
);

const SelectContainer = styled(components.SelectContainer)`
  z-index: 100;
`;

const Search = ({
  search: { loading, error, data },
  handleInputChange,
  handleChange,
}) => (
  <Select
    isLoading={loading}
    components={{
      Option: WithSmallThumbnail(Option),
      SingleValue: WithSmallThumbnail(Value),
      SelectContainer
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
