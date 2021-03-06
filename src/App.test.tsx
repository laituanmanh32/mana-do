import React, { useReducer } from 'react';
import { render } from '@testing-library/react';
import App from './App';
import { unmountComponentAtNode } from 'react-dom';
import { Router } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import { createMemoryHistory } from 'history'
import reducer, { initialState } from './store/reducer';
import { setProfile, setTodos } from './store/actions';
import { TodoStatus } from './models/todo';
import { renderHook } from '@testing-library/react-hooks';
import { UserProfile } from './models/profile';

let container: any = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("should redirect to LoginPage if access TodoPage without authorized", () => {
  const history = createMemoryHistory();
  history?.push('/todo');

  act(() => {
    localStorage.clear();
    render(<Router history={history}>
      <App />
    </Router>, container);
  });
  expect(window.location.pathname).toBe('/')
})

it("should have todos in state after dispatch setTodos action with todos data", () => {
  const mockTodos = [{
    id: '1',
    user_id: 'fistUser',
    content : 'Task 1',
    status: TodoStatus.ACTIVE,
    created_date: '2021-03-03'
  }];

  const {result} = renderHook(() => useReducer(reducer, initialState));
  const [_, dispatch] = result.current
  act(() => {
    dispatch(setTodos(mockTodos));
  });
  expect(result.current[0].todos).toEqual(mockTodos)

})

it("should have profile in state after dispatch setProfile action with profile data", () => {
  const mockProfile: UserProfile = {
    maximum_task_perday: 10
  };

  const {result} = renderHook(() => useReducer(reducer, initialState));
  const [_, dispatch] = result.current
  act(() => {
    dispatch(setProfile(mockProfile));
  });
  expect(result.current[0].profile).toEqual(mockProfile)

})