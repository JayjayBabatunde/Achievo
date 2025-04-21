import { configureStore } from '@reduxjs/toolkit'
import goalsReducer from '../store/goalSlice'

const store = configureStore({
    reducer: {
        goals: goalsReducer,
    }
})

export default store