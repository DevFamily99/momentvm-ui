import React, { useState, FC } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { useQuery, useMutation } from '@apollo/client';
import Url from 'url-parse';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { Module } from './Module';
import CloseButton from '../../CloseButton';
import Button from '../../Button';
import { REORDER_MODULES, GET_PAGES_MODULES } from '../../../utils/queries';

const ReorderModulesHeading = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const HeaderText = styled.div`
  width: 95%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: 'Nunito Sans', sans-serif;
  margin-right: 1vw;
`;

interface ReorderModulesProps {
  setReorderListOpen: Function;
  reloadPreview: Function;
}

const ReorderModules: FC<ReorderModulesProps> = ({
  setReorderListOpen,
  reloadPreview,
  setPageModuleId
}) => {
  const [pageModules, setPageModules] = useState([]);
  const currentUrl = new Url(window.location.href);
  const urlSections = currentUrl.pathname.split('/');
  const pageId = urlSections[2];
  useQuery(GET_PAGES_MODULES, {
    variables: { id: pageId },
    onCompleted: (data) => setPageModules(data.page.pageModules),
  });
  const [reorderModules] = useMutation(REORDER_MODULES);

  const onDragEnd = ({ destination, source, draggableId }) => {
    if (!destination) {
      return;
    }
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    const newOrderIds = Array.from(pageModules);
    newOrderIds.splice(source.index, 1);
    newOrderIds.splice(
      destination.index,
      0,
      pageModules.find((pm) => pm.id === draggableId),
    );
    setPageModules(newOrderIds);
  };

  const saveNewOrder = async () => {
    const newOrder = pageModules.map((pm) => pm.id);
    const { data } = await reorderModules({ variables: { ids: newOrder } });
    toast.success(data.reorderModules.message);
    reloadPreview();
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <ReorderModulesHeading>
        <HeaderText>
          <h3>MODULE REORDER</h3>
          <p>Drag and drop a module to change its position</p>
          <CloseButton func={() => setReorderListOpen(false)} />
        </HeaderText>
        <Button onClick={() => saveNewOrder()} text="Save" />
      </ReorderModulesHeading>

      <div>
        <Droppable droppableId="droppable-field">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {pageModules.length > 0 &&
                pageModules.map((mod, i) => (
                  <Module
                    index={i}
                    key={mod.id}
                    mod={{
                      id: mod.id,
                      name: mod.template.name,
                      imageUrl: mod.template.imageUrl,
                    }}
                    setPageModuleId={() => {
                      setReorderListOpen(false);
                      setPageModuleId(mod.id);
                    }}
                  />
                ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </DragDropContext>
  );
};

export default ReorderModules;
