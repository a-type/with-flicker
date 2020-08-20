import * as React from 'react';
import { Box, TextField, IconButton } from '@material-ui/core';
import { SearchTwoTone } from '@material-ui/icons';
import { useSelector, useDispatch } from 'react-redux';
import { selectSearchFilter, searchAsync } from './photosSlice';

export function Search() {
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
      onSubmit={handleSubmit}
      width="100%"
    >
      <TextField
        value={value}
        onChange={(ev) => setValue(ev.target.value)}
        label="Search photos"
      />
      <IconButton type="submit">
        <SearchTwoTone />
      </IconButton>
    </Box>
  );
}
