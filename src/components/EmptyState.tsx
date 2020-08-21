import * as React from 'react';
import { Box, Typography } from '@material-ui/core';

export function EmptyState() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      style={{ opacity: 0.9 }}
    >
      <span
        role="img"
        aria-label="wave"
        style={{ fontSize: '10vmin', margin: 32 }}
      >
        👋
      </span>
      <Typography>
        Hi there! Type a search term above to see some photos.
      </Typography>
    </Box>
  );
}
