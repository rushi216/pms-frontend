import { Typography, Paper, Grid } from '@mui/material';
import { Assessment, Group, AdminPanelSettings } from '@mui/icons-material';

export default function Dashboard() {
  const stats = [
    {
      title: 'Pending Reviews',
      value: '5',
      icon: <Assessment sx={{ fontSize: 40, color: 'primary.main' }} />,
    },
    {
      title: 'Team Members',
      value: '12',
      icon: <Group sx={{ fontSize: 40, color: 'secondary.main' }} />,
    },
    {
      title: 'Department',
      value: 'Engineering',
      icon: <AdminPanelSettings sx={{ fontSize: 40, color: 'success.main' }} />,
    },
  ];

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Welcome to Performance Review Tracker
      </Typography>
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} md={4} key={stat.title}>
            <Paper
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: '100%',
              }}
              elevation={2}
            >
              {stat.icon}
              <Typography variant="h6" sx={{ mt: 2 }}>
                {stat.title}
              </Typography>
              <Typography variant="h4" color="primary">
                {stat.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
