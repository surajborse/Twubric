import React, { useState, useEffect } from 'react';
import { Button, Container, InputGroup, Table } from 'react-bootstrap';
import { FaSortAlphaDown, FaSortAlphaDownAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Form from 'react-bootstrap/Form';
import { IoSearchOutline } from "react-icons/io5";
import axios from 'axios';


const Twubric = () => {
  const [userData, setUserData] = useState([]);
  const [sortBy, setSortBy] = useState('twubricScore');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filter, setFilter] = useState('');
  const [changIcon , setChangeIcon] = useState(true)

 const API_URL =  "https://gist.githubusercontent.com/pandemonia/21703a6a303e0487a73b2610c8db41ab/raw/82e3ef99cde5b6e313922a5ccce7f38e17f790ac/twubric.json" 
 
 useEffect(() => {
    axios.get(API_URL)
      .then(response => {
        setUserData(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleSortChange = (key) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('asc');
    }
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleRemoveUser = (UserId) => {
    const updateduserData = userData.filter(Item => Item.uid !== UserId);
    setUserData(updateduserData);
  };

  const filtereduserData = userData.filter(Item =>
    Item.fullname.toLowerCase().includes(filter.toLowerCase())
  );

  const sorteduserData = filtereduserData.sort((a, b) => {
    if (sortBy === 'fullname') {
      const aValue = a[sortBy].toLowerCase();
      const bValue = b[sortBy].toLowerCase();
      return sortOrder === 'asc' ? aValue?.localeCompare(bValue) : bValue?.localeCompare(aValue);
    } else {
      const aValue = typeof a[sortBy] === 'string' ? a[sortBy].toLowerCase() : a[sortBy];
      const bValue = typeof b[sortBy] === 'string' ? b[sortBy].toLowerCase() : b[sortBy];
      return sortOrder === 'asc' ? aValue?.localeCompare(bValue) : bValue?.localeCompare(aValue);
    }
  });

  return (
    <div className="twubric">
      <Container>
      <div className='my-3 filter'>
      <InputGroup >
            <Form.Select value={sortBy} onChange={(e) => handleSortChange(e.target.value)}>
                <option value="twubricScore">Twubric Score</option>
                <option value="fullname">Name</option>
                <option value="friends">Friends</option>
                <option value="influence">Influence</option>
                <option value="chirpiness">Chirpiness</option>
            </Form.Select>
            </InputGroup>
            <InputGroup >
                <InputGroup.Text id="basic-addon1"><IoSearchOutline />
                </InputGroup.Text>
                <Form.Control
                type="search"
                placeholder="Filter by name"
                value={filter}
                onChange={handleFilterChange}
                />
            </InputGroup>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th onClick={() => handleSortChange('fullname') || setChangeIcon(!changIcon)}> 
            <span className='mx-3'>
            {
                changIcon ? <FaSortAlphaDown /> : <FaSortAlphaDownAlt />
            }
            </span>
             Name</th>
            <th onClick={() => handleSortChange('twubricScore')}>Twubric Score</th>
            <th onClick={() => handleSortChange('friends')}>Friends</th>
            <th onClick={() => handleSortChange('influence')}>Influence</th>
            <th onClick={() => handleSortChange('chirpiness')}>Chirpiness</th>
            <th> image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
        {
            sorteduserData.length > 0 ?
            sorteduserData.map(Item => (
                <tr key={Item.id}>
                  <td>{Item.fullname}</td>
                  <td>{Item.twubric.total}</td>
                  <td>{Item.twubric.friends}</td>
                  <td>{Item.twubric.influence}</td>
                  <td>{Item.twubric.chirpiness}</td>
                  <td> <img src={Item.image} />  </td>
                  <td>
                    <Button className='delete_btn'  onClick={() => handleRemoveUser(Item.uid)}> <MdDelete  />
                    Remove</Button>
                  </td>
                </tr>
              ))
              :
              <tr> <td colSpan={7} className='text-center'> Not Data Found </td> </tr>
        }
          
        </tbody>
      </Table>
      </Container>
    </div>
  );
};

export default Twubric;
