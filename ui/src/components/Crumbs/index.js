import { compose, withHandlers, withState } from 'recompose';
import { connect } from 'react-redux';
import { changeNodeValue } from '../../actions/path';

import Component from './component';

const mapStateToProps = ({ path }) => ({
  path,
});
const mapDispatchToProps = { changeNodeValue };

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withState('activeCrumbIndex', 'setActiveCrumbIndex', -1),
  withHandlers({
    createNodeChangeHandler: props => crumb => (value, { action }) => {
      if (action === 'select-option') {
        props.changeNodeValue(crumb, value);
        props.setActiveCrumbIndex(-1);
      }
    },
  })
)(Component);
