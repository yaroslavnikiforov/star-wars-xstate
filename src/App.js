import React, { useState, Fragment } from "react";
import List from "./List";
import { useMachine } from "@xstate/react";
import { fetchPeople, fetchPlanets } from "./api";
import { matchingMachine } from "./machines/matching";
import { forceMachine } from "./machines/force";

export default function App() {
  const [matchingState, sendToMatchingMachine] = useMachine(matchingMachine, {
    guards: {
      isCorrect: (ctx) => {
        return ctx.topSelectedItem.homeworld === ctx.bottomSelectedItem.url;
      },
    },
  });

  const [darkSidePower, setDarkSidePower] = useState(0);
  const [forceState, sendToForceMachine] = useMachine(forceMachine, {
    activities: {
      theDarknessGrows: (ctx) => {
        // entering dark state
        setDarkSidePower(10);
        const interval = setInterval(
          () => setDarkSidePower((power) => power + 10),
          600
        );
        return () => {
          // leaving dark state
          setDarkSidePower(0);
          clearInterval(interval);
        };
      },
    },
  });

  return (
    <div className="App">
      {matchingState.matches("quiz.answering") ? (
        <Fragment>
          <button onClick={() => sendToMatchingMachine({ type: "CONTINUE" })}>
            Continue
          </button>

          {forceState.matches("light") ? (
            <button onClick={() => sendToForceMachine({ type: "CORRUPT" })}>
              Come to the Dark Side
            </button>
          ) : (
            <button onClick={() => sendToForceMachine({ type: "REDEEM" })}>
              Go Back to the Light Side
            </button>
          )}

          <List
            fetchData={fetchPeople}
            selectedItem={matchingState.context.topSelectedItem}
            onSelection={(selectedItem) => {
              sendToMatchingMachine({ type: "SELECT_TOP", selectedItem });
            }}
            darkSidePower={darkSidePower}
          />

          <hr />

          <List
            fetchData={fetchPlanets}
            selectedItem={matchingState.context.bottomSelectedItem}
            onSelection={(selectedItem) => {
              sendToMatchingMachine({ type: "SELECT_BOTTOM", selectedItem });
            }}
            darkSidePower={darkSidePower}
          />
        </Fragment>
      ) : null}

      {matchingState.matches("quiz.verifying") ? (
        <Fragment>
          <p>
            You chose{" "}
            {matchingState.context.topSelectedItem &&
              matchingState.context.topSelectedItem.name}{" "}
            and{" "}
            {matchingState.context.bottomSelectedItem &&
              matchingState.context.bottomSelectedItem.name}
          </p>
          <button
            onClick={() => sendToMatchingMachine({ type: "CHANGE_ANSWERS" })}
          >
            Change Answers
          </button>
          <button onClick={() => sendToMatchingMachine({ type: "SUBMIT" })}>
            Submit
          </button>
        </Fragment>
      ) : null}

      {matchingState.matches("submitted.correct") ? (
        <p>The Force is strong with this one.</p>
      ) : null}

      {matchingState.matches("submitted.incorrect") ? (
        <p>Do or do not. There is no try.</p>
      ) : null}
    </div>
  );
}
