// import { createSlice } from "@reduxjs/toolkit";

// const goalSlice = createSlice({
//     name: "goals",
//     initialState: {
//         goals: [],
//     },
//     reducers: {
//         setGoals: (state, action) => {
//             state.goals = action.payload;
//         },
//         toggleGoalCompletion: (state, action) => {
//             const goal = state.goals.find(g => g.id === action.payload);
//             if (goal) {
//                 goal.completed = !goal.completed;
//             }
//         },
//     },
// })

// export const { setGoals, toggleGoalCompletion } = goalSlice.actions;
// export default goalSlice.reducer;