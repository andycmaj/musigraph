import { compose, withHandlers, withState } from 'recompose';
import { connect } from 'react-redux';
import { changeNodeValue, getCrumbActions } from '../../actions/path';

import Component from './component';

const mapStateToProps = ({ path }) => ({
  path,
});
const mapDispatchToProps = { changeNodeValue, getCrumbActions };

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
        props.getCrumbActions(crumb, value);
        props.setActiveCrumbIndex(-1);
      }
    },
    createValueClickHandler: props => value => e => {
      e.stopPropagation();
      alert(value.infoUrl);
    },
  })
)(Component);
