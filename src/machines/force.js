import { Machine } from "xstate";

export const forceMachine = Machine(
  {
    id: "force",
    initial: "light",
    context: {},
    states: {
      light: {
        on: {
          CORRUPT: "dark",
        },
      },
      dark: {
        activities: ["theDarknessGrows"],
        on: {
          REDEEM: "light",
        },
      },
    },
  },
  {}
);
