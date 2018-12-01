import React from 'react';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import Select, { components } from 'react-select';
import { changeNodeValue } from '../actions/path';
import styled, { css } from 'styled-components';
import RightArrow from '@material-ui/icons/ArrowRightAlt';
import ReleaseIcon from '@material-ui/icons/Album';
import ArtistIcon from '@material-ui/icons/Person';

const sizes = {
  phone: 500,
};

// https://www.styled-components.com/docs/advanced#media-templates
const media = Object.keys(sizes).reduce((acc, label) => {
  acc[label] = (...args) => css`
    @media (max-width: ${sizes[label]}px) {
      ${css(...args)};
    }
  `;
  return acc;
}, {});

const CrumbSeparator = styled(RightArrow)`
  margin: 25px 0;
  min-height: 38px;

  ${media.phone`
    transform: rotate(90deg);
    min-height: 0;
    margin: 0;
  `};
`;

const CrumbsContainer = styled.div`
  display: flex;
  flex-flow: row wrap;
  padding: 25px;
  justify-content: space-around;
`;

const SelectContainer = styled(components.SelectContainer)`
  margin: 25px;
  width: 25%;

  ${media.phone`
    margin: 0;
    width: 100%;
  `};
`;

const SingleValue = ({ data, children, ...props }) => (
  <components.SingleValue {...props}>
    <a target="_blank" href={data.infoUrl}>
      {children}
    </a>
    {data.type === 'Artist' ? <ArtistIcon /> : <ReleaseIcon />}
  </components.SingleValue>
);

const Control = styled(components.Control)`
  border: none;
`;

const Crumbs = ({ path: { crumbs }, createNodeChangeHandler }) => (
  <div>
    {!!crumbs.length ? (
      <CrumbsContainer>
        {crumbs.map((crumb, index) => {
          const { source, nodes, loading } = crumb;

          const isLastCrumb = index === crumbs.length - 1;

          // we only wanna specify menuIsOpen for the LAST crumb, rest of crumbs should not have this prop at all.
          // otherwise, value of this prop will lock Select open or closed
          const additionalProps = isLastCrumb ? { menuIsOpen: true } : null;

          return (
            <>
              <Select
                placeholder={
                  source.type === 'Artist'
                    ? `${source.name}'s Releases...`
                    : `Artists on ${source.name}...`
                }
                {...additionalProps}
                isSearchable={false}
                isLoading={loading}
                key={`${source.type}_${source.id}`}
                options={nodes}
                components={{ SelectContainer, SingleValue, Control }}
                filterOption={() => true}
                getOptionLabel={node => node.name}
                getOptionValue={node => node}
                closeMenuOnSelect={true}
                onChange={createNodeChangeHandler(crumb)}
              />
              {!isLastCrumb ? <CrumbSeparator /> : null}
            </>
          );
        })}
      </CrumbsContainer>
    ) : (
      <div>search for an artist to start</div>
    )}
  </div>
);

const mapStateToProps = ({ path }) => ({ path });
const mapDispatchToProps = { changeNodeValue };

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withHandlers({
    createNodeChangeHandler: props => crumb => (value, { action }) => {
      if (action === 'select-option') {
        props.changeNodeValue(crumb, value);
      }
    },
  })
)(Crumbs);
