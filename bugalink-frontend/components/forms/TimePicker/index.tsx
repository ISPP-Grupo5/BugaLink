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
      className="bg-light-gray rounded-md p-1.5 w-min "
      onChange={(e) => setTime(e.target.value)}
    />
  );
}
