import React,  { useState } from 'react';
import { Button, Header, Image, Modal } from 'semantic-ui-react'
import moment from 'moment';
import { Tab } from 'semantic-ui-react'

const TabReset = () => {
  return (
    <div>
      <Button>Reset</Button>
      <p>Reset translation status of this page</p>
    </div>
  )
}

const TabSendToValidation = () => {
  return (
    <div>
      <Button>Validate</Button>
      <p>Send this page to translation validation</p>
    </div>
  )
}

const TabSendValidatedPages = () => {
  
  const [deadline, setDeadline] = useState(moment(Date()).add(5, 'days'))
  return (
    <div>
      <h1>Select pages for translation</h1>
      <p>
        These pages have been validated and can be bundled into a translation.
      </p>
      <form
        onSubmit={e => {
          e.preventDefault();
          //sendTranslations({ variables: { assetFolderId: 1, name: state.newFolderName } });
        }}
      >
        <p>
          <span>Deadline</span>
          <input type="text" name="deadline" value={deadline.format('MMMM Do YYYY, h:mm:ss a')} />
        </p>
        <h2>Pages to send</h2>
  
        <button type="submit"> Send translations </button> 
      </form>
    </div>
  )
}



const panes = [
  { menuItem: 'Reset status', render: () => (<Tab.Pane key='tab1'><TabReset/></Tab.Pane>) },
  { menuItem: 'Send to translation', render: () => (<Tab.Pane key='tab2'><TabSendToValidation/></Tab.Pane>) },
  { menuItem: 'Send validated pages to translation', render: () => (<Tab.Pane key='tab3'><TabSendValidatedPages/></Tab.Pane>) },
]

const TabMenu = () =>  <Tab menu={{ fluid: true, vertical: false, tabular: true }} panes={panes}  />

const TranslationWorkflow = ({ }) => {
  return(
    <Modal trigger={<Button>Translations</Button>}>
    <Modal.Header>Translations</Modal.Header>
    <Modal.Content>
      <TabMenu/>
    </Modal.Content>
    </Modal>
  )
}
export default TranslationWorkflow;
