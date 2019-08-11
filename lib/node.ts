import { DataSource } from './appConfig';

export enum NodeType {
  Artist = 'artist',
  Release = 'release',
}

export interface Node {
  dataSource: DataSource;
  type: NodeType;
  id: string;
  name: string;
  subTitle?: string;
  thumbnailUrl?: string;
  infoUrl?: string;
  adjacentNodes?: Node[];
}

// export interface Artist extends Node {}

// export interface Release extends Node {}
