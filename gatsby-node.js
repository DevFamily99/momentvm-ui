/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// Implement the Gatsby API “onCreatePage”. This is
// called after every page is created.

exports.onCreatePage = async ({ page, actions }) => {
  const { createPage } = actions;
  // page.matchPath is a special key that's used for matching pages
  // only on the client.
  if (page.path.match(/^\/page_folders/)) {
    page.matchPath = '/page_folders/*';
    // Update the page.
    createPage(page);
  }
  if (page.path.match(/^\/assets/)) {
    page.matchPath = '/assets/*';
    // Update the page.
    createPage(page);
  }
  if (page.path.match(/^\/pages/)) {
    page.matchPath = '/pages/*';
    // Update the page.
    createPage(page);
  }
  if (page.path.match(/^\/templates/)) {
    page.matchPath = '/templates/*';
    // Update the page.
    createPage(page);
  }
  if (page.path.match(/^\/media-files/)) {
    page.matchPath = '/media-files/*';
    // Update the page.
    createPage(page);
  }
};

exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
  if (stage === 'build-html') {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /react-splitter-layout/,
            use: loaders.null(),
          },
          {
            test: /actioncable/,
            use: loaders.null(),
          },
        ],
      },
    });
  }
};
