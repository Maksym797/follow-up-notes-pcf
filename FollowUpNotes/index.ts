/* eslint-disable @typescript-eslint/no-explicit-any */
import { IFollowUpNotesProps, FollowUpNotes as Control } from "./FollowUpNotes";
import { IInputs, IOutputs } from "./generated/ManifestTypes";
import * as React from "react";
import { Repository } from "./repository";

export class FollowUpNotes
  implements ComponentFramework.ReactControl<IInputs, IOutputs>
{
  private notifyOutputChanged: () => void;
  private repository: Repository;
  private _value: string;
  constructor() {}

  public init(
    context: ComponentFramework.Context<IInputs>,
    notifyOutputChanged: () => void,
    state: ComponentFramework.Dictionary
  ): void {
    this.notifyOutputChanged = notifyOutputChanged;
  }

  public updateView(
    context: ComponentFramework.Context<IInputs>
  ): React.ReactElement {
    this._value = context.parameters.FollowUpNotes.raw as string;
    const dayjsFormat = context.parameters.DayjsFormat.raw || 'MM/DD/YYYY: ';
    const autoAdjustHeight = context.parameters.AutoAdjustHeight.raw;
    const defaultRows = context.parameters.DefaultRowsCount.raw || 5;
    const avoidOverwrite = context.parameters.AvoidOverwrite.raw;
    const fieldName = context.parameters.FollowUpNotes.attributes?.LogicalName || '';
    const entityName = (context as any).page?.entityTypeName;
    const entityId = (context as any).page?.entityId;
    const isEditable = !context.mode.isControlDisabled;

    this.repository = new Repository(context.webAPI);

    const props: IFollowUpNotesProps = {
      value: this._value,
      dateFormat: dayjsFormat,
      setValueToField: this.setValue.bind(this),
      autoAdjustHeight: autoAdjustHeight,
      isRecordCreated: !!entityId,
      defaultRows: defaultRows,
      avoidOverwrite: avoidOverwrite,
      retrieveLatestValue: async () => this.repository.getLatestValue(entityName, entityId, fieldName),
      updateValueInDataverse: async (value: string) => this.repository.updateValue(entityName, entityId, fieldName, value),
      editable: isEditable,
    };

    return React.createElement(Control, props);
  }

  setValue(value: string) {
    this._value = value;
    this.notifyOutputChanged();
  }
  
  public getOutputs(): IOutputs {
    return {
      FollowUpNotes: this._value,
    };
  }

  public destroy(): void {}
}
