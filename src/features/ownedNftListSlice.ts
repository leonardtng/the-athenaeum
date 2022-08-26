import { createAsyncThunk, createSlice, Slice } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../app/store";
import { OwnedNftsList, OwnedNftsListState } from "../models";
import { cacheWithExpiry, retrieveCache, toCamelCase } from "../utils/helpers";

const initialState: OwnedNftsListState = {
  value: null,
  status: "IDLE",
};

export const fetchOwnedNftsList = createAsyncThunk(
  "ownedNftsList",
  async (ownerAddr: string) => {
    const canceler = axios.CancelToken.source();

    const cachedData: OwnedNftsList | null = retrieveCache(ownerAddr);

    const apiKey = process.env.REACT_APP_ALCHEMY_KEY;
    const url = `${apiKey}/getNFTs?owner=${ownerAddr}`;

    if (cachedData) {
      return cachedData as OwnedNftsList;
    } else {
      const response = await axios.request({
        responseType: "json",
        method: "GET",
        baseURL: "https://eth-mainnet.alchemyapi.io/nft/v2/",
        url: url,
        cancelToken: canceler.token,
      });

      const normalizedResponse = toCamelCase(response.data) as OwnedNftsList;
      cacheWithExpiry(ownerAddr, normalizedResponse, 10e11); // Cache Period: 10 minutes

      return normalizedResponse as OwnedNftsList;
    }
  }
);

export const selectOwnedNftsList: (state: RootState) => OwnedNftsListState = (
  state: RootState
) => state.ownedNftsList;

const ownedNftsListSlice: Slice<OwnedNftsListState, {}, "ownedNftsList"> =
  createSlice({
    name: "ownedNftsList",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchOwnedNftsList.pending, (state) => {
          state.status = "LOADING";
        })
        .addCase(fetchOwnedNftsList.fulfilled, (state, action) => {
          state.status = "IDLE";
          state.value = action.payload;
        })
        .addCase(fetchOwnedNftsList.rejected, (state, action) => {
          state.status = "FAILED";
          state.error = action.error.message;
        });
    },
  });

export default ownedNftsListSlice.reducer;
