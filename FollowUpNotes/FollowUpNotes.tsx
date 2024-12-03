import { PrimaryButton, Stack, TextField } from '@fluentui/react';
import * as dayjs from 'dayjs';
import { FC, useEffect, useState } from 'react';
import * as React from 'react';

export interface IFollowUpNotesProps {
  value?: string;
  setValue: (value: string) => void;
  dateFormat: string;
  autoAdjustHeight: boolean;
  defaultRows: number;
}

export const FollowUpNotes: FC<IFollowUpNotesProps> = ({ value, setValue, dateFormat, defaultRows, autoAdjustHeight }) => {
  const [readOnlyValue, setReadOnlyValue] = useState<string>(value ?? "");
  const [inputValue, setInputValue] = useState<string | undefined>();

  const onInputChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
    event.preventDefault();
    setInputValue(newValue);
  }

  const onSendButtonClick = () => internalSendingHandler();

  const onEnterPress = (e: React.KeyboardEvent<HTMLInputElement>) => (e.key === 'Enter') && internalSendingHandler();

  const internalSendingHandler = () => {
    if (!inputValue)
      return;

    setReadOnlyValue(`${dayjs().format(dateFormat)}${inputValue}\r\n${readOnlyValue}`);
    setInputValue("");
  }

  useEffect(() => {
    setValue(readOnlyValue);
  }, [readOnlyValue]);

  return (
    <Stack className="w-full h-full">
      <Stack horizontal className='h-full'>
        <TextField className="w-full !mr-3 h-full" value={inputValue} onChange={onInputChange} onKeyUp={onEnterPress} />
        <PrimaryButton onClick={onSendButtonClick}>Send</PrimaryButton>
      </Stack>
      <TextField
        className='!mt-3'
        multiline
        rows={defaultRows}
        autoAdjustHeight={autoAdjustHeight}
        readOnly
        value={readOnlyValue} />
    </Stack >
  )
}
