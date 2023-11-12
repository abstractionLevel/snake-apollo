const initiaState = {
    position: 0,
    food: 0
}

const dataReducers = (state = initiaState, action) => {
    switch (action.type) {
        case 'UPDATE_POSITION':
            return { ...state, position: action.payload };
        case 'UPDATE_FOOD':
            return { ...state, position: action.payload }
        default:
            return state;
    }
};

export default dataReducers;