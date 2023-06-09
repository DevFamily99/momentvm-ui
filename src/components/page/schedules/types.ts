export interface Schedule {
  id: string;
  startAt: null | string;
  endAt: null | string;
  published: boolean;
  imageUrl: string;
  pageId: string;
  countryGroups: CountryGroup[];
}

export interface CountryGroup {
  id: string;
  name: string;
  description: string;
  sites?: Site[];
}
export interface Site {
  id: string;
  name: string;
  salesforceId: string;
  locales: Locale[];
}

export interface Locale {
  id: string;
  code: string;
  name: string;
  displayName: string;
}
