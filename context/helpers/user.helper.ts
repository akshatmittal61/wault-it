import { UserApi } from "@/api";
import { IUpdateUser } from "@/types";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const updateProfile = createAsyncThunk(
	"user/updateProfile",
	async (body: IUpdateUser, thunkApi) => {
		try {
			const res = await UserApi.updateProfile(body);
			return Promise.resolve(res.data);
		} catch (error: any) {
			return thunkApi.rejectWithValue(error.response.data);
		}
	}
);
