import React from 'react';
import { compose, withHandlers } from 'recompose';
import { find, propEq, any } from 'ramda';
import { connect } from 'react-redux';
import { Graph } from 'react-d3-graph';
import styled from 'styled-components';
import { getAdjacentNodes } from '../actions/graph';

const graphConfig = {
  automaticRearrangeAfterDropNode: false,
  directed: false,
  collapsible: true,
  height: 1000,
  highlightDegree: 1,
  highlightOpacity: 0.2,
  linkHighlightBehavior: false,
  maxZoom: 8,
  minZoom: 0.1,
  nodeHighlightBehavior: true,
  panAndZoom: false,
  staticGraph: false,
  width: 1000,
  focusAnimationDuration: 0.75,
  d3: {
    alphaTarget: 0.05,
    gravity: -100,
    linkLength: 100,
    linkStrength: 1,
  },
  node: {
    color: '#d3d3d3',
    fontColor: 'black',
    fontSize: 12,
    fontWeight: 'normal',
    highlightColor: 'red',
    highlightFontSize: 12,
    highlightFontWeight: 'bold',
    highlightStrokeColor: 'SAME',
    highlightStrokeWidth: 1.5,
    labelProperty: 'name',
    mouseCursor: 'pointer',
    opacity: 1,
    renderLabel: true,
    size: 100,
    strokeColor: 'none',
    strokeWidth: 1.5,
    svg: '',
    symbolType: 'circle',
    // viewGenerator: node => <StyledNode node={node} />,
  },
  link: {
    color: '#d3d3d3',
    opacity: 1,
    semanticStrokeWidth: false,
    strokeWidth: 4,
    highlightColor: 'blue',
  },
};

const Node = ({ className, node }) => (
  <div className={className}>{node.name}</div>
);

const StyledNode = styled(Node)`
  border-radius: 5%;
  background-color: lightblue;
`;

const MusiGraph = ({ loading, originNode, data, visitNode }) =>
  loading ? (
    <div>loading...</div>
  ) : !!originNode ? (
    <Graph
      id={`graph-${originNode.id}`}
      data={data}
      config={graphConfig}
      onClickNode={visitNode}
    />
  ) : (
    <div>Search for your starting artist</div>
  );

const mapStateToProps = ({ graph }) => graph;
const mapDispatchToProps = { getAdjacentNodes };

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withHandlers({
    visitNode: props => nodeId => {
      const id = parseInt(nodeId, 10);
      if (any(propEq('source', id))(props.data.links)) {
        return;
      }

      const clickedNode = find(propEq('id', id))(props.data.nodes);
      props.getAdjacentNodes(clickedNode);
    },
  })
)(MusiGraph);
