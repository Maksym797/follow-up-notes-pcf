import { IFollowUpNotesProps, FollowUpNotes as Control } from "./FollowUpNotes";
import { IInputs, IOutputs } from "./generated/ManifestTypes";
import * as React from "react";

export class FollowUpNotes
  implements ComponentFramework.ReactControl<IInputs, IOutputs>
{
  private theComponent: ComponentFramework.ReactControl<IInputs, IOutputs>;
  private notifyOutputChanged: () => void;
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
    this._value = context.parameters.sampleProperty.raw as string;
    const props: IFollowUpNotesProps = {
      value: this._value,
      setValue: this.setValue.bind(this),
    };
    return React.createElement(Control, props);
  }

  setValue(value: string) {
    this._value = value;
    this.notifyOutputChanged();
  }
  
  public getOutputs(): IOutputs {
    return {
      sampleProperty: this._value,
    };
  }

  public destroy(): void {}
}
