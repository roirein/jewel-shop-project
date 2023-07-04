import { useEffect, useState } from "react"
import CenteredStack from "../../../../components/UI/CenteredStack"
import TableComponent from "../../../../components/UI/TableComponent"
import { useIntl } from "react-intl"
import { employeesPageMessages, modelsPageMessages, ordersPageMessages } from "../../../../translations/i18n"

const TaskSummaryComponent = (props) => {

    const [tabelData, setTableData] = useState([]);
    const intl = useIntl();

    useEffect(() => {
        const data = []
        const tasks = props.tasks
        tasks.forEach((task) => {
            data.push({
                rowId: task.index,
                rowContent: [task.index, task.employee, task.description]
            })
        })
        setTableData(data)
    }, [])

    return (
        <CenteredStack
            width="100%"
        >
            <TableComponent
                columns={[
                    intl.formatMessage(ordersPageMessages.taskNumber),
                    intl.formatMessage(employeesPageMessages.employeeName),
                    intl.formatMessage(modelsPageMessages.description)
                ]}
                data={tabelData}
            />
        </CenteredStack>
    )
}

export default TaskSummaryComponent