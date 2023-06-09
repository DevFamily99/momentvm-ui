import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import Button from '../MVMButton';
import Tabs, { Content } from '../MVMTabs';
import PopOver, { MenuItem, Headline, Seperator } from '../MVMMotionPopOver';
import TranslationStatus from './TranslationStatus';

export interface AllowedCountry {
  id: string;
  name: string;
  locales: Locale[];
}

export interface Locale {
  locale: string;
  name: string;
}

export interface PublishingTarget {
  id: string;
  name: string;
}

const Wrapper = styled.div`
  min-height: 12rem;
  h3 {
    padding-bottom: 0.5rem;
  }
`;

const MenuItemWrapper = styled.div`
  .preview-menu-item div {
    padding: 10px;
  }
`;

interface SpacerProps {
  factor: number;
}
// Temporary fix
const Spacer = styled.div`
  height: ${(props: SpacerProps) => props.factor}rem;
`;

interface PageControlMenuProps {
  id: string;
  editingCountries: AllowedCountry[];
  publishingTargets: PublishingTarget[];
}

const PageControlMenu: FunctionComponent<PageControlMenuProps> = ({
  id,
  editingCountries,
  publishingTargets,
}) => {
  return (
    <Wrapper>
      <Spacer factor={2} />
      <Tabs>
        <Content label="Live Editor" className="preview-tab">
          <Button label="View Only" target={`${id}/en/view-only-live-preview`} />

          <PopOver
            forceHeight={400}
            label={
              <Button
                label="Edit Page"
                trailingIcon="triangle"
                className="edit-page-button"
              />
            }
          >
            {editingCountries.map(country => (
              <div key={country.id}>
                <Headline title={country.name} />
                {country.locales.map(locale => (
                  <React.Fragment key={locale.locale}>
                    <MenuItemWrapper>
                      <MenuItem
                        label={`${country.name} (${locale.locale}-${country.id})`}
                        className="preview-menu-item"
                        target={`${id}/${locale.locale}-${country.id}/live-preview`}
                      />
                    </MenuItemWrapper>
                    <Seperator />
                  </React.Fragment>
                ))}
              </div>
            ))}
          </PopOver>
        </Content>
        <Content label="Publishing" className="publishing-tab">
          <PopOver
            forceHeight={400}
            label={<Button label="Publish" trailingIcon="triangle" />}
          >
            <Headline title="Select an instance to publish to" />
            {publishingTargets.map(target => (
              <div key={target.id}>
                <MenuItem
                  label={target.name}
                  target={`/pages/${id}/publish/${target.id}`}
                />
              </div>
            ))}
          </PopOver>
          <PopOver
            forceHeight={400}
            label={<Button label="Unpublish" trailingIcon="triangle" />}
          >
            <Headline title="Select an instance to unpublish to" />
            {publishingTargets.map(target => (
              <div key={target.id}>
                <MenuItem
                  label={target.name}
                  target={`/pages/${id}/unpublish/${target.id}`}
                />
              </div>
            ))}
          </PopOver>
        </Content>
        <Content label="Translation Workflow">
          <Button label="Download Translations" target={`${id}/export_translations`} />
          <Button label="Import Translations" target={`${id}/import_translations`} />
          <Button
            label="Reset Translation Status"
            target={`/pages/reset_translation_status/${id}`}
          />
          <Button
            label="Send to Translation Validation"
            target={`/pages/${id}/send_to_translation_validation`}
          />
          <Button
            label="Send to Translation"
            target="/workflow/send_translations_start"
          />
          <Button
            label={
              <a
                href="/workflow/check_finished_translations_start"
                data-confirm="Are you sure? This will override translations"
              >
                Fetch finished Translation
              </a>
            }
          />
          <TranslationStatus pageId={id} />
        </Content>
        <Content label="Page Settings">
          <Button label="Settings" target={`${id}/edit`} />
          <Button label="Set restore date" />
          <Button label="Duplicate Page" target={`/duplicate_page/${id}`} />
          <Button
            label={
              <a href={id} data-method="delete" data-confirm="Are you sure?">
                Delete Page
              </a>
            }
            buttonState="delete"
          />
        </Content>

        <Content label="More">
          <Button label="Download Page XML" target={`/export_xml/${id}`} />
        </Content>
      </Tabs>
    </Wrapper>
  );
};

export default PageControlMenu;
