import React from 'react';
import { onlyUpdateForKeys } from 'recompose';
import styled from 'styled-components';

import Select, { components } from 'react-select';
import RightArrow from '@material-ui/icons/ArrowRightAlt';
import ReleaseIcon from '@material-ui/icons/Album';
import ArtistIcon from '@material-ui/icons/Person';
import StyledItemWithThumbnail from '../StyledItemWithThumbnail';
import AudioAction from './AudioAction';
import GoToIcon from '@material-ui/icons/OpenInBrowser';
import Tooltip from '@material-ui/core/Tooltip';
import StyledAction from './StyledAction';

import media from '../media';

const CrumbSeparator = styled(RightArrow)`
  margin: 25px 0;
  min-height: 38px;

  ${media.phone`
    transform: rotate(90deg);
    min-height: 0;
    margin: 0 50px;
  `};
`;

const CrumbsContainer = styled.div`
  display: flex;
  flex-flow: row wrap;
  padding: 25px;
  justify-content: space-between;
  align-items: center;

  ${media.phone`
    flex-flow: column;
    align-items: unset;
  `}
`;

const SelectContainer = styled(components.SelectContainer)`
  margin: 25px;
  flex: 1 0 auto;

  ${media.phone`
    margin: 0;
  `};
`;

const ControlContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex: 1 0 25%;

  a {
    margin: 0 10px;
  }
`;

const actions = {
  Audio: action => <AudioAction action={action} />,
  ExternalLink: ({ label, url }) => (
    <Tooltip title={label}>
      <StyledAction target="_blank" rel="noopener noreferrer" href={url}>
        <GoToIcon />
      </StyledAction>
    </Tooltip>
  ),
};

const renderAction = ({ type, ...action }) => (
  <span key={action.url}>{actions[type](action)}</span>
);

const SingleValue = StyledItemWithThumbnail(({ data, children, ...props }) => (
  <components.SingleValue {...props}>
    {data.type === 'Artist' ? <ArtistIcon /> : <ReleaseIcon />}
    {children}
  </components.SingleValue>
));

const hidden = _ => ({
  display: 'none',
});

const Crumb = ({
  menuIsOpen,
  createNodeChangeHandler,
  setActiveCrumbIndex,
  crumb,
  index,
  actionsLoading,
}) => {
  const { nodes, loading, source } = crumb;
  return (
    <Select
      components={{
        SelectContainer,
        SingleValue,
      }}
      styles={{
        dropdownIndicator: hidden,
        indicatorSeparator: hidden,
        valueContainer: provided => ({
          ...provided,
          height: '50px',
        }),
        control: provided => ({
          ...provided,
          border: 'none',
          flex: '1 0 auto',
        }),
      }}
      placeholder={
        source.type === 'Artist'
          ? `${source.name}'s Releases...`
          : `Artists on ${source.name}...`
      }
      menuIsOpen={menuIsOpen}
      maxMenuHeight={500}
      closeMenuOnScroll={true}
      isSearchable={false}
      isLoading={loading || actionsLoading}
      options={nodes}
      filterOption={() => true}
      getOptionLabel={node => node.name}
      getOptionValue={node => node}
      closeMenuOnSelect={true}
      onChange={createNodeChangeHandler(crumb)}
      onMenuOpen={() => setActiveCrumbIndex(index)}
    />
  );
};

const PureCrumb = onlyUpdateForKeys([
  'id',
  'menuIsOpen',
  'actionsLoading',
])(Crumb);

export default ({
  path: { initialCrumbLoading, crumbs },
  createNodeChangeHandler,
  activeCrumbIndex,
  setActiveCrumbIndex,
}) => (
  <div>
    {initialCrumbLoading ? (
      <p>Loading... {/* TODO better loading indicator/empty message */}</p>
    ) : (
      !!crumbs.length && (
        <CrumbsContainer>
          {crumbs.map((crumb, index) => {
            const { source, actions, actionsLoading } = crumb;

            const crumbId = `${source.type}_${source.id}`;

            const isLastCrumb = index === crumbs.length - 1;

            // we only wanna specify menuIsOpen for the LAST crumb, rest of crumbs should not have this prop at all.
            // otherwise, value of this prop will lock Select open or closed
            const menuIsOpen =
              (activeCrumbIndex === -1 && isLastCrumb) ||
              index === activeCrumbIndex;

            return (
              <React.Fragment key={crumbId}>
              <ControlContainer>
                <PureCrumb
                  id={crumbId}
                  crumb={crumb}
                  actionsLoading={actionsLoading}
                  index={index}
                  createNodeChangeHandler={createNodeChangeHandler}
                  setActiveCrumbIndex={setActiveCrumbIndex}
                  menuIsOpen={menuIsOpen}
                />
                {actions && actions.map(renderAction)}
                </ControlContainer>
                {!isLastCrumb ? <CrumbSeparator /> : null}
              </React.Fragment>
            );
          })}
        </CrumbsContainer>
      )
    )}
  </div>
);
