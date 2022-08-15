export interface MarvelResponse {
	code: number;
	status: string;
	copyright: string;
	attributionText: string;
	attributionHTML: string;
	etag: string;
	data: Data;
}

export interface Data {
	offset: number;
	limit: number;
	total: number;
	count: number;
	results: Character[];
}

export interface Character {
	id: number;
	name: string;
	description: string;
	modified: string;
	thumbnail: Thumbnail;
	resourceURI: string;
	comics: Comics;
	series: Comics;
	urls: URL[];
}

export interface Comics {
	available: number;
	collectionURI: string;
	items: ComicsItem[];
	returned: number;
}

export interface ComicsItem {
	name: string;
}

export enum ItemType {
	Cover = "cover",
	Empty = "",
	InteriorStory = "interiorStory",
}

export interface Thumbnail {
	path: string;
	extension: Extension;
}

export enum Extension {
	GIF = "gif",
	Jpg = "jpg",
}

export interface URL {
	type: URLType;
	url: string;
}

export enum URLType {
	Comiclink = "comiclink",
	Detail = "detail",
	Wiki = "wiki",
}
