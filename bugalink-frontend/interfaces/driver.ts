import UserI from './user';

type DriverI = {
  id: number;
  user: UserI;
  prefers_talk: boolean;
  prefers_music: boolean;
  allows_smoke: boolean;
  allows_pets: boolean;
};

export default DriverI;
