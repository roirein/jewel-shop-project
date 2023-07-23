import { createContext } from "react";

const contextValue = {
    onOpenRequestModal: (customerId) => {}
}

const TemplateContext = createContext(contextValue)

export default TemplateContext