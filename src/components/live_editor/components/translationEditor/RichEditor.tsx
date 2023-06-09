import React, { useEffect, useMemo, useState } from 'react';
import Editor from 'draft-js-plugins-editor';
import createLinkPlugin from 'draft-js-anchor-plugin-momentvm-fork';
import createInlineToolbarPlugin from 'draft-js-inline-toolbar-plugin';
import { RichUtils } from 'draft-js';
import { toast } from 'react-toastify';
import { useMutation } from '@apollo/client';
import { stateToHTML } from 'draft-js-export-html';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import {
  removeInlineStyles,
  removeEntities,
  removeBlockTypes,
} from '../../../../utils/utils';
import ColorPicker from './ColorPicker';
import StyleButton from './StyleButton';
import Button from '../../../Button';
import 'draft-js-inline-toolbar-plugin/lib/plugin.css';
import { DELETE_TRANSLATION_EDITOR_COLOR } from '../../../../utils/queries';

function getBlockStyle(block) {
  switch (block.getType()) {
    case 'blockquote':
      return 'RichEditor-blockquote';
    default:
      return null;
  }
}

const RichEditor = ({ editorState, locale, setValue, customColors, refetchColors }) => {
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [rawPreview, setRawPreview] = useState(false);
  const [deleteColor] = useMutation(DELETE_TRANSLATION_EDITOR_COLOR);
  const handleDeleteColor = async (name) => {
    const { data } = await deleteColor({ variables: { name } });
    if (data) {
      refetchColors();
      toast.success('Color deleted');
    }
  };
  const [{ plugins, InlineToolbar, LinkButton }] = useState(() => {
    const inlineToolbarPlugin = createInlineToolbarPlugin();
    const linkPlugin = createLinkPlugin({});
    const { LinkButton } = linkPlugin;
    const { InlineToolbar } = inlineToolbarPlugin;
    const plugins = [inlineToolbarPlugin, linkPlugin];
    return {
      plugins,
      InlineToolbar,
      LinkButton,
    };
  });

  const toggleBlockType = (blockType) => {
    setValue(locale, RichUtils.toggleBlockType(editorState, blockType));
  };

  const toggleInlineStyle = (inlineStyle) => {
    setValue(locale, RichUtils.toggleInlineStyle(editorState, inlineStyle));
  };

  const styleMap = {
    UPPERCASE: {
      textTransform: 'uppercase',
    },
    CODE: {
      backgroundColor: 'rgba(255, 0, 0, 99)',
      fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
      fontSize: 16,
      padding: 2,
    },
  };
  customColors.forEach((color) => {
    styleMap[color.name] = { color: color.hex };
  });
  const inlineStyles = [
    { label: 'Bold', style: 'BOLD' },
    { label: 'Italic', style: 'ITALIC' },
    { label: 'Underline', style: 'UNDERLINE' },
    { label: 'Monospace', style: 'CODE' },
    { label: 'UPPERCASE', style: 'UPPERCASE' },
    ...customColors.map((color) => ({
      label: color.name,
      style: color.name,
      hex: color.hex,
      customColor: true,
    })),
  ];

  const clearStyles = () => {
    const editorStateNoInlineStyles = removeInlineStyles(
      editorState,
      inlineStyles.map((s) => s.style),
    );
    const editorStateNoEntities = removeEntities(editorStateNoInlineStyles);
    const editorStateNoBlocks = removeBlockTypes(editorStateNoEntities);

    setValue(locale, editorStateNoBlocks);
  };

  const currentHtml = () => {
    const options = {
      inlineStyles: {
        BOLD: { style: { fontWeight: 700, color: 'unset' } },
        UPPERCASE: { style: { textTransform: 'uppercase' } },
      },
    };
    customColors.forEach((color) => {
      options.inlineStyles[color.name] = {
        style: { color: color.hex },
      };
    });
    const html = stateToHTML(editorState.getCurrentContent(), options).replace(
      /<\/?p>/g,
      '',
    );
    return html;
  };

  return (
    <div className="RichEditor-root">
      <BlockStyleControls editorState={editorState} onToggle={toggleBlockType} />
      <InlineStyleControls
        editorState={editorState}
        onToggle={toggleInlineStyle}
        INLINE_STYLES={inlineStyles}
        removeCustomColor={handleDeleteColor}
      />

      <Button onClick={() => setColorPickerOpen(true)} text="Add a custom color" />
      <Button onClick={() => clearStyles()} text="Clear text styling" />
      <Button onClick={() => setRawPreview(!rawPreview)} text="Toggle raw preview" />
      {colorPickerOpen && (
        <ColorPicker
          setColorPickerOpen={setColorPickerOpen}
          refetchColors={refetchColors}
        />
      )}

      <div className="RichEditor-editor">
        <Editor
          blockStyleFn={getBlockStyle}
          customStyleMap={styleMap}
          editorState={editorState}
          plugins={plugins}
          //   handleKeyCommand={handleKeyCommand}
          onChange={(editorState) => setValue(locale, editorState)}
          //   placeholder={placeholder}
          // eslint-disable-next-line react/no-string-refs
          spellCheck
        />
        <InlineToolbar>
          {
            // may be use React.Fragment instead of div to improve perfomance after React 16
            (externalProps) => (
              <div>
                <LinkButton {...externalProps} />
              </div>
            )
          }
        </InlineToolbar>
      </div>
      {rawPreview && (
        <div style={{ maxWidth: '100%' }}>
          <SyntaxHighlighter language="html" style={docco}>
            {currentHtml()}
          </SyntaxHighlighter>
        </div>
      )}
    </div>
  );
};

export default RichEditor;

const BLOCK_TYPES = [
  { label: 'H1', style: 'header-one' },
  { label: 'H2', style: 'header-two' },
  { label: 'H3', style: 'header-three' },
  { label: 'H4', style: 'header-four' },
  { label: 'H5', style: 'header-five' },
  { label: 'H6', style: 'header-six' },
  { label: 'Blockquote', style: 'blockquote' },
  { label: 'UL', style: 'unordered-list-item' },
  { label: 'OL', style: 'ordered-list-item' },
  { label: 'Code Block', style: 'code-block' },
];
const BlockStyleControls = (props) => {
  const { editorState } = props;
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();
  return (
    <div className="RichEditor-controls">
      {BLOCK_TYPES.map((type) => (
        <StyleButton
          key={type.label}
          active={type.style === blockType}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      ))}
    </div>
  );
};

const InlineStyleControls = ({
  editorState,
  INLINE_STYLES,
  onToggle,
  removeCustomColor,
}) => {
  const currentStyle = editorState.getCurrentInlineStyle();
  return (
    <div className="RichEditor-controls">
      {INLINE_STYLES.map((type) => (
        <StyleButton
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={onToggle}
          style={type.style}
          customColor={type.customColor}
          hex={type.hex}
          removeCustomColor={removeCustomColor}
        />
      ))}
    </div>
  );
};
