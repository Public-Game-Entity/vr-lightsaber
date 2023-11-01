import { createSlice } from '@reduxjs/toolkit'


const initialState = {
    isGameOver: false
}

const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        setGameOver(state, action) {
            state.isGameOver = action.payload.isGameOver
        }
    }
})

export const { setGameOver } = gameSlice.actions
export default gameSlice.reducer