import { Tabs, Tab, useTheme } from "@mui/material"
import Link from "next/link";
import { useRouter } from "next/router";

const TemplateTabsComponent = (props) => {

    const router = useRouter()
    const theme = useTheme()

    return (
        <Tabs
            value={router.pathname}
            indicatorColor="primary"
            sx={{
                direction: theme.direction
            }}
        >
            {props.tabs.map((tab, index) => (
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
                />
            ))}
        </Tabs>
    )
}

export default TemplateTabsComponent