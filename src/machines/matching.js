import { Machine, assign } from "xstate";

export const matchingMachine = Machine(
  {
    id: "matching",
    initial: "quiz",
    context: {
      topSelectedItem: undefined,
      bottomSelectedItem: undefined,
    },
    states: {
      quiz: {
        initial: "answering",
        states: {
          answering: {
            type: "parallel",
            on: {
              CONTINUE: {
                target: "verifying",
              },
            },
            states: {
              topList: {
                initial: "unselected",
                states: {
                  unselected: {
                    on: {
                      SELECT_TOP: {
                        target: "selected",
                        actions: ["setTopSelectedItem"],
                      },
                    },
                  },
                  selected: {
                    on: {
                      SELECT_TOP: {
                        target: "selected",
                        actions: ["setTopSelectedItem"],
                      },
                    },
                    type: "final",
                  },
                },
              },
              bottomList: {
                initial: "unselected",
                states: {
                  unselected: {
                    on: {
                      SELECT_BOTTOM: {
                        target: "selected",
                        actions: ["setBottomSelectedItem"],
                      },
                    },
                  },
                  selected: {
                    on: {
                      SELECT_BOTTOM: {
                        target: "selected",
                        actions: ["setBottomSelectedItem"],
                      },
                    },
                    type: "final",
                  },
                },
              },
              hist: {
                type: "history",
                history: "deep",
              },
            },
          },
          verifying: {
            on: {
              CHANGE_ANSWERS: "answering.hist",
              SUBMIT: "#submitted",
            },
          },
        },
      },
      submitted: {
        id: "submitted",
        initial: "evaluating",
        on: {
          RESET: { target: "quiz", actions: ["clearSelection"] },
        },
        states: {
          evaluating: {
            on: {
              "": [
                { target: "correct", cond: "isCorrect" },
                { target: "incorrect" },
              ],
            },
          },
          correct: {},
          incorrect: {},
        },
      },
    },
  },
  {
    actions: {
      setTopSelectedItem: assign((ctx, event) => ({
        topSelectedItem: event.selectedItem,
      })),
      setBottomSelectedItem: assign((ctx, event) => ({
        bottomSelectedItem: event.selectedItem,
      })),
      clearSelection: assign((ctx, event) => ({
        topSelectedItem: undefined,
        bottomSelectedItem: undefined,
      })),
    },
  }
);
