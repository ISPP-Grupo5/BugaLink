import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type DialogBecomeDriverProps = {
  title: string;
  description: string;
  onClose: () => void;
  onCloseButton: string;
  onAccept?: (value: any) => any;
  onAcceptButton?: string;
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function DialogComponent({
  title,
  description,
  onClose,
  onCloseButton,
  onAccept,
  onAcceptButton,
  open,
  setOpen,
}: DialogBecomeDriverProps) {
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={() => setOpen(false)}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          {description}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button data-cy="Close" onClick={onClose}>{onCloseButton}</Button>
        {onAccept && onAcceptButton && (
          <Button onClick={onAccept}>{onAcceptButton}</Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
