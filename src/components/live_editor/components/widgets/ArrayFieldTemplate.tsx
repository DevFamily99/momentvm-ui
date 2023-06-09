import React from 'react';
import Button from '../../../Button';

const ItemField = ({ item }) => {
  return (
    <>
      {item.children}
      {item.hasRemove && (
        <Button type="button" text="Remove" onClick={() => item.onDropIndexClick(item.index).call()} />
      )}
      {item.hasMoveUp && (
        <Button type="button" text="Move Up" onClick={() => item.onReorderClick(item.index, item.index - 1).call()} />
      )}
      {item.hasMoveDown && (
        <Button type="button" text="Move Down" onClick={() => item.onReorderClick(item.index, item.index + 1).call()} />
      )}
    </>
  );
};

const ArrayFieldTemplate = ({ title, items, canAdd, onAddClick }) => {
  return (
    <div>
      {items.map(item => (
        <ItemField key={item.key} item={item} />
      ))}
      {canAdd && <Button type="button" onClick={onAddClick} text={`Add ${title}`} />}
    </div>
  );
};

export default ArrayFieldTemplate;
