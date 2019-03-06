import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { setSearchType } from '../../actions/search';
import { showSplash } from '../../actions/user';
import { getActiveCard } from '../../reducers/path';

import Component from './component';

const mapStateToProps = ({ user, search: { searchType }, path }) => ({
  user,
  searchType,
  path,
  activeCard: getActiveCard(path),
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
