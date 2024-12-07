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
  setValueToField: (value: string) => void;
  retrieveLatestValue: () => Promise<string>;
  updateValueInDataverse: (value: string) => Promise<ComponentFramework.LookupValue>;
}

export const FollowUpNotes: FC<IFollowUpNotesProps> = (props: IFollowUpNotesProps) => {
  const [readOnlyValue, setReadOnlyValue] = useState<string>(props.value ?? "");
  const [inputValue, setInputValue] = useState<string | undefined>();

  useEffect(() => { setReadOnlyValue(props.value ?? "") }, [props.value]);

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

    if (props.avoidOverwrite) {
      const latestFromDb = await props.retrieveLatestValue();
      newReadOnlyValue = latestFromDb ? latestFromDb : readOnlyValue;
    }

    setReadOnlyValue(`${dayjs().format(props.dateFormat)}${inputValue}\r\n${newReadOnlyValue}`);
    setInputValue("");
  }

  useEffect(() => {
    if (props.avoidOverwrite) {
      props.updateValueInDataverse(readOnlyValue);
    } else {
      props.setValueToField(readOnlyValue);
    }
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
        rows={props.defaultRows}
        autoAdjustHeight={props.autoAdjustHeight}
        readOnly
        value={readOnlyValue} />
    </Stack >
  )
}
