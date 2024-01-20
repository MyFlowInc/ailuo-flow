import { apiCall } from "../../network";




//  当前报价的审批人设置情况
export function approveInfo(projectSaleId: string) {
  return apiCall({
    url: "api/sys/projectFlowStep/page",
    method: "get",
    params: {
      pageNum: 1,
      pageSize: 10,
      projectSaleId
    }
  });
}


interface ApprovePersonAddParams {
  carbonUserId: string
  projectSaleId: string
  relationUserId: string
}
// 添加审批人
export function approvePersonAdd(data: ApprovePersonAddParams) {
  return apiCall({
    url: "api/sys/projectFlowStep/save",
    method: "get",
    data
  });
}
