import { EditorState, Modifier, SelectionState } from 'draft-js';

/**
 * Used for parsing a human readable text out of a list of status codes
 * @param codes a list of http status codes
 */

interface Response {
  content_asset: string;
  code: string;
}

/** Private method to generate asset1: 403, */
const mapFaults = (responses: [Response]): string => {
  const results = responses.map(
    (response) => `${response.content_asset}: ${response.code}`,
  );
  return results.join(', ');
};

export const textFromStatusCodes = (responses: [Response]): string => {
  let partiallySucceeded = false;
  let partiallyFailed = false;
  responses.forEach((resp) => {
    if (resp.code.startsWith('2')) {
      partiallySucceeded = true;
    }
    if (!resp.code.startsWith('2')) {
      partiallyFailed = true;
    }
  });
  if (partiallyFailed && partiallySucceeded) {
    return `Some of the assets couldn't be updated. ${mapFaults(responses)}`;
  }
  if (partiallySucceeded && !partiallyFailed) {
    return 'Update successful';
  }
  if (!partiallySucceeded && !partiallyFailed) {
    return `Error. ${mapFaults(responses)}`;
  }
  return '';
};

/**
 * Function returns collection of currently selected blocks.
 */
function getSelectedBlocksMap(editorState) {
  const selectionState = editorState.getSelection();
  const contentState = editorState.getCurrentContent();
  const startKey = selectionState.getStartKey();
  const endKey = selectionState.getEndKey();
  const blockMap = contentState.getBlockMap();
  return blockMap
    .toSeq()
    .skipUntil((_, k) => k === startKey)
    .takeUntil((_, k) => k === endKey)
    .concat([[endKey, blockMap.get(endKey)]]);
}

/**
 * Function removes inline styles from current editor state
 */
export const removeInlineStyles = (editorState, styles) => {
  const contentState = editorState.getCurrentContent();
  const contentWithoutStyles = styles.reduce(
    (newContentState, style) =>
      Modifier.removeInlineStyle(newContentState, editorState.getSelection(), style),
    contentState,
  );

  const newEditorState = EditorState.push(
    editorState,
    contentWithoutStyles,
    'change-inline-style',
  );

  return newEditorState;
};

/**
 * Function removes entities from current editor state
 */
export const removeEntities = (editorState) => {
  const contentState = editorState.getCurrentContent();
  const contentWithoutEntities = Modifier.applyEntity(
    contentState,
    editorState.getSelection(),
    null,
  );

  const newEditorState = EditorState.push(
    editorState,
    contentWithoutEntities,
    'apply-entity',
  );

  return newEditorState;
};

/**
 * Function removes blocks from current editor state
 */
export const removeBlockTypes = (editorState) => {
  const contentState = editorState.getCurrentContent();
  const blocksMap = getSelectedBlocksMap(editorState);
  const contentWithoutBlocks = blocksMap.reduce((newContentState, block) => {
    const blockType = block.getType();
    if (blockType !== 'unstyled') {
      const selectionState = SelectionState.createEmpty(block.getKey());
      const updatedSelection = selectionState.merge({
        focusOffset: 0,
        anchorOffset: block.getText().length,
      });

      return Modifier.setBlockType(newContentState, updatedSelection, 'unstyled');
    }

    return newContentState;
  }, contentState);

  const newEditorState = EditorState.push(
    editorState,
    contentWithoutBlocks,
    'change-block-type',
  );

  return newEditorState;
};
