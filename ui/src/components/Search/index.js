import { compose, withHandlers, withState } from 'recompose';
import { connect } from 'react-redux';
import debounceHandler from '@hocs/debounce-handler';
import { doSearch } from '../../actions/search';
import { resetPath, clearPath } from '../../actions/path';

import Component from './component';

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
    handleSearchTypeChange: props => value => {
      props.setSearchType(value);
      props.clearPath();
    },
  })
)(Component);
