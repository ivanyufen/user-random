import Head from 'next/head'
import { useState, useMemo, useEffect, useCallback } from 'react';
import { Input, Select, Button, Table } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';

const { Search } = Input;
const { Option } = Select;

const request = axios.create({
  baseURL: 'https://randomuser.me/api'
});

const initialQuery = {
  page: 1,
  pageSize: 10,
  results: 10,
  keyword: '',
  gender: '',
  sortOrder: '',
  sortBy: ''
};


const Users = () => {
  
  const [query, setQuery] = useState({ ...initialQuery });
  const [tempKeyword, setTempKeyword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);

  const processedUsers = () => users.map((user) => {
    return {
      username: user.login.username,
      name: `${user.name.first} ${user.name.last}`,
      email: user.email,
      gender: user.gender,
      registerDate: dayjs(user.registered.date).format('DD-MM-YYYY HH:mm')
    }
  });

  useEffect(() => {
    fetchUsers(query);
  }, []);

  useEffect(() => {
    fetchUsers(query);
  }, [query])

  const fetchUsers = useCallback(async (queryProps) => {
    setIsLoading(true);
    setUsers([]);
    const params = {};
    for(let key in queryProps) {
      if(queryProps[key]) {
        params[key] = queryProps[key];
      }
    }
    console.log("fetchuser param", params)
    request.get('/', { params })
    .then((res) => {
      if(res.data) {
        setUsers(res.data.results);
      };
      setIsLoading(false);
    })
  }, []);

  const onSearch = keyword => {
    setQuery({
      ...query,
      keyword
    });
  }
  const handleChangeGender = gender => {
    setQuery({
      ...query,
      gender
    });
  };

  const handleResetQuery = () => {
    setQuery({
      ...initialQuery
    });
    setTempKeyword('');
  };

  const onChange = (pagination, filters, sorter, extra) => {
    if(query.page !== pagination.current) {
      setQuery({
        ...query,
        page: pagination.current
      })
    };

    if(sorter.order) {
      setQuery({
        ...query,
        sortOrder: sorter.order,
        sortBy: sorter.field
      })
    } else if(!sorter.order && query.sortOrder && query.sortBy) {
      setQuery({
        ...query,
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
              disabled={isLoading}
              placeholder="Search.."
              allowClear
              onSearch={onSearch}
              value={tempKeyword}
              onChange={(e) => setTempKeyword(e.target.value)}
              style={{ width: 200 }}
            />
          </div>
          <div>
          <Select disabled={isLoading} defaultValue="" value={query.gender} style={{ width: 120 }} onChange={handleChangeGender}>
            <Option value="">All</Option>
            <Option value="male">Male</Option>
            <Option value="female">Female</Option>
          </Select>
          </div>
          <div>
          <Button disabled={isLoading} type="primary" onClick={handleResetQuery}>Reset Filter</Button>
          </div>
        </div>
        <div style={{ marginTop: '5em' }}>
          <Table
            columns={[
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
            ]}
            dataSource={processedUsers()}
            onChange={onChange}
            pagination={{
              defaultPageSize: 5,
              current: query.page
            }}
            loading={isLoading}
          />
        </div>
      </div>
    </>
  )
};

export default Users;