enum AppCommandEnum {
  INIT = 'init',
  UPDATE_STATS = 'updateStats',
  EVENT = 'event',
  REGISTER_KEY_HANDLER = 'register_handler',
}

enum PanelIdEnum {
  ENGINE = 'engine_panel',
}

type PanelId = `${PanelIdEnum}`;

enum KeyEventsEnum {
  KEY_DOWN = 'keydown',
  KEY_UP = 'keyup',
}

type KeyEvent = `${KeyEventsEnum}`;

type EventLog = {
  event: string;
  msg: string;
};

export type { KeyEvent, PanelId, EventLog };
export { AppCommandEnum, PanelIdEnum, KeyEventsEnum };
