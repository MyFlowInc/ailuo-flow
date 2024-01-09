import { createContext } from "react";

type Tour = {
	tourRefs?: any[];
	setTourRefs?: any;
};
const TourContext = createContext<Tour>({});

export default TourContext;
