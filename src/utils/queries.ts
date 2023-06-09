import { gql } from '@apollo/client';

export const GET_PAGES_MODULES = gql`
  query GetPage($id: ID!) {
    page(id: $id) {
      pageModules {
        id
        template {
          name
          imageUrl
        }
      }
    }
  }
`;

export const CREATE_COUNTRY_GROUP = gql`
  mutation CreateCountryGroup(
    $name: String!
    $description: String
    $siteIds: [String!]!
  ) {
    createCountryGroup(
      input: { name: $name, description: $description, siteIds: $siteIds }
    ) {
      countryGroup {
        id
        name
        description
        sites {
          id
          name
          salesforceId
        }
      }
    }
  }
`;
export const UPDATE_COUNTRY_GROUP = gql`
  mutation UpdateCountryGroup(
    $id: ID!
    $name: String
    $description: String
    $siteIds: [String!]!
  ) {
    updateCountryGroup(
      input: { id: $id, name: $name, description: $description, siteIds: $siteIds }
    ) {
      countryGroup {
        id
        name
        description
      }
    }
  }
`;

export const DELETE_COUNTRY_GROUP = gql`
  mutation DeleteCountryGroup($id: ID!) {
    deleteCountryGroup(input: { id: $id }) {
      countryGroup {
        id
      }
    }
  }
`;

export const CREATE_CUSTOMER_GROUP = gql`
  mutation CreateCustomerGroup($name: String!) {
    createCustomerGroup(input: { name: $name }) {
      customerGroup {
        id
        name
      }
    }
  }
`;
export const UPDATE_CUSTOMER_GROUP = gql`
  mutation UpdateCustomerGroup($id: ID!, $name: String!) {
    updateCustomerGroup(input: { id: $id, name: $name }) {
      customerGroup {
        id
        name
      }
    }
  }
`;

export const DELETE_CUSTOMER_GROUP = gql`
  mutation DeleteCustomerGroup($id: ID!) {
    deleteCustomerGroup(input: { id: $id }) {
      customerGroup {
        id
      }
    }
  }
`;

export const CREATE_COUNTRY_GROUP_REFERENCE = gql`
  mutation CreateCountryGroupReference($scheduleID: ID!, $countryGroupID: ID!) {
    createCountryGroupReference(
      input: { scheduleId: $scheduleID, countryGroupId: $countryGroupID }
    ) {
      schedule {
        id
      }
      countryGroup {
        id
      }
    }
  }
`;

export const DELETE_COUNTRY_GROUP_REFERENCE = gql`
  mutation DeleteCountryGroupReference($scheduleID: ID!, $countryGroupID: ID!) {
    deleteCountryGroupReference(
      input: { scheduleId: $scheduleID, countryGroupId: $countryGroupID }
    ) {
      schedule {
        id
      }
      countryGroup {
        id
      }
    }
  }
`;

export const DELETE_CUSTOMER_GROUP_REFERENCE = gql`
  mutation DeleteCustomerGroupReference($scheduleID: ID!, $customerGroupID: ID!) {
    deleteCustomerGroupReference(
      input: { scheduleId: $scheduleID, customerGroupId: $customerGroupID }
    ) {
      schedule {
        id
      }
      customerGroup {
        id
      }
    }
  }
`;

export const DELETE_COUNTRY_GROUP_PAGE_REFERENCE = gql`
  mutation DeleteCountryGroupPageReference($pageID: ID!, $countryGroupID: ID!) {
    deleteCountryGroupPageReference(
      input: { pageId: $pageID, countryGroupId: $countryGroupID }
    ) {
      page {
        id
      }
      countryGroup {
        id
      }
    }
  }
`;

export const GET_COUNTRY_GROUPS = gql`
  {
    countryGroups {
      id
      name
      description
      sites {
        id
        name
        salesforceId
        locales {
          displayName
          code
        }
      }
    }
  }
`;

export const GET_CUSTOMER_GROUPS = gql`
  {
    customerGroups {
      id
      name
    }
  }
`;

export const GET_COUNTRY_GROUP = gql`
  query GetCountryGroup($id: ID!) {
    countryGroup(id: $id) {
      id
      name
      description
      sites {
        id
        name
        salesforceId
      }
    }
  }
`;

export const GET_COUNTRY_GROUP_COUNTRIES = gql`
  query GetCountryGroupCountries($countryGroupId: ID!) {
    countries(countryGroupId: $countryGroupId) {
      id
      name
      code
    }
  }
`;

export const GET_SITES = gql`
  {
    sites {
      id
      name
      salesforceId
    }
  }
`;

/*  Will fetch a given page and all country groups  */
export const GET_PAGE = gql`
  query GetPage($id: ID!) {
    page(id: $id) {
      id
      name
      context
      publishingFolder
      title
      category
      description
      keywords
      url
      safeName
      allLocales
      allowedCountries
      publishAssets
      createdAt
      updatedAt
      lastPublished
      duplicatedFromPageLink
      duplicatedFromPage
      lastSentToTranslation
      lastImportedTranslation
      deletedFromArchive
      createdBy
      updatedBy
      sentToTranslationBy
      translationImportedBy
      publishedBy
      deletedFromArchiveBy
      publishingManifests {
        id
        updatedAt
        createdAt
        publishingTarget {
          name
        }
        user {
          email
        }
      }
      publishingLocales {
        locale
        name
      }
      pageContext {
        id
        name
        contextType
      }
      pageModules {
        id
      }
      countryGroups {
        id
        name
        description
      }
      pageFolder {
        name
        path
        root
        breadcrumbs
      }
      schedules {
        id
        startAt
        endAt
        published
        imageUrl
        pageId
        campaignId
        pageModules {
          id
        }
        customerGroups {
          id
          name
        }
        countryGroups {
          id
          name
          description
          sites {
            id
            name
            salesforceId
            locales {
              id
              code
              name
              displayName
            }
          }
        }
      }
    }
    countryGroups {
      id
      name
      description
    }
  }
`;

export const GET_PAGES = gql`
  query GetPages($searchTerm: String, $maxResults: Int) {
    pages(searchTerm: $searchTerm, maxResults: $maxResults) {
      id
      name
      thumb
    }
  }
`;

export const UPDATE_PAGE = gql`
  mutation UpdatePage(
    $id: ID!
    $pageContextId: ID
    $name: String
    $context: String
    $publishingFolder: String
    $category: String
    $countryGroups: [String!]
  ) {
    updatePage(
      input: {
        id: $id
        pageContextId: $pageContextId
        name: $name
        publishingFolder: $publishingFolder
        context: $context
        category: $category
        countryGroups: $countryGroups
      }
    ) {
      page {
        id
        pageContext {
          id
          contextType
        }
      }
    }
  }
`;

export const CREATE_PAGE_CONTEXT = gql`
  mutation CreatePageContext(
    $name: String!
    $contextType: String!
    $slot: String!
    $renderingTemplate: String
    $selector: String
    $previewWrapperUrl: String
  ) {
    createPageContext(
      input: {
        name: $name
        contextType: $contextType
        slot: $slot
        renderingTemplate: $renderingTemplate
        selector: $selector
        previewWrapperUrl: $previewWrapperUrl
      }
    ) {
      pageContext {
        id
        name
        contextType
        slot
        renderingTemplate
        selector
        previewWrapperUrl
      }
    }
  }
`;

export const GET_PAGE_CONTEXT = gql`
  query GetPageContext($id: ID!) {
    pageContext(id: $id) {
      id
      name
      slot
      contextType
      renderingTemplate
      selector
      previewWrapperUrl
    }
  }
`;

export const DELETE_PAGE_CONTEXT = gql`
  mutation DeletePageContext($id: ID!) {
    deletePageContext(input: { id: $id }) {
      pageContext {
        id
      }
    }
  }
`;

export const UPDATE_PAGE_CONTEXT = gql`
  mutation UpdatePageContext(
    $id: ID!
    $name: String!
    $slot: String!
    $contextType: String!
    $renderingTemplate: String
    $selector: String
    $previewWrapperUrl: String
  ) {
    updatePageContext(
      input: {
        id: $id
        name: $name
        contextType: $contextType
        slot: $slot
        renderingTemplate: $renderingTemplate
        selector: $selector
        previewWrapperUrl: $previewWrapperUrl
      }
    ) {
      pageContext {
        id
        name
        slot
        contextType
        renderingTemplate
        selector
        previewWrapperUrl
      }
    }
  }
`;
// TRANSLATIONS.COM START
export const GET_TRANSLATION_PROJECTS = gql`
  {
    translationProjects {
      submissionId
      title
      dueDate
      createdAt
    }
  }
`;

export const GET_TRANSLATION_PROJECT = gql`
  query GetTranslationProject($submissionId: ID!) {
    translationProject(submissionId: $submissionId)
  }
`;

export const CREATE_TRANSLATION_PROJECT = gql`
  mutation CreateTranslationProject(
    $title: String!
    $deadline: String!
    $locales: [String!]!
    $pageIds: [ID!]!
  ) {
    createTranslationProject(
      input: { title: $title, deadline: $deadline, locales: $locales, pageIds: $pageIds }
    ) {
      message
    }
  }
`;

export const FETCH_TRANSLATIONS = gql`
  mutation FetchTranslations($jobIds: [ID!]!) {
    fetchTranslations(input: { jobIds: $jobIds }) {
      message
    }
  }
`;

// TRANSLATIONS.COM END

export const TRANSLATION_PROJECT_STATUS = gql`
  query TranslationProjectStatus($pageId: String!) {
    translationProjectStatus(pageId: $pageId)
  }
`;

export const GET_TEMPLATES = gql`
  query GetTemplates($archived: Boolean!) {
    templates(archived: $archived) {
      id
      name
      imageUrl
      archived
      tags {
        id
        name
      }
    }
  }
`;

export const GET_TEMPLATE = gql`
  query GetTemplate($id: ID!) {
    template(id: $id) {
      id
      name
      description
      imageUrl
      body
      secondaryBody
      uiSchemaYaml
      versionCount
      tagIds
      archived
      templateSchema {
        id
        body
        jsonBody
      }
    }
  }
`;

export const GET_PAGE_CONTEXTS = gql`
  {
    pageContexts {
      id
      name
      slot
      contextType
      renderingTemplate
      selector
      previewWrapperUrl
    }
  }
`;

export const CREATE_TRANSLATION = gql`
  mutation CreateTranslation(
    $pageId: ID
    $translationBody: JSON!
    $attributeTranslation: Boolean
    $attributeField: String
  ) {
    createTranslation(
      input: {
        pageId: $pageId
        translationBody: $translationBody
        attributeTranslation: $attributeTranslation
        attributeField: $attributeField
      }
    ) {
      translation {
        id
      }
    }
  }
`;

export const GET_TRANSLATION = gql`
  query GetTranslation($id: ID!) {
    translation(id: $id) {
      id
      body
    }
  }
`;

export const GET_TRANSLATIONS = gql`
  query GetTranslations($ids: [ID!]!) {
    translations(ids: $ids) {
      id
      body
    }
  }
`;

export const SEARCH_TRANSLATIONS = gql`
  query SearchTranslations($query: String!) {
    searchTranslations(query: $query) {
      id
      body
    }
  }
`;

export const REUSED_TRANSLATION = gql`
  query ReusedTranslation($translationId: String!) {
    reusedTranslation(translationId: $translationId) {
      id
      page {
        name
      }
    }
  }
`;

export const UPDATE_TEMPLATE = gql`
  mutation UpdateTemplate(
    $id: ID!
    $name: String
    $description: String
    $body: String
    $secondaryBody: String
    $schemaBody: String
    $uiSchema: String
    $tagIds: [ID!]!
  ) {
    updateTemplate(
      input: {
        id: $id
        name: $name
        description: $description
        body: $body
        secondaryBody: $secondaryBody
        schemaBody: $schemaBody
        uiSchema: $uiSchema
        tagIds: $tagIds
      }
    ) {
      template {
        id
        name
      }
    }
  }
`;

export const CREATE_TEMPLATE = gql`
  mutation CreateTemplate(
    $name: String!
    $description: String
    $body: String
    $schemaBody: String
    $uiSchema: String
    $secondaryBody: String
    $tagIds: [ID!]!
  ) {
    createTemplate(
      input: {
        name: $name
        description: $description
        body: $body
        schemaBody: $schemaBody
        uiSchema: $uiSchema
        secondaryBody: $secondaryBody
        tagIds: $tagIds
      }
    ) {
      template {
        id
      }
    }
  }
`;

export const UPDATE_TRANSLATION = gql`
  mutation UpdateTranslation($id: ID!, $translationBody: JSON!) {
    updateTranslation(input: { id: $id, translationBody: $translationBody }) {
      message
    }
  }
`;

export const DELETE_TRANSLATION = gql`
  mutation DeleteTranslation(
    $id: ID!
    $pageId: ID!
    $attributeTranslation: Boolean
    $attributeField: String
  ) {
    deleteTranslation(
      input: {
        pageId: $pageId
        id: $id
        attributeTranslation: $attributeTranslation
        attributeField: $attributeField
      }
    ) {
      message
    }
  }
`;

export const GET_SCHEDULES_FOR_PAGE = gql`
  query GetSchedules($page: ID!) {
    schedules(page: $page) {
      id
      startAt
      endAt
      countryGroups {
        id
        name
      }
      pageModules {
        id
        template {
          name
        }
      }
    }
  }
`;

export const GET_PAGE_FOLDERS = gql`
  query GetPageFolders($id: ID!) {
    pageFolders(page: $id) {
      id
      name
    }
  }
`;

export const UPDATE_ASSET_FOLDER = gql`
  mutation UpdateAssetFolder($id: ID!, $name: String!) {
    updateAssetFolder(input: { id: $id, name: $name }) {
      assetFolder {
        id
      }
    }
  }
`;

export const GET_SCHEDULE = gql`
  query GetSchedule($id: ID!) {
    schedule(id: $id) {
      id
      startAt
      endAt
      campaignId
      countryGroups {
        id
      }
      customerGroups {
        id
      }
    }
  }
`;

export const CREATE_SCHEDULE = gql`
  mutation CreateSchedule($pageId: ID!) {
    createSchedule(input: { pageId: $pageId }) {
      schedule {
        id
      }
    }
  }
`;

export const DELETE_SCHEDULE = gql`
  mutation DeleteSchedule($id: ID!) {
    deleteSchedule(input: { id: $id }) {
      schedule {
        id
      }
    }
  }
`;

export const DELETE_TEMPLATE = gql`
  mutation DeleteTemplate($id: ID!) {
    deleteTemplate(input: { id: $id }) {
      template {
        id
      }
    }
  }
`;

export const ARCHIVE_TEMPLATE = gql`
  mutation ArchiveTemplate($id: ID!) {
    archiveTemplate(input: { id: $id }) {
      template {
        id
      }
    }
  }
`;

export const UPDATE_SCHEDULE = gql`
  mutation UpdateSchedule(
    $id: ID!
    $startAt: String
    $endAt: String
    $campaignId: String
    $countryGroups: [String!]
    $customerGroups: [String!]
    $pageModuleIds: [String!]
  ) {
    updateSchedule(
      input: {
        id: $id
        startAt: $startAt
        endAt: $endAt
        campaignId: $campaignId
        countryGroups: $countryGroups
        customerGroups: $customerGroups
        pageModuleIds: $pageModuleIds
      }
    ) {
      schedule {
        id
        startAt
        endAt
        countryGroups {
          id
          name
        }
      }
    }
  }
`;

export const PUBLISH_SCHEDULE = gql`
  mutation PublishSchedule($id: ID!, $publishingTargetId: ID!) {
    publishSchedule(input: { id: $id, publishingTargetId: $publishingTargetId }) {
      schedule {
        id
      }
    }
  }
`;

export const PUBLISHING_TARGETS = gql`
  {
    publishingTargets {
      id
      name
    }
  }
`;

export const SET_PUBLISH_ASSETS = gql`
  mutation SetPublishAssets($pageId: ID!, $publishAssets: Boolean!) {
    setPublishAssets(input: { pageId: $pageId, publishAssets: $publishAssets }) {
      page {
        id
        publishAssets
      }
    }
  }
`;

export const GET_PAGE_MODULE = gql`
  query pageModule($pageModuleId: ID!) {
    pageModule(pageModuleId: $pageModuleId) {
      id
      body
      permission
      page {
        id
      }
      template {
        name
        schema
        uiSchema
        imageUrl
      }
    }
  }
`;

export const CREATE_PAGE_MODULE = gql`
  mutation CreatePageModule(
    $pageId: ID!
    $templateId: ID!
    $createBelow: ID
    $pageModuleBody: JSON!
  ) {
    createPageModule(
      input: {
        pageId: $pageId
        templateId: $templateId
        createBelow: $createBelow
        pageModuleBody: $pageModuleBody
      }
    ) {
      pageModule {
        id
      }
    }
  }
`;

export const COPY_PAGE_MODULE = gql`
  mutation CopyPageModule($pageId: ID!, $pageModuleId: ID!, $createBelow: ID!) {
    copyPageModule(
      input: { pageId: $pageId, pageModuleId: $pageModuleId, createBelow: $createBelow }
    ) {
      pageModule {
        id
      }
    }
  }
`;

export const UPDATE_PAGE_MODULE = gql`
  mutation UpdatePageModule($id: ID!, $pageModuleBody: JSON!) {
    updatePageModule(input: { id: $id, pageModuleBody: $pageModuleBody }) {
      pageModule {
        id
      }
    }
  }
`;

export const REORDER_MODULES = gql`
  mutation ReorderModules($ids: [String!]!) {
    reorderModules(input: { ids: $ids }) {
      message
    }
  }
`;

export const GET_IMAGES = gql`
  query images($searchTerm: String, $first: Int) {
    images(searchTerm: $searchTerm, first: $first) {
      nodes {
        id
        name
        thumbnail
      }
      pageInfo {
        hasNextPage
      }
    }
  }
`;

export const GET_TARGET_LANUGAGES = gql`
  {
    targetLanguages
  }
`;

export const GET_LOCALES = gql`
  {
    locales
  }
`;

export const GET_TRANSLATION_EDITOR_COLORS = gql`
  {
    translationEditorColors {
      id
      name
      hex
    }
  }
`;

export const CREATE_TRANSLATION_EDITOR_COLOR = gql`
  mutation CreateTranslationEditorColor($name: String!, $hex: String!) {
    createTranslationEditorColor(input: { name: $name, hex: $hex }) {
      color {
        name
        hex
      }
    }
  }
`;

export const DELETE_TRANSLATION_EDITOR_COLOR = gql`
  mutation DeleteTranslationEditorColor($name: String!) {
    deleteTranslationEditorColor(input: { name: $name }) {
      color {
        name
        hex
      }
    }
  }
`;

export const DELETE_PAGE_MODULE = gql`
  mutation DeletePageModule($id: ID!) {
    deletePageModule(input: { id: $id }) {
      message
    }
  }
`;

export const GET_ROLES = gql`
  {
    roles {
      id
      name
      body
    }
  }
`;

export const GET_ROLE_WHITELIST = gql`
  query RoleWhitelist($pageModuleId: ID!) {
    roleWhitelist(pageModuleId: $pageModuleId) {
      pageModuleId
      roleId
    }
  }
`;

export const UPDATE_ROLE_WHITELIST = gql`
  mutation UpdateRoleWhitelist($pageModuleId: ID!, $roleId: ID!) {
    updateRoleWhitelist(input: { pageModuleId: $pageModuleId, roleId: $roleId }) {
      roleWhitelist {
        pageModuleId
        roleId
      }
    }
  }
`;

export const GET_CURRENT_TEAM = gql`
  query {
    currentTeam {
      id
      name
      approved
    }
  }
`;

export const SET_TEAM = gql`
  mutation setTeam($id: String!) {
    setTeam(input: { id: $id }) {
      team {
        id
        name
      }
    }
  }
`;

export const DELETE_TEAM = gql`
  mutation deleteTeam($id: ID!) {
    deleteTeam(input: { id: $id }) {
      team {
        id
      }
    }
  }
`;
export const UPDATE_TEAM = gql`
  mutation updateTeam($id: ID!, $approveTeam: Boolean) {
    updateTeam(input: { id: $id, approveTeam: $approveTeam }) {
      team {
        id
        name
        approved
      }
    }
  }
`;

export const GET_TEAMS = gql`
  query {
    teams {
      id
      name
      approved
      slug
    }
  }
`;

export const GET_BLUEPRINTS = gql`
  query {
    blueprints {
      id
      name
    }
  }
`;

export const GET_TAGS = gql`
  query {
    tags {
      id
      name
    }
  }
`;
