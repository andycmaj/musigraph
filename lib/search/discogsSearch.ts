import discogsClient from 'lib/discogsClient';
import { NodeType, Node } from 'lib/node';
import { DataSource } from '../appConfig';
import { Searcher } from '.';

const convertToDiscogsType = (nodeType: NodeType) => {
  switch (nodeType) {
    case NodeType.Artist:
      return 'artist';
    case NodeType.Release:
      return 'release';
    default:
      throw new Error('unsupported NodeType');
  }
};

/*
{ pagination: { per_page: 50, pages: 1, page: 1, urls: {}, items: 44 },
  results:
   [ { thumb:
        'https://img.discogs.com/u66tX4tqv0oM6n7oxUvv0Gm_8Kw=/150x150/smart/filters:strip_icc():format(jpeg):mode_rgb():quality(40)/discogs-images/A-39210-1189518085.jpeg.jpg',
       title: 'Chris Potter',
       user_data: [Object],
       master_url: null,
       uri: '/artist/39210-Chris-Potter',
       cover_image:
        'https://img.discogs.com/WgIXpfHN8h8f-tt-5xbjmebhJHM=/160x160/smart/filters:strip_icc():format(jpeg):mode_rgb():quality(90)/discogs-images/A-39210-1189518085.jpeg.jpg',
       resource_url: 'https://api.discogs.com/artists/39210',
       master_id: null,
       type: 'artist',
       id: 39210 },
*/
interface DiscogsSearchResult {
  id: number;
  title: string;
  thumb: string;
}

type NodeConverter = (
  type: NodeType
) => (discogsResult: DiscogsSearchResult) => Node;

const convertToNode: NodeConverter = type => ({ id, title, thumb }) => {
  return {
    dataSource: DataSource.Discogs,
    type,
    id: id.toString(),
    name: title,
    thumbnailUrl: thumb,
  };
};

const discogsSearcher: Searcher = {
  search: async (query, nodeType) => {
    const searchResponse = await discogsClient.searchDatabase({
      query,
      type: convertToDiscogsType(nodeType),
    });

    return searchResponse.results.map(convertToNode(nodeType));
  },
};

export default discogsSearcher;
