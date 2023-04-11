type Params = {
  time: string;
  setTime: (value: string) => void;
  name?: string;
  error?: string;
};

export default function TimePicker({ time, setTime, name, error }: Params) {
  return (
    <div className="relative">
      <input
        type="time"
        name={name}
        value={time}
        className={`w-min rounded-md bg-base-origin px-3 py-1 ${
          error ? 'text-red outline-red focus:outline-red' : ''
        }`}
        onChange={(e) => setTime(e.target.value)}
      />
    </div>
  );
}
