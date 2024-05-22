import React, { useState, useEffect, FC, useContext } from "react";
import styled from "styled-components";
import {
  ConfigProvider,
  Form,
  Button,
  Tag,
  Popover,
  Input,
  Popconfirm,
  Avatar,
  Badge,
  message,
  Modal,
} from "antd";
import { blueButtonTheme, greyButtonTheme, redButtonTheme } from "../../../theme/theme";
import { Attachment, NumFieldType } from "../../../components/Dashboard/TableColumnRender";

import _ from "lodash";
import {
  selectAllUser,
  selectIsFinance,
  selectIsManager,
  selectUser,
  setCurSaleForm,
} from "../../../store/globalSlice";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { PreProductionContext } from "../PreProductionManage";
import CellEditorContext from "../../Sale/FormModal/CellEditorContext";
import { NoFieldData } from "../../Sale/FormModal/NoFieldData";
import { SPLProductStatusMap } from "../../../api/ailuo/dict";
import { splFolderFileCreate, splPreProjectEdit } from "../../../api/ailuo/spl-pre-product";
import TextArea from "antd/es/input/TextArea";
import warnSvg from "../../Sale/assets/warning.svg";
import { useHistory, useLocation } from "react-router";
import ModeSelectTable from "../ModeSelectTable";

const CustomModalRoot = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	height: 100%;
	.header {
		width: 100%;
		height: 18px;
		display: flex;
		.title {
			font-size: 18px;
			font-family: "Harmony_Sans_Medium", sans-serif;
		}
	}
	.status-operate {
		margin-top: 8px;
		margin-bottom: 16px;
	}
	.content {
		width: 100%;
		height: calc(100% - 100px);
		overflow: overlay;
	}

	.footer {
		display: flex;
		align-items: flex-end;
		margin-bottom: 16px;
		flex: 1;
		justify-content: space-between;
	}
`;


export const columns: any = [
  {
    title: "项目名称",
    dataIndex: "name",
    key: "name",
    type: NumFieldType.SingleText,
  },
  {
    title: "单位名称",
    dataIndex: "company",
    key: "company",
    type: NumFieldType.SingleSelect,
    dictCode: "company",
  },
  {
    title: "单位联系方式",
    dataIndex: "phone",
    key: "phone",
    type: NumFieldType.SingleText,
  },

  {
    title: "销售经理",
    dataIndex: "salesManager",
    key: "salesManager",
    type: NumFieldType.SingleSelect,
    dictCode: "salesManager",
  },
  {
    title: "合同编号",
    dataIndex: "uuid",
    key: "uuid",
    type: NumFieldType.SingleText,
  },
  {
    title: "合同日期",
    dataIndex: "contractTime",
    key: "contractTime",
    type: NumFieldType.DateTime,
  },

  {
    title: "执行机构型号",
    dataIndex: "typeSelection",
    key: "typeSelection",
    render: (
      column: any,
      key: string,
      form: any,
      setForm: (value: any) => void,
    ) => {
      return (
        <div key={"ModeSelect_" + key} className="w-full">
          <ModeSelectTable
            key={"ModeSelectTable" + key}
            {...{ column, form, setForm }}
          />
        </div>
      );
    },
  },
  {
    title: "总数量",
    dataIndex: "totalNum",
    key: "totalNum",
    render: (
      column: any,
      key: string,
      form: any,
      setForm: (value: any) => void,
    ) => {
      let totalNum = 0;

      try {
        const list = form.typeSelection;
        list.forEach((item: any) => {
          totalNum += +item.num;
        });
      } catch (error) { }

      return (
        <div key={"name_" + key} className="w-full mt-4">
          <div className="w-full">
            <div className="flex mb-4">
              <div style={{ width: "100px" }}>总数量</div>
              <div className="flex-1 flex items-center">
                {/* <span key={"totalNum" + key}>{totalNum}</span> */}
                <Input disabled key={"totalNum" + key} value={`${totalNum}`} />
              </div>
            </div>
          </div>
        </div>
      );
    },
  },
  {
    title: "交期",
    dataIndex: "quotationEnd",
    key: "quotationEnd",
    type: NumFieldType.DateTime,
  },

  {
    title: "技术规格表",
    dataIndex: "technicalSheet",
    key: "technicalSheet",
    type: NumFieldType.Attachment,
  },
  {
		title: "合同附件",
		dataIndex: "otherFile",
		key: "otherFile",
		render: (
			column: any,
			key: string,
			form: any,
		) => {
			return (
				<div key={"name_" + key} className="w-full mt-4">
					<div className="w-full">
						<div className="flex mb-4">
							<div style={{ width: "100px" }}>合同附件</div>
							<div className="flex-1 flex items-center">
								<Attachment value={form[column.key]}></Attachment>
							</div>
						</div>
					</div>
				</div>
			);
		},
	},
  {
    title: "关联技术评审",
    dataIndex: "relationReview",
    key: "relationReview",
    // type: NumFieldType.RelationTechView,
    type: NumFieldType.SingleText,
  },
  {
    title: "关联报价",
    dataIndex: "relationSale",
    key: "relationSale",
    // type: NumFieldType.RelationSaleView,
    type: NumFieldType.SingleText,
  },
];

const AllInfoModal: React.FC<any> = (props: any) => {
  const { isShowInfoModal, setIsShowInfoModal, project: projectInfo } = props;
  const [showDstColumns, setShowDstColumns] = useState(columns.map((item: any) => {
    return {
      ...item,
      disabled: true,
    };
  }));
  const [inputForm] = Form.useForm();
  const [form, setForm] = useState<any>({});
  const location = useLocation();
  const history = useHistory();

  const allUser = useAppSelector(selectAllUser);
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const isManager = useAppSelector(selectIsManager);
  const isFinance = useAppSelector(selectIsFinance);
  const { curProject, setIsShowApproveModal, freshData } = useContext(PreProductionContext) as any;
  const [saveButtonDisabled, setSaveButtonDisabled] = useState(false);

  const setAllDisabled = (disabled: boolean) => {
    disabled = isManager ? false : disabled;
    if (isFinance) {
      disabled = true;
    }
    const newCol = showDstColumns.map((item: any) => {
      return {
        ...item,
        disabled,
      };
    });
    setShowDstColumns(newCol);
    setSaveButtonDisabled(disabled);
  };

  useEffect(() => {
    if (_.isEmpty(curProject)) {
      return
    }
    if (location.pathname.includes('addfromcontract')) {
      console.log('router from addfromcontract');
      const {
        id, // 合同id
        name,
        company,
        phone,
        salesManager,
        uuid,	// 合同编号
        contractTime,
        typeSelection,
        quotationEnd,
        relateTechProcess,
        relationSale,
        relationReview,
        otherFile,
      } = curProject;
      setForm((v: any) => {
        return {
          ...v,
          name,
          company,
          phone,
          salesManager,
          uuid,	// 合同编号
          contractTime,
          typeSelection,
          quotationEnd,
          otherFile,
          relationContract: id, // 合同id
          relationReview: relationSale, //关联技术评审
          relationSale: relationReview, //关联报价
        };
      });
    } else if (location.pathname.includes('add')) {
      setForm({});
    } else if (!_.isEmpty(curProject)) {
      const temp = curProject
      if (typeof temp.typeSelection === 'string') {
        try {
          // 处理初步选型型号
          temp.typeSelection = JSON.parse(temp.typeSelection || "[]");
        } catch (error) {
          temp.typeSelection = [];
        }
      }
      setForm(temp);
    }
  }, [curProject]);

  // 初始化form数据
  useEffect(() => {
    if (!open) {
      setForm({});
      return;
    }
    if (projectInfo) {
      const { key, ...temp } = projectInfo;
      try {
        // 处理执行机构型号
        temp.typeSelection = JSON.parse(temp.typeSelection || "[]");
      } catch (error) {
        temp.typeSelection = [];
      }
      setForm(temp);
      inputForm.setFieldsValue(temp);
    }

  }, [open]);

  // 控制 只读和编辑
  useEffect(() => {
    if (_.isEmpty(showDstColumns)) {
      return;
    }
  }, [form.status, open]);
  const handleCancel = () => {
    setIsShowInfoModal(false);
  };

  return (
    <Modal title="项目信息" open={isShowInfoModal} footer={null} onCancel={handleCancel}>

      <CustomModalRoot>
        <div className="content">
          <Form
            form={inputForm}
            name="recordForm"
            colon={false}
            wrapperCol={{ flex: 1 }}
            preserve={false}
          >
            {showDstColumns.length > 0 ? (
              <CellEditorContext
                form={form}
                setForm={setForm}
                dstColumns={showDstColumns}
                modalType={'edit'}
              />
            ) : (
              <NoFieldData />
            )}
          </Form>
        </div>
        <div className="footer"></div>
      </CustomModalRoot>
    </Modal>

  );
};

export default AllInfoModal;
