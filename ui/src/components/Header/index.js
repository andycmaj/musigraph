import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { setSearchType } from '../../actions/search';

import Component from './component';

const mapStateToProps = ({ user, search: { searchType } }) => ({
  user,
  searchType,
});
const mapDispatchToProps = { setSearchType };

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withHandlers({
    handleSearchTypeChange: props => value => {
      props.setSearchType(value);
    },
  })
)(Component);
