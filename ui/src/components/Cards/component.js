import React from 'react';
import styled from 'styled-components';

import RightArrow from '@material-ui/icons/ArrowRightAlt';
import Card from '../Card';
import media from '../media';
import Carousel from 'nuka-carousel';

const CardSeparator = styled(RightArrow)`
  margin: 25px 0;
  min-height: 38px;

  ${media.phone`
    transform: rotate(90deg);
    min-height: 0;
    margin: 0 50px;
  `};
`;

const CarouselContainer = styled(Carousel)`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  height: 100%;

  ul {
    height: 100%!;
  }
`;

const Cards = ({
  path: { initialCardLoading, activeCardIndex, cards },
  createNodeChangeHandler,
  updateActiveCard,
  className
}) => (
  <article className={className}>
    {initialCardLoading && <p>Loading... </p>}
    {!!cards.length && (
      <CarouselContainer
        withoutControls={true}
        slidesToShow={1}
        slideIndex={activeCardIndex}
        afterSlide={updateActiveCard}
      >
        {cards.map((card, index) => {
          const { source } = card;
          const cardId = `${source.type}_${source.id}`;
          const nodeChangeHandler = createNodeChangeHandler(card);

          return (
            <Card
              key={cardId}
              card={card}
              index={index}
              nodeChangeHandler={nodeChangeHandler}
            />
          );
        })}
      </CarouselContainer>
    )}
  </article>
);

export default Cards;
