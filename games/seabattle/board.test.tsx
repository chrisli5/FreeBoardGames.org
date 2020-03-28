import React from 'react';
import { Board } from './board';
import { expect } from 'chai';
import { SeabattleGame } from './game';
import { Client } from 'boardgame.io/client';
import { Client as ReactClient } from 'boardgame.io/react';

import { GameMode } from 'components/App/Game/GameModePicker';

import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

test('set ships', () => {
  const App = ReactClient({
    game: SeabattleGame,
    debug: false,
    board: Board,
  }) as any;
  const comp = Enzyme.mount(<App playerID={'0'} gameID={'foo'} />);
  comp
    .find('button')
    .at(1)
    .simulate('click');
  expect(comp.html()).to.contain('Waiting');
});

test('start', () => {
  const client = Client({
    game: SeabattleGame,
  });
  const state0 = client.store.getState();
  const comp = Enzyme.mount(
    <Board
      G={state0.G}
      ctx={state0.ctx}
      moves={client.moves}
      playerID={'0'}
      isActive={true}
      isConnected={true}
      gameArgs={{
        gameCode: 'seabattle',
        mode: GameMode.LocalFriend,
      }}
    />,
  );
  // First page must have some ships
  expect(comp.find('ShipsPlacement').length).toEqual(1);
  comp
    .find('button')
    .at(1)
    .simulate('click');
});

test('waiting opponent', () => {
  const client = Client({
    game: SeabattleGame,
  });
  const state0 = client.store.getState();
  const state1 = { ...state0, ctx: { ...state0.ctx, actionPlayers: ['1'] } };
  const comp = Enzyme.mount(
    <Board
      G={state1.G}
      ctx={state1.ctx}
      moves={client.moves}
      playerID={'0'}
      isActive={true}
      isConnected={true}
      gameArgs={{
        gameCode: 'seabattle',
        mode: GameMode.LocalFriend,
      }}
    />,
  );
  // First page must have some ships
  expect(comp.html()).to.contain('Waiting');
});

test('gameover - won', () => {
  const client = Client({
    game: SeabattleGame,
  });
  const state0 = client.store.getState();
  const state1 = { ...state0, ctx: { ...state0.ctx, gameover: { winner: '0' } } };
  const comp = Enzyme.mount(
    <Board
      G={state1.G}
      ctx={state1.ctx}
      moves={client.moves}
      playerID={'0'}
      isActive={true}
      isConnected={true}
      gameArgs={{
        gameCode: 'seabattle',
        mode: GameMode.LocalFriend,
      }}
    />,
  );
  // First page must have some ships
  expect(comp.html()).to.contain('won');
});

test('gameover - lost', () => {
  const client = Client({
    game: SeabattleGame,
  });
  const state0 = client.store.getState();
  const state1 = { ...state0, ctx: { ...state0.ctx, gameover: { winner: '1' } } };
  const comp = Enzyme.mount(
    <Board
      G={state1.G}
      ctx={state1.ctx}
      moves={client.moves}
      playerID={'0'}
      isActive={true}
      isConnected={true}
      gameArgs={{
        gameCode: 'seabattle',
        mode: GameMode.LocalFriend,
      }}
    />,
  );
  // First page must have some ships
  expect(comp.html()).to.contain('lost');
});

test('battle', () => {
  const client = Client({
    game: SeabattleGame,
  });
  const state0 = client.store.getState();
  const state1 = { ...state0, ctx: { ...state0.ctx, phase: 'play' } };
  const comp = Enzyme.mount(
    <Board
      G={state1.G}
      ctx={state1.ctx}
      moves={client.moves}
      playerID={'0'}
      isActive={true}
      isConnected={true}
      gameArgs={{
        gameCode: 'seabattle',
        mode: GameMode.LocalFriend,
      }}
    />,
  );
  // First page must have some ships
  expect(comp.find('Battle').length).toEqual(1);
});
