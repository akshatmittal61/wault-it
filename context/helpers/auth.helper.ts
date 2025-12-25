import { AuthApi } from "@/api";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchAuthenticatedUser = createAsyncThunk(
	"auth/fetchAuthenticatedUser",
	async (_, thunkApi) => {
		try {
			const res = await AuthApi.verifyUserIfLoggedIn();
			return Promise.resolve(res.data);
		} catch (error: any) {
			return thunkApi.rejectWithValue(error.response.data);
		}
	}
);

export const logoutUser = createAsyncThunk(
	"auth/logout",
	async (_, thunkApi) => {
		try {
			const res = await AuthApi.logout();
			return Promise.resolve(res.data);
		} catch (error: any) {
			return thunkApi.rejectWithValue(error.response.data);
		}
	}
);
