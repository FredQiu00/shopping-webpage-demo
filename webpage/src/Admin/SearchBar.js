import React, { useState, useEffect, useCallback } from 'react';
import UserInfoTable from './UserInfoTable';
import ProductInfoTable from './ProductInfoTable';
import './SearchBar.css';

const SearchBar = ({ category, allProducts, setModifyItem, handleDelete }) => {

  const [selected, setSelected] = useState(null);
  const [searchField, setSearchField] = useState('id');
  const [searchValue, setSearchValue] = useState('');
  const [loadTable, setLoadTable] = useState(false);

  const fetchData = useCallback(async () => {
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
          setSearchValue('');
        }
    } catch (err) {
      alert(`Fail to fetch info: ${err}`);
    }
  }, [category, searchField, searchValue]);

  useEffect(() => {
    if (selected && !allProducts.find(product => product._id === selected._id)) {
      setSelected(null);
      setLoadTable(false);
    }
  }, [allProducts, selected, fetchData]);

  const handleSearch = async () => {
    await fetchData();
  };

  const handleSelectChange = (e) => {
    e.preventDefault();
    setSearchField(e.target.value);
    setSearchValue('');
    setLoadTable(false);
  }

  const handleDeleteItem = async (itemId) => {
    if (selected && selected._id === itemId) {
      setSelected(null);
    }
    handleDelete(itemId);
};

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
              : <ProductInfoTable allProducts={[selected]} setModifyItem={setModifyItem} handleDelete={handleDeleteItem}/>
      )}
    </div>
  );
};

export default SearchBar;
