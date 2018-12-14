import React from 'react';
import Select, { components } from 'react-select';
import styled from 'styled-components';
import RightArrow from '@material-ui/icons/ArrowRightAlt';
import ReleaseIcon from '@material-ui/icons/Album';
import ArtistIcon from '@material-ui/icons/Person';
import CircularProgress from '@material-ui/core/CircularProgress';
import StyledItemWithThumbnail from '../StyledItemWithThumbnail';
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
`;

const SelectContainer = styled(components.SelectContainer)`
  margin: 25px;
  width: 25%;

  ${media.phone`
    margin: 0;
    width: 100%;
  `};
`;

const ControlContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  a {
    margin: 0 10px;
  }
`;

const Control = ( actionsLoading, actions, createValueClickHandler ) => props => {
  const { hasValue, getValue } = props;
  return (
    <ControlContainer>
      <components.Control {...props} />
      {hasValue && (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={getValue()[0].infoUrl}
        >
          Info
        </a>
      )}
      {actionsLoading && <CircularProgress />}
      {actions && actions.map(action => (
        <span>action.label</span>
      ))}
    </ControlContainer>
  );
};

const SingleValue = StyledItemWithThumbnail(({ data, children, ...props }) => (
  <components.SingleValue {...props}>
    {data.type === 'Artist' ? <ArtistIcon /> : <ReleaseIcon />}
    {children}
  </components.SingleValue>
));

const hidden = _ => ({
  display: 'none',
});

export default ({
  path: { initialCrumbLoading, crumbs },
  createNodeChangeHandler,
  activeCrumbIndex,
  setActiveCrumbIndex,
  createValueClickHandler,
}) => (
  <div>
    {initialCrumbLoading ? (
      <p>Loading... {/* TODO better loading indicator/empty message */}</p>
    ) : (
      !!crumbs.length && (
        <CrumbsContainer>
          {crumbs.map((crumb, index) => {
            const { source, nodes, loading, actionsLoading } = crumb;

            const isLastCrumb = index === crumbs.length - 1;

            // we only wanna specify menuIsOpen for the LAST crumb, rest of crumbs should not have this prop at all.
            // otherwise, value of this prop will lock Select open or closed
            const additionalProps =
              (activeCrumbIndex === -1 && isLastCrumb) ||
              index === activeCrumbIndex
                ? { menuIsOpen: true }
                : { menuIsOpen: false };

            return (
              <React.Fragment key={`${source.type}_${source.id}`}>
                <Select
                  components={{
                    SelectContainer,
                    SingleValue,
                    Control: Control(actionsLoading, null, createValueClickHandler),
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
                  {...additionalProps}
                  maxMenuHeight={500}
                  closeMenuOnScroll={true}
                  isSearchable={false}
                  isLoading={loading}
                  options={nodes}
                  filterOption={() => true}
                  getOptionLabel={node => node.name}
                  getOptionValue={node => node}
                  closeMenuOnSelect={true}
                  onChange={createNodeChangeHandler(crumb)}
                  onMenuOpen={() => setActiveCrumbIndex(index)}
                />
                {!isLastCrumb ? <CrumbSeparator /> : null}
              </React.Fragment>
            );
          })}
        </CrumbsContainer>
      )
    )}
  </div>
);
