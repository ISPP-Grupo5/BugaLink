import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

type props = {
  label: string;
  options: { value: string; label: string }[];
  selectedOption?: string;
  setSelectedOption?: (value: string) => void;
};

// Adapted from https://tailwind-elements.com/docs/standard/forms/select/
export default function SelectField({
  label,
  options,
  selectedOption,
  setSelectedOption,
}: props) {
  return (
    <FormControl fullWidth>
      <InputLabel
        id="demo-simple-select-label"
        sx={{
          fontFamily: 'Lato, sans-serif',
          color: '#000',
          '&.Mui-focused': {
            color: '#38a3a5',
          },
        }}
      >
        {label}
      </InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={selectedOption}
        label={label}
        onChange={(e) => setSelectedOption(e.target.value)}
        sx={{
          fontFamily: 'Lato, sans-serif',
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#7cc3c4',
          },
        }}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
