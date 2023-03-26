import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Link from 'next/link';
import { useState } from 'react';

type Params = {
  text: string;
  className?: string;
  Option1: string;
  Option2: string;
  isLink: boolean;
  linkOption1?: string;
  linkOption2?: string;
};

export default function OptionButton({
  text,
  className,
  Option1,
  Option2,
  isLink,
  linkOption1,
  linkOption2,
}: Params) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <span className={`${className}`}>
      <button
        className="w-full rounded-3xl bg-turquoise py-4 px-8 text-center text-xl text-white"
        onClick={handleClick}
      >
        {text}
      </button>
      <Menu
        transformOrigin={{ horizontal: 'center', vertical: 'bottom' }}
        anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {isLink === true && (
          <span>
            <Link href={linkOption1}>
              <MenuItem onClick={handleClose}>{Option1}</MenuItem>
            </Link>
            <Link href={linkOption2}>
              <MenuItem onClick={handleClose}>{Option2}</MenuItem>
            </Link>
          </span>
        )}
        {isLink === false && (
          <span>
            <MenuItem onClick={handleClose}>{Option1}</MenuItem>
            <MenuItem onClick={handleClose}>{Option2}</MenuItem>
          </span>
        )}
      </Menu>
    </span>
  );
}
