import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { login as apiLogin, register as apiRegister, setAuthToken } from "../../api/authApi";

// read token from localStorage if exists
const token = localStorage.getItem("token");
if (token) setAuthToken(token);

export const register = createAsyncThunk("auth/register", async (payload, { rejectWithValue }) => {
  try {
    const res = await apiRegister(payload);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const login = createAsyncThunk("auth/login", async (payload, { rejectWithValue }) => {
  try {
    const res = await apiLogin(payload);
    // res.data => { token, fullName, email, role }
    localStorage.setItem("token", res.data.token);
    setAuthToken(res.data.token);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

const initialState = {
  token: token || null,
  user: token ? { token } : null,
  status: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      localStorage.removeItem("token");
      setAuthToken(null);
      state.token = null;
      state.user = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(register.pending, (state) => { state.status = "loading"; state.error = null; })
      .addCase(register.fulfilled, (state) => { state.status = "succeeded"; })
      .addCase(register.rejected, (state, action) => { state.status = "failed"; state.error = action.payload; })
      .addCase(login.pending, (state) => { state.status = "loading"; state.error = null; })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload.token;
        state.user = { fullName: action.payload.fullName, email: action.payload.email, role: action.payload.role };
      })
      .addCase(login.rejected, (state, action) => { state.status = "failed"; state.error = action.payload; });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
