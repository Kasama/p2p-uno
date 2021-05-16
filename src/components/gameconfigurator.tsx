import _, { toInteger } from "lodash";
import { useEffect, useState } from "react";
import { GameConfig } from "../game/types";

type Props = {
  setGameConfig: (config: GameConfig) => void;
  readOnly: boolean;
};

type ConfigEntry = (
  | {
      type: "number";
      default: number;
    }
  | {
      type: "string";
      default: string;
    }
  | {
      type: "boolean";
      default: boolean;
    }
) & { description: string };

export const GameConfigurator = ({ readOnly, setGameConfig }: Props) => {
  const [locked, setLocked] = useState(false);
  const [submited, setSubmited] = useState(false);
  const [configs, setConfigs] = useState<{ [configName: string]: ConfigEntry }>(
    {
      numDecks: {
        type: "number",
        default: 1,
        description: "Number of UNO decks to use",
      },
      startingHandSize: {
        type: "number",
        default: 7,
        description: "Number of cards in the starting hand",
      },
      maxDraws: {
        type: "number",
        default: 1,
        description:
          "Amount of card draws one can make before skipping their turn. 0 for infinite",
      },
      plusTwosStackWithFours: {
        type: "boolean",
        default: false,
        description: "Wether a +2 be stacked with a +4 and vice-versa",
      },
      plusTwoSkip: {
        type: "boolean",
        default: false,
        description: "Wether playing a +2 will skip the victim's turn",
      },
      plusFourSkip: {
        type: "boolean",
        default: true,
        description: "Wether playing a +4 will skip the victim's turn",
      },
      unoPenalty: {
        type: "number",
        default: 5,
        description:
          "The amount of cards used to penalize who doesn't call UNO on time",
      },
      jumpIn: {
        type: "boolean",
        default: false,
        description:
          "Wether a player can jump in front of other when they have the exact same card that is in the pile",
      },
    }
  );

  useEffect(() => {
    setLocked(readOnly || submited);
  }, [readOnly, submited]);

  const DynamicInput = ({
    config,
    locked,
    value,
    onChange,
  }: {
    config: ConfigEntry;
    locked: boolean;
    value: string | number | boolean;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
  }) => {
    switch (config.type) {
      case "boolean":
        return (
          <input
            disabled={locked}
            type="checkbox"
            checked={value as boolean}
            onChange={onChange}
          />
        );
      case "number":
        return (
          <input
            disabled={locked}
            type="number"
            value={value as number}
            onChange={onChange}
          />
        );
      case "string":
        return (
          <input
            disabled={locked}
            type="text"
            value={value as string}
            onChange={onChange}
          />
        );
    }
  };

  return (
    <div>
      {Object.keys(configs).map((configName) => {
        const config = configs[configName];
        return (
          <div key={configName}>
            <span>{config.description}</span>
            <DynamicInput
              locked={locked}
              config={config}
              value={config.default}
              onChange={(e) => {
                if (config.type === "string") {
                  setConfigs((configs) => ({
                    ...configs,
                    [configName]: {
                      ...config,
                      default: e.target.value,
                    },
                  }));
                } else if (config.type === "number") {
                  setConfigs((configs) => ({
                    ...configs,
                    [configName]: {
                      ...config,
                      default: toInteger(e.target.value),
                    },
                  }));
                } else {
                  setConfigs((configs) => ({
                    ...configs,
                    [configName]: {
                      ...config,
                      default: e.target.checked,
                    },
                  }));
                }
              }}
            />
          </div>
        );
      })}
      <button
        onClick={() => {
          setSubmited(true);
          setGameConfig(
            _.fromPairs(
              Object.keys(configs).map((k) => [k, configs[k].default])
            )
          );
        }}
      >
        Save
      </button>
    </div>
  );
};
