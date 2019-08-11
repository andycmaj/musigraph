import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import { getCardActions } from '../../actions/path';

import Component from './component';

const mapStateToProps = ({ user: { isUsingSpotify } }) => ({
  actionsEnabled: isUsingSpotify,
});
const mapDispatchToProps = { getCardActions };

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  lifecycle({
    componentDidMount() {
      const { actionsEnabled, getCardActions, card } = this.props;

      if (actionsEnabled) {
        getCardActions(card, card.source);
      }
    },
  })
)(Component);
