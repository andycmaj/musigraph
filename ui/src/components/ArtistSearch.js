import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import debounceHandler from '@hocs/debounce-handler';
import Downshift from 'downshift';
import { doSearch } from '../actions/search';
import { loadGraph } from '../actions/graph';

const ArtistSearch = ({
  search: { loading, error, data },
  doSearch,
  loadGraph,
}) => (
  <section>
    <Downshift
      onChange={node => loadGraph(node)}
      itemToString={item => item.name}
    >
      {({
        getInputProps,
        getItemProps,
        getLabelProps,
        inputValue,
        selectedItem,
        highlightedIndex,
        isOpen,
      }) => (
        <div>
          <br />
          <input
            {...getInputProps({
              // TODO: set value to selectedItem on downshift onChange
              placeholder: 'Start with an artist...',
              onChange: e => doSearch(e.target.value),
            })}
          />
          {isOpen ? (
            <div>
              {error ? (
                <div>{error.message}</div>
              ) : !!loading ? (
                <div>Loading...</div>
              ) : (
                data.map((item, index) => (
                  <div
                    {...getItemProps({
                      item,
                      index,
                      key: index,
                      style: {
                        backgroundColor:
                          highlightedIndex === index ? 'gray' : 'white',
                        fontWeight: selectedItem === item ? 'bold' : 'normal',
                      },
                    })}
                  >
                    {item.name}
                  </div>
                ))
              )}
            </div>
          ) : null}
        </div>
      )}
    </Downshift>
  </section>
);

const mapStateToProps = ({ search }) => ({ search });
const mapDispatchToProps = { doSearch, loadGraph };

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  debounceHandler('doSearch', 300)
)(ArtistSearch);
