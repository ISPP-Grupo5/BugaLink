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
      className="bg-baseOrigin rounded-md px-3 py-1 w-min"
      onChange={(e) => setTime(e.target.value)}
    />
  );
}
