import { PrimaryButton, Stack, TextField } from '@fluentui/react';
import { FC, useEffect, useState } from 'react';
import * as React from 'react';

export interface IFollowUpNotesProps {
  value?: string;
  setValue: (value: string) => void;
}

export const FollowUpNotes: FC<IFollowUpNotesProps> = ({ value, setValue }) => {
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

    const date = `${new Date().getMonth() + 1}/${new Date().getDate()}/${new Date().getFullYear()}`;

    setReadOnlyValue(`${date}: ${inputValue}\r\n${readOnlyValue}`);
    setInputValue("");
  }

  useEffect(() => {
    setValue(readOnlyValue);
  }, [readOnlyValue]);

  return (
    <Stack className="w-full">
      <Stack horizontal>
        <TextField className="w-full !mr-3" value={inputValue} onChange={onInputChange} onKeyUp={onEnterPress} />
        <PrimaryButton onClick={onSendButtonClick}>Send</PrimaryButton>
      </Stack>
      <TextField className='!mt-3' multiline rows={3} readOnly value={readOnlyValue} />
    </Stack >
  )
}
