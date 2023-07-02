import { Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Paper, useTheme, Link, Checkbox, Stack, Button} from "@mui/material";
import { useIntl } from "react-intl";
import { buttonMessages } from "../../translations/i18n";
import { useState } from "react";
import CenteredStack from "./CenteredStack";
import ButtonComponent from "./ButtonComponent";


const TableComponent = (props) => {

    const theme = useTheme()
    const intl = useIntl()

    const [selectedRowId, setSelectedRowId] = useState(null)
    console.log(props.data)

    return (
        <CenteredStack
            rowGap={theme.spacing(3)}
        >
            <TableContainer 
                component={Paper}
                sx={{
                    maxWidth: '80%'
                }}
            >
                <Table
                    sx={{
                        width: '100%',
                        direction: theme.direction,
                        tableLayout: 'fixed'
                    }}
                >
                    <TableHead
                        sx={{
                            backgroundColor: theme.palette.primary.main
                        }}
                    >
                        <TableRow>
                            {props.allowDelete && (
                                <TableCell/>
                            )}
                            {props.columns.map((column, index) => ( 
                                <TableCell
                                    key={index}
                                    sx={{
                                        color: theme.palette.secondary.main,
                                        fontWeight: 'bold',
                                        textAlign: 'center',
                                    }}
                                >
                                    {column}
                                </TableCell>
                            ))}
                            {props.showMore && (
                                <TableCell
                                    sx={{
                                        color: theme.palette.secondary.main,
                                    }}
                                />
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.data.map((row, rowIndex) => (
                            <TableRow
                                key={rowIndex}
                            >
                                {props.allowDelete && (
                                    <TableCell>
                                        <Checkbox
                                            checked={row.rowId === selectedRowId}
                                            onChange={() => {
                                                if (row.rowId === selectedRowId) {
                                                    console.log(selectedRowId)
                                                    setSelectedRowId(null)
                                                } else {
                                                    console.log(1)
                                                    console.log(row)
                                                    setSelectedRowId(row.rowId)
                                                }
                                            }}
                                        />
                                    </TableCell>
                                )}
                                {row.rowContent.map((column, colIndex) => (
                                    <TableCell
                                        key={colIndex}
                                        sx={{
                                            textAlign: 'center',
                                        }}
                                    >
                                        {column || 'N/A'}
                                    </TableCell>
                                ))}
                                {props.showMore && (
                                    <TableCell
                                        sx={{
                                            textAlign: 'center'
                                        }}
                                    >
                                        <Button
                                            variant="text"
                                            color="primary"
                                            onClick={() => props.onClickShowMore(row.rowId)}
                                            fontWeight="bold"
                                            sx={{
                                                cursor: 'pointer',
                                                textDecoration: 'underline'
                                            }}
                                            disabled={!row.rowId}
                                        >
                                            {intl.formatMessage(buttonMessages.showMore)}
                                        </Button>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {props.allowDelete && (
                <Stack
                    width="10%"
                >
                    <ButtonComponent
                        label={props.deleteButtonLabel}
                        onClick={() => props.onDeleteRow(selectedRowId)}
                        disabled={!selectedRowId}
                    />
                </Stack>
            )}
        </CenteredStack>
    )
}

export default TableComponent