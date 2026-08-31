import {
    Card,
    CardContent,
    Typography,
    Avatar,
    Box
} from "@mui/material";

import { MdAssignment } from "react-icons/md";

function DashboardCard({
    title,
    value,
    color
}) {

    return (
        <Card
            sx={{
                borderRadius: 4,
                width: "100%",
                boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                transition: "0.3s",
                cursor: "pointer",
                "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 18px 35px rgba(0,0,0,0.15)"
                }
            }}
        >
            <CardContent>

                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  
                >

                    <Box>
                        <Typography
                            color="text.secondary"
                            variant="body2"
                        >
                            {title}
                        </Typography>

                        <Typography
                            variant="h3"
                            fontWeight="bold"
                        >
                            {value}
                        </Typography>
                    </Box>

                    <Avatar
                        sx={{
                            bgcolor: color,
                            width: 60,
                            height: 60
                        }}
                    >
                        <MdAssignment size={30} />
                    </Avatar>

                </Box>

            </CardContent>
        </Card>
    );
}

export default DashboardCard;