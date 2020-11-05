import { Machine, assign } from "xstate";

export const fetchMachine = Machine(
  {
    id: "fetch",
    initial: "idle",
    context: {
      results: [],
      message: "",
    },
    states: {
      idle: {
        on: {
          FETCH: "pending",
        },
      },
      pending: {
        invoke: {
          src: "fetchData",
          onDone: { target: "successful", actions: ["setResults"] },
          onError: { target: "failed", actions: ["setMessage"] },
        },
      },
      failed: {
        on: {
          FETCH: "pending",
        },
      },
      successful: {
        initial: "unknown",
        on: {
          FETCH: "pending",
        },
        states: {
          unknown: {
            on: {
              "": [
                {
                  target: "withData",
                  cond: "hasData",
                },
                { target: "withoutData" },
              ],
            },
          },
          withData: {},
          withoutData: {},
        },
      },
    },
  },
  {
    actions: {
      setResults: assign((ctx, event) => ({
        results: event.data,
      })),
      setMessage: assign((ctx, event) => ({
        message: event.data,
      })),
    },
    guards: {
      hasData: (ctx, event) => {
        return ctx.results && ctx.results.length > 0;
      },
    },
  }
);
