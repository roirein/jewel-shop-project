import { createContext } from "react";

const contextValue = {
    onOpenRequestModal: (customerId) => {},
    onOpenModelModal: (modelNumber) => {}
}

const TemplateContext = createContext(contextValue)

export default TemplateContext