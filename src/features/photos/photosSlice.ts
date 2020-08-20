import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../app/store';
import { searchPhotos, PhotoData } from '../../services/flickr';

interface SearchState {
  filter: string;
  fetching: boolean;
  results: {
    photos: PhotoData[];
    latestPage: number;
    pageCount: number;
  };
}

const initialState: SearchState = {
  filter: '',
  fetching: false,
  results: {
    photos: [],
    latestPage: 0,
    pageCount: 0,
  },
};

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    /**
     * @note on these reducers - redux-toolkit integrates immer,
     * which allows immutable state updates using mutable syntax.
     * I'm not mutating the Redux store!
     */

    beginSearch: (state, action: PayloadAction<{ value: string }>) => {
      state.filter = action.payload.value;
      // since the filter has changed, reset the result cache.
      state.results = {
        photos: [],
        latestPage: 0,
        pageCount: 0,
      };
      state.fetching = true;
    },
    completeSearch: (
      state,
      action: PayloadAction<{
        page: number;
        pageCount: number;
        photos: PhotoData[];
      }>,
    ) => {
      state.results = {
        latestPage: action.payload.page,
        pageCount: action.payload.pageCount,
        photos: [...state.results.photos, ...action.payload.photos],
      };
      state.fetching = false;
    },
    beginPageFetch: (state) => {
      state.fetching = true;
    },
  },
});

export const searchAsync = ({ value }: { value: string }): AppThunk => async (
  dispatch,
) => {
  // immediately update stored filter value
  dispatch(searchSlice.actions.beginSearch({ value }));

  const response = await searchPhotos({ text: value });

  dispatch(
    searchSlice.actions.completeSearch({
      page: response.page,
      pageCount: response.pages,
      photos: response.photo,
    }),
  );
};

export const nextPageAsync = (): AppThunk => async (dispatch, getState) => {
  dispatch(searchSlice.actions.beginPageFetch());

  const currentFilter = selectSearchFilter(getState());
  const currentPage = selectLatestPage(getState());
  const response = await searchPhotos({
    text: currentFilter,
    page: currentPage + 1,
  });

  dispatch(
    searchSlice.actions.completeSearch({
      page: response.page,
      pageCount: response.pages,
      photos: response.photo,
    }),
  );
};

export const selectSearchFilter = (state: RootState) => state.photos.filter;
export const selectPhotos = (state: RootState) =>
  state.photos.results.photos ?? [];
export const selectLatestPage = (state: RootState) =>
  state.photos.results.latestPage;
export const selectHasNextPage = (state: RootState) =>
  state.photos.results.latestPage < state.photos.results.pageCount;
export const selectFetching = (state: RootState) => state.photos.fetching;

export default searchSlice.reducer;
