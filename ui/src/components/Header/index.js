import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { setSearchType } from '../../actions/search';
import { showSplash } from '../../actions/user';

import Component from './component';

const mapStateToProps = ({ user, search: { searchType } }) => ({
  user,
  searchType,
});
const mapDispatchToProps = { setSearchType, showSplash };

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
