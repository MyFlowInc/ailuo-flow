import quoteManageSvg from "./assets/ailuo/quote-manage.svg";
import myQuoteProcessSvg from "./assets/ailuo/my-quote-process.svg";
import contractManageSvg from "./assets/ailuo/contract-manage.svg";
import myContractSvg from "./assets/ailuo/my-contract-process.svg";
import deliverManageSvg from "./assets/ailuo/deliver-manage.svg";
import myDeliverSvg from "./assets/ailuo/my-deliver-process.svg";
import quoteTechFeedback from './assets/ailuo/quote-tech-feedback.svg'


import _ from "lodash";
const MenuIconMap = {
	"quote-manage": quoteManageSvg,
	"my-quote": myQuoteProcessSvg,
	"contract-manage": contractManageSvg,
	"my-contract": myContractSvg,
	"my-contract-process": myContractSvg,
	"deliver-manage": deliverManageSvg,
	"my-deliver": myDeliverSvg,
	"my-deliver-process": myDeliverSvg,
	"quote-tech-feedback": quoteTechFeedback,
	'my-quote-process': myQuoteProcessSvg
};

export function getImgByName(name: string) {
	return _.get(MenuIconMap, name) || quoteManageSvg;
}

export default MenuIconMap;
