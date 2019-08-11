import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import debounceHandler from '@hocs/debounce-handler';
import { doSearch } from '../../actions/search';
import { resetPath } from '../../actions/path';

import Component from './component';

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
        props.doSearch(props.search.searchType, value);
      }
    },
  })
)(Component);
