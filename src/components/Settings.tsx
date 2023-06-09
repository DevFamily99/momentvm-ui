import React from 'react';
import { Button, Header, Image, Modal, Select, Dropdown, Checkbox } from 'semantic-ui-react';

const Settings = ({ page }) => (
  <Modal trigger={<Button>Settings</Button>}>
    <Modal.Header>Settings</Modal.Header>
    <Modal.Content image>
      <Modal.Description>
        <form
          onSubmit={e => {
            e.preventDefault();
            // createAssetFolder({ variables: { assetFolderId: 1, name: state.newFolderName } });
          }}
        >
          <h2>Details</h2>

          <div className="field">
            <span>Name</span>
            <div className="ui input">
              <input type="text" name="name" value={page.name} />
            </div>
            <p className="explaination">Whatever you want to call the page (e.g. Home Page, ...)</p>
          </div>

          <div className="field">
            <span>Content asset or Category</span>
            <div className="custom-dropdown">
              <Dropdown
                placeholder="Select type"
                name="type"
                selection
                value={page.context_type}
                options={[
                  { text: 'content asset', value: 'content asset' },
                  { text: 'category', value: 'category' },
                ]}
              />
            </div>
            <p className="explaination">
              Whether the page is a category page or an content asset.
              <br />
              This will tell Salesforce Commerce Cloud if this is an content asset or a category
            </p>
          </div>

          <div className="field">
            <span>Is page searchable</span>
            <div className="custom-dropdown">
              <Dropdown
                placeholder="Select type"
                name="type"
                selection
                value={page.is_searchable ? page.is_searchable : false}
                options={[
                  { text: 'true', value: true },
                  { text: 'false', value: false },
                ]}
              />
            </div>
            <p className="explaination">
              Whether the page is searchable or not
              <br />
            </p>
          </div>

          <h2>Languages</h2>

          <div className="field">
            <p className="explaination">Select languages</p>
            <p>
              <Checkbox label="Select all" toggle />
            </p>

            <div id="locales" />
          </div>

          <h2>Publishing Settings</h2>

          <div className="field">
            <span>Context</span>
            <div className="ui input">
              <input type="text" name="context" value={page.context} />
            </div>
            <p className="explaination">
              This is the category ID (if category page) or the article name (if article) in Salesforce Commerce Cloud.
              If you dont know it, let it blank for now. It is only needed for publishing.
            </p>
          </div>

          <div className="field">
            <span>Folder assignments</span>
            <p className="explaination">A list of folders, which should be assigned to the assets.</p>
            <textarea />
          </div>
        </form>
      </Modal.Description>
    </Modal.Content>
  </Modal>
);
export default Settings;
