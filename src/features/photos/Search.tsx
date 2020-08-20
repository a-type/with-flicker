import * as React from 'react';
import { Box, TextField, makeStyles, Button } from '@material-ui/core';
import { SearchTwoTone } from '@material-ui/icons';
import clsx from 'clsx';
import { useSelector, useDispatch } from 'react-redux';
import { selectSearchFilter, searchAsync } from './photosSlice';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
  },
  searchButton: {
    flex: '0 0 auto',
    margin: 'auto',
    marginLeft: theme.spacing(2),
  },
}));

export function Search({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const classes = useStyles();

  // separation of Redux state and local state -
  // Redux is used to manage the committed value which powers the search filter.
  // Local state stores the ephemeral value which the user may be in the process
  // of typing before submission.
  const savedSearchTerm = useSelector(selectSearchFilter);
  const dispatch = useDispatch();

  const [value, setValue] = React.useState(savedSearchTerm);
  const handleSubmit = React.useCallback(
    (ev: React.FormEvent) => {
      ev.preventDefault();

      dispatch(
        searchAsync({
          value,
        }),
      );
    },
    [value, dispatch],
  );

  return (
    <Box
      component="form"
      display="flex"
      flexDirection="row"
      alignContent="center"
      onSubmit={handleSubmit}
      className={clsx(classes.root, className)}
      {...props}
    >
      <TextField
        value={value}
        onChange={(ev) => setValue(ev.target.value)}
        label="Search photos"
        variant="filled"
        fullWidth
      />
      <Button
        type="submit"
        color="primary"
        variant="contained"
        startIcon={<SearchTwoTone />}
        className={classes.searchButton}
      >
        Search
      </Button>
    </Box>
  );
}
