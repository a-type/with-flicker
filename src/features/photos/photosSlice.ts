import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../app/store';

export type PhotoData = {
  id: string;
  owner: string;
  secret: string;
  server: string;
  title: string;
  farm: number;
};

interface SearchState {
  filter: string;
  results: {
    photos: PhotoData[];
    latestPage: number;
    pageCount: number;
  };
}

const initialState: SearchState = {
  filter: '',
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
    beginSearch: (state, action: PayloadAction<{ value: string }>) => {
      state.filter = action.payload.value;
      // since the filter has changed, reset the result cache.
      state.results = {
        photos: [],
        latestPage: 0,
        pageCount: 0,
      };
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
    },
  },
});

export const searchAsync = ({ value }: { value: string }): AppThunk => async (
  dispatch,
) => {
  // immediately update stored filter value
  dispatch(searchSlice.actions.beginSearch({ value }));

  // call Flickr API to fetch image data - gotta say, their response is a little odd.
  // nojsoncallback is required to actually return... valid JSON.
  const response = await fetch(
    `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${process.env.REACT_APP_FLICKR_API_KEY}&text=${value}&format=json&nojsoncallback=1&safe_search=1`,
  );

  const body = await response.json();

  dispatch(
    searchSlice.actions.completeSearch({
      page: body.photos.page,
      pageCount: body.photos.pages,
      photos: body.photos.photo,
    }),
  );
};

export const selectSearchFilter = (state: RootState) => state.photos.filter;

export const selectPhotos = (state: RootState) =>
  state.photos.results.photos ?? [];

export default searchSlice.reducer;
