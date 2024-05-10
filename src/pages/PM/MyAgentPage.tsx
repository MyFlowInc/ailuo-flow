import React, { useEffect, useRef, useState } from "react";
import { Space, Table, } from 'antd';
import _ from "lodash";
import styled from "styled-components";
const { Column, ColumnGroup } = Table;
import { AgentProjectList } from "../../api/ailuo/sale";
import { IfetchSaleList } from "./types";
import HeaderToolBar from "./TableHeader";
import { Link } from 'react-router-dom';
const DashboardRoot = styled.div`

	width: 100%;
	height: 100%;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	.ant-modal {
		height: 100vh;
	}
	.step-header {
		background: #ffffff;
		box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.1);
		padding-right: 200px;
	}
  .status-start {
    color: green; /* 设置文字颜色为绿色 */
    font-weight: bold; /* 设置文字加粗 */
    /* 可以根据需求添加其他样式 */
  }
`;

interface Data {
  id: string;
  Name: string;
  projectSaleId: string;
  createTime: string;
  status: string;
}

const MyAgentPage: React.FC = () => {
  const [data, setData] = useState<Data[]>([]);
  const [selectedRows, setSelectedRows] = useState<any[]>([]); //  多选
  useEffect(() => {
    async function fetchAgentList() {
      try {
        const token = localStorage.getItem('token');
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        const res = await AgentProjectList({
          pageNum: 1,
          pageSize: 50,
        }); // 将 headers 传递给请求函数
        setData(res.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchAgentList();
  }, []);

  return (
    <div>
      <h3>我的代办</h3>
      <div style={{ marginLeft: "50%", fontSize: "12px", }} className="flex justify-center items-center cursor-pointer">
        <HeaderToolBar
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
        />
      </div>
      {data.length > 0 && (
        <Table dataSource={data}>
          <Table.ColumnGroup>
            <Table.Column title="项目名称" dataIndex="name" key="name" />
            <Table.Column title="创建日期" dataIndex="createTime" key="createTime" />
            <Table.Column title="节点名称" dataIndex="status" key="status"
              render={(status: string) => {
                if (status === 'pro_reviewing') {
                  return <span className="status-start">立项审核中</span>;
                } else if (status === 'materials_rev') {
                  // 如果有其他状态需要处理，可以在这里添加对应的逻辑
                  // 返回原始状态值
                  return '生产资料审核中';
                } else if (status === 'change_review') {
                  // 如果有其他状态需要处理，可以在这里添加对应的逻辑
                  // 返回原始状态值
                  return '预生产变更审核中';
                }
                else {
                  return status;
                }
              }}
            />
            <Table.Column
              title="操作"
              key="id"
              render={(_: any, record: Data) => (
                <Space size="middle">
                  {/* 有bug，传一个参数没事，应该是接那边的问题，传两个参数预生产页面不跳到自己该去的状态页面 */}
                  <Link to={`/dashboard/pre-product-manage/${record.projectSaleId}&approveId=${record.id}`}>查看</Link>
                </Space>
              )}
            />
          </Table.ColumnGroup>
        </Table>
      )}
    </div>
  );
};

export default MyAgentPage;
