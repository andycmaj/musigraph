import { compose } from 'recompose';
import { connect } from 'react-redux';
import { connectSpotify, dismissSplash } from '../../actions/user';

import Component from './component';

const mapStateToProps = ({ user }) => ({ user });
const mapDispatchToProps = { connectSpotify, dismissSplash };

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Component);
