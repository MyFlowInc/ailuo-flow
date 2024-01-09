export interface DBApitableDatasheet {
	/** 表主键 */
	id: string;
	/** 自定义ID */
	dstId: string | null;
	/** 节点ID */
	nodeId?: string | null;
	/** 表格名 */
	dstName: string | null;
	/** 工作空间 */
	spaceId?: string | null;
	/** 版本号 */
	revision?: number | null;
	/** 归档表示(0:No,1:Yes) */
	archive?: 0 | 1;
	/** 删除表示(0:No,1:Yes) */
	deleted?: 0 | 1;
	/** 排序 */
	sort?: number | null;
	/** 创建人 */
	createBy?: string | null;
	/** 更新人 */
	updateBy?: string | null;
	/** 创建时间 */
	createTime?: string | null;
	/** 更新时间 */
	updateTime?: string | null;
	/** 备注 */
	remark?: string | null;
	/** 租户编号 */
	tenantId?: string | null;
	isCreator: boolean; // 是否是创建者
	isDeveloper: boolean; // 是否是开发者
	icon: string; // 图标
}
