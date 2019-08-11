import appConfig, { DataSource } from 'lib/appConfig';
import discogsSearch from './discogsSearch';
import { NodeType } from 'lib/node';

export interface Searcher {
  search: (query: string, nodeType: NodeType) => Promise<Node>;
}

const searcher: Searcher = {
  search: async (query, nodeType) => {
    let searcher: Searcher = null;
    if (appConfig.dataSource === DataSource.Discogs) {
      searcher = discogsSearch;
    } else {
      throw new Error(`data source not supported: '${appConfig.dataSource}'`);
    }

    return searcher.search(query, nodeType);
  },
};

export default searcher;
