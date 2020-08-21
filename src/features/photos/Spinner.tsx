import * as React from 'react';
import { motion } from 'framer-motion';
import { CircularProgress } from '@material-ui/core';

export function Spinner() {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 80 }}
      /*
        delay showing the spinner for 2 seconds - if the content loads
        faster, we never show a spinner, which makes the user feel like
        the loading was faster.

        React Suspense is also a great solution for this, but I opted
        for a Redux-based async lifecycle and haven't really worked
        out whether Suspense has a good compatibility story with Redux in
        general. I'm used to working with GraphQL clients, though,
        which largely support Suspense for data fetching even though
        it's not 'official' yet.
      */
      transition={{ delay: 2 }}
    >
      <CircularProgress />
    </motion.div>
  );
}
