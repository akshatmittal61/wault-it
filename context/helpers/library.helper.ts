import { LibraryApi } from "@/api";
import { ICreateArtifact, IUpdateArtifact } from "@/types";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAllServices = createAsyncThunk(
	"library/getAllServices",
	async (_, thunkApi) => {
		try {
			const res = await LibraryApi.getAllServices();
			return Promise.resolve(res.data);
		} catch (error: any) {
			return thunkApi.rejectWithValue(error.response.data);
		}
	}
);

export const getArtifactsForService = createAsyncThunk(
	"library/getArtifactsForService",
	async (service: string, thunkApi) => {
		try {
			const res = await LibraryApi.getArtifactsForService(service);
			return Promise.resolve(res.data);
		} catch (error: any) {
			return thunkApi.rejectWithValue(error.response.data);
		}
	}
);

export const createArtifact = createAsyncThunk(
	"library/createArtifact",
	async (artifact: ICreateArtifact, thunkApi) => {
		try {
			const res = await LibraryApi.createArtifact(artifact);
			return Promise.resolve(res.data);
		} catch (error: any) {
			return thunkApi.rejectWithValue(error.response.data);
		}
	}
);

export const updateArtifact = createAsyncThunk(
	"library/updateArtifact",
	async ({ id, data }: { id: string; data: IUpdateArtifact }, thunkApi) => {
		try {
			const res = await LibraryApi.updateArtifact(id, data);
			return Promise.resolve(res.data);
		} catch (error: any) {
			return thunkApi.rejectWithValue(error.response.data);
		}
	}
);

export const deleteArtifact = createAsyncThunk(
	"library/deleteArtifact",
	async (id: string, thunkApi) => {
		try {
			const res = await LibraryApi.deleteArtifact(id);
			return Promise.resolve(res.data);
		} catch (error: any) {
			return thunkApi.rejectWithValue(error.response.data);
		}
	}
);

export const searchForServices = createAsyncThunk(
	"library/searchForServices",
	async (query: string, thunkApi) => {
		try {
			const res = await LibraryApi.searchForServices(query);
			return Promise.resolve(res.data);
		} catch (error: any) {
			return thunkApi.rejectWithValue(error.response.data);
		}
	}
);
