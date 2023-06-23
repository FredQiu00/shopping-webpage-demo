import React, { useState } from 'react';
import UserInfoTable from './UserInfoTable';
import './SearchBar.css';
import ProductInfoTable from './ProductInfoTable';

const SearchBar = ({ category, setModifyItem, handleDelete}) => {

  const [selected, setSelected] = useState(null);
  const [searchField, setSearchField] = useState('id');
  const [searchValue, setSearchValue] = useState('');
  const [loadTable, setLoadTable] = useState(false);

  const handleSearch = async () => {
    try {
      const response =
        await fetch(`http://localhost:8000/api/admin/search?category=${category}&field=${searchField}&value=${searchValue}`, {
          method: 'GET',
        });
        if (!response.ok) {
          throw new Error('No Info found');
        }
        const userData = await response.json();
        if (userData && userData.length > 0) {
            setSelected(userData[0]);
            setLoadTable(true);
        } else {
            alert('No Info found');
        }
    } catch (err) {
      alert(`Fail to fetch info: ${err}`);
    }
  };

  const handleSelectChange = (e) => {
    e.preventDefault();
    setSearchField(e.target.value);
    setSearchValue('');
    setLoadTable(false);
  }

  return (
    <div className='SearchBar-container'>
      <div>
        {
          (category === "user"
            ? <select value={searchField} onChange={handleSelectChange}>
                <option value="id">ID</option>
                <option value="username">Username</option>
                <option value="email">Email</option>
                <option value="phone">Phone Number</option>
              </select>
            : <select value={searchField} onChange={handleSelectChange}>
                <option value="id">ID</option>
                <option value="prod_name">Product Name</option>
              </select>)
        }

        <input type="text" value={searchValue} onChange={e => setSearchValue(e.target.value)} placeholder="Enter search value"/>

        <button onClick={handleSearch}>Search</button>
      </div>
      {selected && loadTable && (
        category === "user"
          ? <UserInfoTable allUsers={[selected]}/>
          : <ProductInfoTable allProducts={[selected]} setModifyItem={setModifyItem} handleDelete={handleDelete}/>
      )}
    </div>
  );
};

export default SearchBar;
