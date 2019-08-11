import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import {
  changeSelectedNode,
  updateActiveCard,
  getCardActions,
} from '../../actions/path';

import Component from './component';

const mapStateToProps = ({ path, user: { isUsingSpotify } }) => ({
  path,
  actionsEnabled: isUsingSpotify,
});
const mapDispatchToProps = {
  changeSelectedNode,
  updateActiveCard,
  getCardActions,
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  // withState('activeCardIndex', 'setActiveCardIndex', -1),
  withHandlers({
    createNodeChangeHandler: props => card => node => {
      props.changeSelectedNode(card, node);
      if (props.actionsEnabled) {
        props.getCardActions(card, node);
      }
    },
  })
)(Component);
