import Head from 'next/head'
import { useState, useMemo, useEffect } from 'react';
import { Input, Select, Button, Table } from 'antd';
import useSwr from 'swr'
import axios from 'axios';

const { Search } = Input;
const { Option } = Select;
const columns = [
  {
    title: 'Username',
    dataIndex: 'username',
    defaultSortOrder: '',
    sorter: true
  },
  {
    title: 'Name',
    dataIndex: 'name',
    defaultSortOrder: '',
    sorter: true
  },
  {
    title: 'Email',
    dataIndex: 'email',
    defaultSortOrder: '',
    sorter: true
  },
  {
    title: 'Gender',
    dataIndex: 'gender',
    defaultSortOrder: '',
    sorter: true
  },
  {
    title: 'Registered Date',
    dataIndex: 'registerDate',
    defaultSortOrder: '',
    sorter: true
  },
];

const initialFilter = {
  page: 1,
  pageSize: 10,
  results: 10,
  keyword: '',
  gender: '',
  sortOrder: '',
  sortBy: ''
};

export default function Home() {

  const [filter, setFilter] = useState({
    ...initialFilter
  });
  const [tempKeyword, setTempKeyword] = useState('');

  const { data, mutate, error } = useSwr(['/api/user', filter]);

  if (error) return <div>Failed to load users</div>

  let processedData = [];
  if(data?.results) {
    processedData = data.results.map(user => {
      return {
        username: user.login.username,
        name: `${user.name.first} ${user.name.last}`,
        email: user.email,
        gender: user.gender,
        registerDate: user.registered.date
      }
    });
  }

  const onSearch = keyword => {
    setFilter({
      ...filter,
      keyword
    });
  }
  const handleChangeGender = gender => {
    setFilter({
      ...filter,
      gender
    });
  };

  const handleResetFilter = () => {
    setFilter({
      ...initialFilter
    });
    setTempKeyword('');
  };
  

  const onChange = (pagination, filters, sorter, extra) => {
    if(filter.page !== pagination.current) {
      setFilter({
        ...filter,
        page: pagination.current
      })
    };

    if(sorter.order) {
      setFilter({
        ...filter,
        sortOrder: sorter.order,
        sortBy: sorter.field
      })
    } else if(!sorter.order && filter.sortOrder && filter.sortBy) {
      setFilter({
        ...filter,
        sortOrder: '',
        sortBy: ''
      })
    }
  };


  return (
    <>
      <Head>
        <title>Ajaib Random User</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div style={{ padding: 20 }}>
        <div style={{ display: "flex", gap: 20 }}>
          <div>
            <Search
              placeholder="Search.."
              allowClear
              onSearch={onSearch}
              value={tempKeyword}
              onChange={(e) => setTempKeyword(e.target.value)}
              style={{ width: 200 }}
            />
          </div>
          <div>
          <Select defaultValue="all" value={filter.value} style={{ width: 120 }} onChange={handleChangeGender}>
            <Option value="all">All</Option>
            <Option value="male">Male</Option>
            <Option value="female">Female</Option>
          </Select>
          </div>
          <div>
          <Button type="primary" onClick={handleResetFilter}>Reset Filter</Button>
          </div>
        </div>
        <div style={{ marginTop: '5em' }}>
          <Table
            columns={columns}
            dataSource={processedData}
            onChange={onChange}
            pagination={{
              defaultPageSize: 5,
              current: filter.page
            }}
            loading={!data && !error}
          />
        </div>
      </div>
    </>
  )
}
