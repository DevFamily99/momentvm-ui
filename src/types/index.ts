export interface GetCountryGroupsQueryResult {
  countryGroups: CountryGroup[];
}

export interface CountryGroup {
  id: string;
  name: string;
  description: string;
  sites: Site[];
}

export interface GetCustomerGroupsQueryResult {
  customerGroups: CustomerGroup[];
}

export interface CustomerGroup {
  id: string;
  name: string;
}

export interface Site {
  id: string;
  name: string;
  salesforceId: string;
  locales: Locale[];
}

export interface Locale {
  displayName: string;
  code: string;
  id: string;
}

export interface User {
  id: string;
  email: string;
}

export interface PageComment {
  id: string;
  body: string;
  user: User;
  createdAt: string;
  updatedAt: string;
}
