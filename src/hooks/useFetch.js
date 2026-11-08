import { useEffect, useReducer } from "react";

const initialState = { loading: true, error: null, data: null };

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_START":
      return { loading: true, error: null, data: null };
    case "FETCH_SUCCESS":
      return { loading: false, error: null, data: action.payload };
    case "FETCH_ERROR":
      return { loading: false, error: action.payload, data: null };
    default:
      return state;
  }
}

/**
 * fetcher: (signal) => Promise
 * deps: values the fetcher depends on (e.g. [id])
 * Each component calling this hook gets its OWN state.
 */
export function useFetch(fetcher, deps) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const controller = new AbortController();
    dispatch({ type: "FETCH_START" });

    fetcher(controller.signal)
      .then((data) => dispatch({ type: "FETCH_SUCCESS", payload: data }))
      .catch((err) => {
        if (err.name === "AbortError") return; // cancelled, ignore
        dispatch({ type: "FETCH_ERROR", payload: err });
      });

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
