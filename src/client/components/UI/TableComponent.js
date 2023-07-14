import { Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Paper, useTheme, Link, Checkbox, Stack, Button, TablePagination, Typography} from "@mui/material";
import { useIntl } from "react-intl";
import { buttonMessages } from "../../translations/i18n";
import { useState, useEffect } from "react";
import CenteredStack from "./CenteredStack";
import ButtonComponent from "./ButtonComponent";
import FormSelectComponent from '../UI/Form/Inputs/FormSelectComponent'
import { FormProvider, useForm } from "react-hook-form";


const TableComponent = (props) => {

    const theme = useTheme()
    const intl = useIntl()

    const [page, setPage] = useState(0)

    const handlePageChange = (event, newPage) => {
        setPage(newPage)
    }

    const onSelectRow = (rowId) => {
        if (rowId === props.selectedRowId) {
            props.onSelectRow(null)
        } else {
            props.onSelectRow(rowId)
        }
    }

    const methods = useForm();

    const getFilterOptions = (options) => {
        if (options) {
            return Object.entries(options).map((entry) => {
                return {
                    value: entry[0],
                    label: entry[1]
                }
            })   
        }
    }

    return (
        <CenteredStack
            rowGap={theme.spacing(3)}
        >
            {props.tableFilters && props.tableFilters.length > 0 && (     
                <Stack
                    width="80%"
                    alignItems="flex-end"
                    flexDirection="row-reverse"
                    columnGap={theme.spacing(4)}
                >
                    <Typography>
                        {intl.formatMessage(buttonMessages.filterBy)}
                    </Typography>
                    <FormProvider {...methods}>
                        <form
                            style={{
                                width: '100%'
                            }}
                        >
                            <Stack
                                width="100%"
                                direction="row"
                                columnGap={theme.spacing(3)}
                                sx={{
                                    direction: theme.direction,
                                    mr: theme.spacing(3)
                                }}
                                justifyContent="flex-start"
                            >
                                {props.tableFilters.map((filter) => {
                                    return (
                                        <Stack
                                            key={filter}
                                            maxWidth="25%"
                                            minWidth="15%"
                                        >
                                            <FormSelectComponent
                                                name={filter.name}
                                                items={getFilterOptions(filter.options)}
                                                fieldLabel={filter.label}
                                                key={filter}
                                                onChange={(val) => {
                                                    props.onFilterChange(val)
                                                }}
                                            />
                                        </Stack>
                                    )
                                })}
                            </Stack>
                        </form>
                    </FormProvider>
                </Stack>
            )}
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
                            backgroundColor: theme.palette.primary.main,
                        }}
                    >
                        <TableRow>
                            <TableCell/>
                            {props.columns.map((column, index) => ( 
                                <TableCell
                                    key={index}
                                    sx={{
                                        color: theme.palette.secondary.contrastText,
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
                                        color: theme.palette.secondary.contrastText,
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
                                <TableCell>
                                    <Checkbox
                                        checked={row.rowId === props.selectedRowId}
                                        onChange={() => onSelectRow(row.rowId)}
                                    />
                                </TableCell>
                                {row.rowContent.map((column, colIndex) => {
                                    console.log(row, 1)
                                    return (
                                        <TableCell
                                            key={colIndex}
                                            sx={{
                                                textAlign: 'center',
                                            }}
                                        >
                                            {column || 'N/A'}
                                        </TableCell>
                                    )
                                })}
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
            <Stack
                width="80%"
                alignItems="flex-end"
            >
                <TablePagination
                    rowsPerPageOptions={-1}
                    count={props.data.length}
                    rowsPerPage={20}
                    page={page}
                    onPageChange={handlePageChange}
                    sx={{
                        border: 'none',
                        '.MuiTablePagination-actions': {
                            direction: theme.direction
                        }
                    }}
                />
            </Stack>
        </CenteredStack>
    )
}

export default TableComponent