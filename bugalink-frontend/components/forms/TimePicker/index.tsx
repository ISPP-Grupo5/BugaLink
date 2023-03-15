type Params = {
  time: string;
  setTime: (value: string) => void;
};

export default function TimePicker({ time, setTime }: Params) {
  return (
    <input
      type="time"
      name={'pick-time'}
      value={time}
      className="w-min rounded-md bg-base-origin px-3 py-1"
      onChange={(e) => setTime(e.target.value)}
    />
  );
}
