import { createSlice } from '@reduxjs/toolkit'



const userSlice = createSlice({
  name: 'user',
  initialState: {
    userData: null
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload
    },

  },
})

// Action creators are generated for each case reducer function
export const { setUserData } = userSlice.actions
export default userSlice.reducer