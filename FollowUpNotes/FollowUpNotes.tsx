import { PrimaryButton, Stack, TextField } from '@fluentui/react';
import * as dayjs from 'dayjs';
import { FC, useEffect, useState } from 'react';
import * as React from 'react';

export interface IFollowUpNotesProps {
  value?: string;
  dateFormat: string;
  autoAdjustHeight: boolean;
  defaultRows: number;
  avoidOverwrite: boolean;
  setValue: (value: string) => void;
  getLatestValue: () => Promise<string>;
}

export const FollowUpNotes: FC<IFollowUpNotesProps> = ({ value, setValue, dateFormat, defaultRows, autoAdjustHeight, avoidOverwrite, getLatestValue }) => {
  const [readOnlyValue, setReadOnlyValue] = useState<string>(value ?? "");
  const [inputValue, setInputValue] = useState<string | undefined>();

  useEffect(() => { setReadOnlyValue(value ?? "") }, [value]);

  const onInputChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
    event.preventDefault();
    setInputValue(newValue);
  }

  const onSendButtonClick = () => internalSendingHandler();

  const onEnterPress = (e: React.KeyboardEvent<HTMLInputElement>) => (e.key === 'Enter') && internalSendingHandler();

  const internalSendingHandler = async () => {
    if (!inputValue)
      return;

    let newReadOnlyValue = readOnlyValue;

    if (avoidOverwrite) {
      const latestFromDb = await getLatestValue();
      newReadOnlyValue = latestFromDb ? latestFromDb : readOnlyValue;
    }

    setReadOnlyValue(`${dayjs().format(dateFormat)}${inputValue}\r\n${newReadOnlyValue}`);
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
