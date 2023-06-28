import {Tabs, Stack, Tab, useTheme} from '@mui/material'
import { useRouter } from 'next/router'
import { CUSTOMER_TABS } from '../../../const/TabDefinitions';
import Link from 'next/link';

const PageLayout = (props) => {

    const router = useRouter();
    const theme = useTheme()

    return (
        <Stack
            width="100%"
        >
            <Tabs
                value={router.pathname}
                indicatorColor="transparent"
                sx={{
                    direction: theme.direction,
                    pr: theme.spacing(4)
                }}
            >
                {CUSTOMER_TABS.map((tab, index) => (
                    <Tab
                        key={index}
                        label={(
                            <Link
                                href={tab.route}
                                style={{
                                    textDecoration: 'none',
                                    color: '#a05444',
                                    fontWeight: router.pathname === tab.route ? 'bold' : 'normal'
                                }}
                            >
                                {tab.label}
                            </Link>
                        )}
                        value={tab.route}
                        sx={{
                            border: router.pathname === tab.route ? `${theme.spacing(1)} solid ${theme.palette.primary.main}` : 'none'
                        }}
                    />
                ))}
            </Tabs>
            {props.children}
        </Stack>
    )
}

export default PageLayout