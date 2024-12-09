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
  editable: boolean;
  isRecordCreated: boolean;
  setValueToField: (value: string) => void;
  retrieveLatestValue: () => Promise<string>;
  updateValueInDataverse: (value: string) => Promise<ComponentFramework.LookupValue>;
}

export const FollowUpNotes: FC<IFollowUpNotesProps> = (props: IFollowUpNotesProps) => {
  const [readOnlyValue, setReadOnlyValue] = useState<string>(props.value ?? "");
  const [inputValue, setInputValue] = useState<string | undefined>();
  const [isEditable, setIsEditable] = useState<boolean>();

  useEffect(() => { setIsEditable(props.editable) }, [props.editable]);
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

    let newReadOnlyValue = (props.avoidOverwrite && props.isRecordCreated) ? await props.retrieveLatestValue() : readOnlyValue;

    newReadOnlyValue = `${dayjs().format(props.dateFormat)}${inputValue}\r\n${newReadOnlyValue}`;

    if (props.avoidOverwrite && props.isRecordCreated) {
      props.updateValueInDataverse(newReadOnlyValue);
    } else {
      props.setValueToField(newReadOnlyValue);
    }

    setReadOnlyValue(newReadOnlyValue);
    setInputValue("");
  }

  return (
    <Stack className="w-full h-full">
      {isEditable &&
        <Stack horizontal className='h-full'>
          <TextField className="w-full !mr-3 h-full" value={inputValue} onChange={onInputChange} onKeyUp={onEnterPress} />
          <PrimaryButton onClick={onSendButtonClick}>Send</PrimaryButton>
        </Stack>}
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
