import quoteManageSvg from "./assets/ailuo/quote-manage.svg";
import myQuoteProcessSvg from "./assets/ailuo/my-quote-process.svg";
import contractManageSvg from "./assets/ailuo/contract-manage.svg";
import myContractSvg from "./assets/ailuo/my-contract-process.svg";
import deliverManageSvg from "./assets/ailuo/deliver-manage.svg";
import myDeliverSvg from "./assets/ailuo/my-deliver-process.svg";
import _ from "lodash";
const MenuIconMap = {
	"quote-manage": quoteManageSvg,
	"my-quote": myQuoteProcessSvg,
	"contract-manage": contractManageSvg,
	"my-contract": myContractSvg,
	"deliver-manage": deliverManageSvg,
	"my-deliver": myDeliverSvg
};

export function getImgByName(name: string) {
	return _.get(MenuIconMap, name) || quoteManageSvg;
}

export default MenuIconMap;
