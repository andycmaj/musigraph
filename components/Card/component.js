import React from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';

// const SingleValue = StyledItemWithThumbnail(({ data, children, ...props }) => (
//   <components.SingleValue {...props}>
//     {data.type === 'Artist' ? <ArtistIcon /> : <ReleaseIcon />}
//     {data.name}
//   </components.SingleValue>
// ));
const LabelSub = styled.span`
  color: lightslategrey;
  font-weight: 100;
`;

const getNodeLabel = ({ name, subTitle }) => (
  <span>
    {name.trim()}
    {!!subTitle && <LabelSub> ({subTitle})</LabelSub>}
  </span>
);

const NodeItem = styled.li`
  list-style: none;

  button {
    text-align: left;
    width: 100%;
  }

  span {
    justify-content: unset;
  }
`;

const Card = ({ nodeChangeHandler, card }) => {
  const { nodes } = card;
  return (
    <section>
      <article>
        <ul>
          {nodes.map(node => {
            const nodeId = `${node.type}_${node.id}`;
            return (
              <NodeItem key={nodeId}>
                <Button onClick={() => nodeChangeHandler(node)}>
                  {getNodeLabel(node)}
                </Button>
              </NodeItem>
            );
          })}
        </ul>
      </article>
    </section>
  );
};

export default Card;
