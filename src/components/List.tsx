import React from 'react';
import { Button } from 'semantic-ui-react';
import '../styles/list.scss';

const removeCountry = () => {
  console.log('remove country');
};

const List = ({ items }) => (
  // const [startDate, setStartDate] = useState()
  // const [endDate, setEndDate] = useState()
  <div className="list">
    {items.map(item => (
      <div className="item">
        <span className="name">{item.text}</span>
        <Button icon="close" onClick={() => removeCountry()} />
      </div>
    ))}
  </div>
);

export default List;
