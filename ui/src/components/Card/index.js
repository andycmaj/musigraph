import { compose, withHandlers, withState, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import { changeSelectedNode, getCardActions } from '../../actions/path';

import Component from './component';

const mapDispatchToProps = { getCardActions };

export default compose(
  connect(
    null,
    mapDispatchToProps
  ),
  lifecycle({
    componentDidMount() {
      this.props.getCardActions(this.props.card, this.props.card.source);
    }
  }),
)(Component);
