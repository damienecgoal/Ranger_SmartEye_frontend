// action - state management
import { REGISTER, LOGIN, LOGOUT /* optionally REFRESH */ } from './actions';

// types
import { AuthProps, AuthActionProps } from 'types/auth';

// initial state
const initialState: AuthProps = {
  isLoggedIn: false,
  isInitialized: false,
  user: null,
  token: null,
  timeout: null,
  tokenExpiry: null
};

// ==============================|| AUTH REDUCER ||============================== //

const auth = (state = initialState, action: AuthActionProps): AuthProps => {
  switch (action.type) {
    case REGISTER: {
      const { user } = action.payload || {};
      return {
        ...state,
        user
      };
    }

    case LOGIN: {
      const { user, token, timeout, tokenExpiry } = action.payload || {};
      // console.log('Auth Reducer - LOGIN action payload:',{
      //   ...state,
      //   isLoggedIn: true,
      //   isInitialized: true,
      //   user,
      //   token,
      //   timeout,
      //   tokenExpiry
      // });
      return {
        ...state,
        isLoggedIn: true,
        isInitialized: true,
        user: user || null,
        token,
        timeout,
        tokenExpiry
      };
    }

    // Optional: add a REFRESH action if you prefer not to reuse LOGIN
    // case REFRESH: {
    //   const { token, timeout, tokenExpiry } = action.payload || {};
    //   return {
    //     ...state,
    //     token,
    //     timeout,
    //     tokenExpiry
    //   };
    // }

    case LOGOUT: {
      return {
        ...state,
        isInitialized: true,
        isLoggedIn: false,
        user: null,
        token: null,
        timeout: null,
        tokenExpiry: null
      };
    }

    default: {
      return state;
    }
  }
};

export default auth;
