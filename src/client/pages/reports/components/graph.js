import {useEffect, useState} from 'react'
import { useIntl } from 'react-intl';
import { reportsPageMessages, tabsMessages } from '../../../translations/i18n';
import { Container, Typography, useTheme, Stack, IconButton, Box } from '@mui/material';
import { Bar, Line } from 'react-chartjs-2';
import dayjs from 'dayjs';
import { Chart, LineController, LineElement, PointElement, LinearScale, Title,CategoryScale, BarController, BarElement } from 'chart.js';
import { BarChart, Timeline } from '@mui/icons-material';

Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, BarController, BarElement);

const GraphComponent = (props) => {
    
    const [selectedMonthDataSet, setSelectedMonthDatatSet] = useState({});
    const [prevMonthDataSet, setPrevMonthDataSet] = useState({});
    const [chartData, setChartData] = useState({});
    const [isBarGraph, setIsBarGraph] = useState(false);

    const intl = useIntl();
    const theme = useTheme()

    const options = {
        scales: {
            x: {
                    type: 'category', // Use 'category' scale for the X-axis
                    labels: chartData.labels, // Pass the labels directly to the chart options
                    position: 'bottom',
                    title: {
                        display: true,
                        text: intl.formatMessage(reportsPageMessages.day)
                    },
                },
            y: {
                    title: {
                        display: true,
                        text: props.yAxisLabel,
                    },
                },
            },
        }

    const createGraphData = (ordersArray) => {
        const graphDataSet = {}
        ordersArray.forEach((order) => {
            const day = dayjs(order.createdAt).format('DD/MM/YYYY')
            if (!graphDataSet[day]) {
                if (props.field === 'order') {
                    graphDataSet[day] = 1
                } else {
                    graphDataSet[day] = order.price
                }
            } else { 
                if (props.field === 'order') {
                    graphDataSet[day] += 1
                } else {
                    graphDataSet[day] += order.price
                }
            }
        })

        const graphDataArray = Object.entries(graphDataSet);

        graphDataArray.sort((a, b) => {
          const dateA = dayjs(a[0], 'DD/MM/YYYY');
          const dateB = dayjs(b[0], 'DD/MM/YYYY');
          return dateA.isBefore(dateB) ? -1 : 1;
        });
      
        const sortedGraphDataSet = {};
        graphDataArray.forEach(([day, count]) => {
          sortedGraphDataSet[day] = count;
        });
      
        return sortedGraphDataSet;
    }

    useEffect(() => {
        setSelectedMonthDatatSet(createGraphData(props.selectedOrders))
        setPrevMonthDataSet(createGraphData(props.prevOrders))
    }, [props.selectedOrders, props.prevOrders])

    useEffect(() => {
        if (props.selectedOrders.length > 0 && props.prevOrders.length > 0) {
            setChartData({
                labels: Object.keys(selectedMonthDataSet),
                datasets: [
                    {
                        label: props.selectedMonthLabel,
                        data: Object.values(selectedMonthDataSet),
                        borderColor: theme.palette.primary.main,
                        backgroundColor: theme.palette.primary.main,
                    },
                    {
                        label: props.prevMonthLabel,
                        data: Object.values(prevMonthDataSet),
                        borderColor: theme.palette.secondary.main,
                        backgroundColor: theme.palette.secondary.main 
                    }
                ]
            })
        }
    }, [selectedMonthDataSet, prevMonthDataSet])

    return (
        <Container maxWidth="md">
            <Stack
                rowGap={theme.spacing(3)}
            >
                <Typography
                    varinat="h3"
                    sx={{
                        margin: '0 auto'
                    }}
                >
                    {props.selectedMonthLabel}
                </Typography>
                <Stack
                    direction="row"
                    columnGap={theme.spacing(3)}
                    width="100%"
                >
                    <IconButton
                        disabled={!isBarGraph}
                        onClick={() => setIsBarGraph(false)}
                    >
                        <Timeline color={isBarGraph ? 'primary' : 'disabled'}/>
                    </IconButton>
                    <IconButton
                        disabled={isBarGraph}
                        onClick={() => setIsBarGraph(true)}
                    >
                        <BarChart color={!isBarGraph ? 'primary' : 'disabled'}/>
                    </IconButton>
                    <Stack
                        direction="row"
                        sx={{
                            direction: theme.direction,
                            marginLeft: 'auto'
                        }}
                        columnGap={theme.spacing(3)}
                    >
                        <Stack
                            direction="row"
                            columnGap={theme.spacing(2)}
                            alignItems="center"
                        >
                            <Box
                                width="20px"
                                height="20px"
                                backgroundColor="primary.main"
                            />
                            <Typography
                                varinat="body2"
                            >
                                {intl.formatMessage(reportsPageMessages.selectedMonth)}
                            </Typography>
                        </Stack>
                        <Stack
                            direction="row"
                            columnGap={theme.spacing(2)}
                            alignItems="center"
                        >
                            <Box
                                width="20px"
                                height="20px"
                                backgroundColor="secondary.main"
                            />
                            <Typography
                                varinat="body2"
                            >
                                {intl.formatMessage(reportsPageMessages.previousMonth)}
                            </Typography>
                        </Stack>
                    </Stack>
                </Stack>
            </Stack>
            {chartData.labels && chartData.datasets && (
                <>
                    {!isBarGraph && (
                        <Line 
                            data={chartData}
                            options={options}
                        />
                    )}
                    {isBarGraph && (
                        <Bar
                            data={chartData}
                            options={options}
                        />
                    )}
                </>
            )}
        </Container>
    )
}

export default GraphComponent