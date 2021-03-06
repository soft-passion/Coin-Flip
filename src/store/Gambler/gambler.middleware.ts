import { Middleware } from "redux";
import {
  fetchAddress,
  fetchGambler,
  fetchGamblerFromCasino,
} from "./gambler.slice";
import { RootState } from "../utils";
import { getGamblerAddress, getUserAddress } from "./gambler.selector";
import { fetchGameByAddress } from "../Game/game.slice";
import { Game } from "../Game/game.models";
import { isGamblerWinner } from "../../shared/utils";

export const gamblerMiddleware: Middleware = (store) => {
  return (next) => {
    return async (action) => {
      await next(action);

      if (action.type === fetchAddress.fulfilled.type) {
        const state = store.getState() as RootState;
        const userAddress = getUserAddress(state) as string;
        store.dispatch(
          fetchGamblerFromCasino(userAddress) as any
        );
      }
      if (action.type === fetchGameByAddress.fulfilled.type) {
        const state = store.getState() as RootState;
        const gamblerAddress = getGamblerAddress(state);
        const game = action.payload as Game;
        if (gamblerAddress && isGamblerWinner(game, gamblerAddress)) {
          store.dispatch(fetchGambler(gamblerAddress) as any);
        }
      }
    };
  };
};
