import { useEffect, useState } from "react"
import CenteredStack from "../../../../components/UI/CenteredStack"
import TableComponent from "../../../../components/UI/TableComponent"
import { useIntl } from "react-intl"
import { employeesPageMessages, modelsPageMessages, ordersPageMessages } from "../../../../translations/i18n"

const TaskSummaryComponent = (props) => {

    const [tabelData, setTableData] = useState([]);
    const intl = useIntl();

    let columns = [
        intl.formatMessage(ordersPageMessages.taskNumber),
        intl.formatMessage(employeesPageMessages.employeeName),
        intl.formatMessage(modelsPageMessages.description),
        intl.formatMessage(ordersPageMessages.position)
    ]

    if (props.showStatus) {
        columns = [...columns, intl.formatMessage(modelsPageMessages.status)]
    }

    useEffect(() => {
        const data = []
        const tasks = props.tasks
        tasks.forEach((task) => {
            
            let rowContent = [task.index, task.employee, task.description, task.position]
            if (props.showStatus) {
                const statusMessage = task.isCompleted ? intl.formatMessage(ordersPageMessages.taskCompleted) : intl.formatMessage(ordersPageMessages.taskNotCompleted)
                rowContent = [...rowContent, statusMessage]
            }

            data.push({
                rowId: task.index,
                rowContent
            })
        })
        setTableData(data)
    }, [])

    return (
        <CenteredStack
            width="100%"
        >
            <TableComponent
                columns={columns}
                data={tabelData}
            />
        </CenteredStack>
    )
}

export default TaskSummaryComponent