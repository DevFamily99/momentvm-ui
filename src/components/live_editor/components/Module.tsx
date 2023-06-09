import React, { FC } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import Image from '../../MVMImage';

const TemplateWrapper = styled.div`
  display: flex;
  height: 180px;
  width: 440px;
  display: inline-flex;
  border-style: solid;
  border-width: 0 0 1px 0;
  border-color: #f0f0f0;
  font-family: 'Nunito Sans', sans-serif;
  color: #000000;
  transition-duration: 300ms;
  :hover {
    padding-left: 30px;
    margin-right: -30px;
  }
  cursor: ${(props) => (props.draggable ? 'move' : 'pointer')};
`;

const TemplateInfo = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
  margin: 5%;
  justify-content: center;
`;

const PreviewImageWrapper = styled.div`
  margin: 5%;
  img {
    height: 150px;
    width: 200px;
    object-fit: contain;
    background-color: 'grey';
    border-radius: '5px';
  }
`;

const EditButtonWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    button {
      background-color: transparent;
      width: 40px; 
      border: none;
      font-weight: bold;
    }
`;

interface TemplateProps {
  id?: string;
  pageModuleId?: string;
  name: string;
  imageUrl: string;
  draggable: boolean;
  onClick: VoidFunction;
}

/**
 * Template tile
 * @param id string - Used for module insert
 * @param pageModuleId string - Used for module copy
 * @param name string
 * @param imageUrl string
 * @param draggable boolean - default true
 */
const Template: FC<TemplateProps> = ({
  id,
  pageModuleId,
  name,
  imageUrl,
  draggable = true,
  onClick,
}) => (
  <TemplateWrapper
    onClick={onClick}
    onDragStart={(e) => {
      if (id) e.dataTransfer.setData('templateId', id);
      if (pageModuleId) e.dataTransfer.setData('pageModuleId', pageModuleId);
    }}
    draggable={draggable}
  >
    <PreviewImageWrapper>
      {imageUrl ? <Image src={imageUrl} alt={name} /> : <Image alt={name} src="" />}
    </PreviewImageWrapper>
    <TemplateInfo>
      <p>{name}</p>
    </TemplateInfo>  
  </TemplateWrapper>
);

const Module = ({ mod: { id, name, imageUrl }, index , setPageModuleId}) => {
  return (
  <Draggable draggableId={id} index={index} style={{ padding: 10 }}>
    {(provided) => (
      <div
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        ref={provided.innerRef}   
      >
        <div style={{ display: 'flex'}}>
          <Template name={name} imageUrl={imageUrl} />
          <EditButtonWrapper>
            <button onClick={setPageModuleId}><u>Edit</u></button>
          </EditButtonWrapper>
        </div>
      </div>
    )}
  </Draggable>)
};

export { Template, Module };
