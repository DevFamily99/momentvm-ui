export interface CreateTemplateVariables {
  name: string;
  description: string;
  body: string;
  secondaryBody: string;
  schemaBody: string;
  uiSchema: string;
  tagIds: [string];
}

export interface CreateTemplateResult {
  createTemplate: {
    template: {
      id: string;
    };
  };
}

export interface TemplateResponse {
  template: Template;
}

export interface VersionResponse {
  version: Version;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  body: string;
  secondaryBody: string;
  uiSchemaYaml: string;
  versionCount: number;
  templateSchema: TemplateSchema;
  versions: [Version];
  tagIds: [string];
  archived: boolean;
}

export interface Version {
  id: string;
  itemType: string;
  whodunnit: string;
  body: string;
  createdAt: string;
}

export interface TemplateSchema {
  id: string;
  body: string;
}

export interface TemplateQueryVariables {
  id: string;
}

export interface TemplateData {
  template?: string;
}

export interface VersionChangesParams {
  template: string;
  version: string;
}
