import { Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Paper, useTheme, Link} from "@mui/material";
import { useIntl } from "react-intl";
import { buttonMessages } from "../../translations/i18n";

const TableComponent = (props) => {

    const theme = useTheme()
    const intl = useIntl()

    return (
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
                            {row.rowContent.map((column, colIndex) => (
                                <TableCell
                                    key={colIndex}
                                    sx={{
                                        textAlign: 'center',
                                    }}
                                >
                                    {column}
                                </TableCell>
                            ))}
                            {props.showMore && (
                                <TableCell
                                    sx={{
                                        textAlign: 'center'
                                    }}
                                >
                                    <Link
                                        variant="body1"
                                        color={theme.palette.primary.main}
                                        onClick={() => props.onClickShowMore(row.rowId)}
                                        fontWeight="bold"
                                        sx={{
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {intl.formatMessage(buttonMessages.showMore)}
                                    </Link>
                                </TableCell>
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default TableComponent