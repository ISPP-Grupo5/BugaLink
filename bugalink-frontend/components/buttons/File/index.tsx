import DocumentStatusI from '@/interfaces/documents';
import { axiosAuth } from '@/lib/axios';
import cn from 'classnames';
import GreenCheck from 'public/assets/green-check.svg';
import Hourglass from 'public/assets/hourglass.svg';
import Upload from 'public/assets/upload.svg';
import { ChangeEvent } from 'react';

type Params = {
  text: string;
  fileName: string;
  statusName: string;
  status: DocumentStatusI;
  setStatus: (status: DocumentStatusI) => void;
};

export default function FileButton({
  text,
  fileName,
  statusName,
  status,
  setStatus,
}: Params) {
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e?.target?.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append(fileName, file);
    try {
      const response = await axiosAuth.put(`/drivers/docs`, formData);
      if (response.status === 200) {
        const status = response?.data?.[statusName];
        setStatus(status);
      }
    } catch (error) {
      alert(error?.response?.data?.message || `Error al enviar tu ${fileName}`);
    }
  };

  return (
    <div>
      <label
        htmlFor={text}
        className={cn(
          {
            'cursor-auto border-green bg-green text-white':
              status === 'Validated',
            'border-gray text-gray': status === 'Waiting upload',
            'border-yellow bg-yellow text-white':
              status === 'Waiting validation',
            'border-red bg-red text-white': status === 'Cancelled',
          },
          'flex w-full cursor-pointer flex-row justify-between rounded-md border-2 p-1 text-left text-base'
        )}
      >
        <input
          className="hidden"
          id={text}
          type="file"
          disabled={status === 'Validated'}
          onChange={handleFileChange}
        />
        <p className="my-auto"> {text} </p>
        {status === 'Validated' && (
          <GreenCheck
            className="fill-green stroke-green"
            width="32"
            height="32"
          />
        )}
        {status === 'Waiting validation' && (
          <Hourglass className="stroke-yellow" />
        )}
        {status === 'Waiting upload' && <Upload className="" />}
      </label>
    </div>
  );
}
