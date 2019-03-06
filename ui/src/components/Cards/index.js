import { compose, withHandlers, withState } from 'recompose';
import { connect } from 'react-redux';
import { changeSelectedNode, updateActiveCard, getCardActions } from '../../actions/path';

import Component from './component';

const mapStateToProps = ({ path }) => ({
  path,
});
const mapDispatchToProps = { changeSelectedNode, updateActiveCard, getCardActions };

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  // withState('activeCardIndex', 'setActiveCardIndex', -1),
  withHandlers({
    createNodeChangeHandler: props => card => node => {
      props.changeSelectedNode(card, node);
      props.getCardActions(card, node);
    },
  })
)(Component);
