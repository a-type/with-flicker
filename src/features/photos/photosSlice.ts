import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../app/store';
import { searchPhotos, PhotoData } from '../../services/flickr';

interface SearchState {
  initial: boolean;
  filter: string;
  fetching: boolean;
  results: {
    photos: PhotoData[];
    latestPage: number;
    pageCount: number;
  };
  focusedPhotoId: string | null;
}

const initialState: SearchState = {
  filter: '',
  fetching: false,
  results: {
    photos: [],
    latestPage: 0,
    pageCount: 0,
  },
  focusedPhotoId: null,
  // it's a slight hack - but this starts true and is set to false
  // after the first search, then never changed again. Helps track whether
  // we're in a completely initial state or not.
  initial: true,
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
      state.initial = false;
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
    focusPhoto: (state, action: PayloadAction<{ id: string }>) => {
      state.focusedPhotoId = action.payload.id;
    },
    closeFocusedPhoto: (state) => {
      state.focusedPhotoId = null;
    },
  },
});

// public actions

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

export const { focusPhoto, closeFocusedPhoto } = searchSlice.actions;

// selectors

export const selectSearchFilter = (state: RootState) => state.photos.filter;

export const selectPhotos = (state: RootState) =>
  state.photos.results.photos ?? [];

export const selectLatestPage = (state: RootState) =>
  state.photos.results.latestPage;

export const selectHasNextPage = (state: RootState) =>
  state.photos.results.latestPage < state.photos.results.pageCount;

export const selectFetching = (state: RootState) => state.photos.fetching;

// memoizing this would be a good improvement.
export const selectFocusedPhoto = (state: RootState) => {
  const id = state.photos.focusedPhotoId;
  return state.photos.results.photos.find((photo) => photo.id === id) ?? null;
};

export const selectIsInitial = (state: RootState) => state.photos.initial;

export default searchSlice.reducer;
