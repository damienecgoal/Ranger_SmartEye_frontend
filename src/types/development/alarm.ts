import { Warning2, MessageText1, Notification, Setting2, Icon } from 'iconsax-reactjs';
import { ReactElement, ReactNode } from 'react';

// ==============================|| TYPES - Alarms  ||============================== //


export type Alarm = {
    key: string;
    type: number;
    status: number;
    timestamp: number;
    device_id: string;
    lat: number;
    lon: number;
    desc?: string;
    sub_device_index?: number;
    user_id?: string;
    user_name?: string;
    value?: number;
    operator_id?: string;
    operator_name?: string;
    process_desc?: string;
    process_time?: number
}

export type AlarmSeverity = {
  [key: number]: {
    label: string;
    color: string;
    icon: Icon;
  };
};

export const ALARM_SEVERITY: AlarmSeverity = {
  1: { label: 'Medium', color: 'info', icon: MessageText1 },
  2: { label: 'Medium', color: 'info', icon: MessageText1 },
  3: { label: 'Medium', color: 'info', icon: MessageText1 },
  4: { label: 'Critical', color: 'error', icon: Warning2 },
  5: { label: 'Critical', color: 'error', icon: Warning2 },
  4103: { label: 'High', color: 'warning', icon: Notification },
  4104: { label: 'High', color: 'warning', icon: Notification },
  4105: { label: 'High', color: 'warning', icon: Notification },
  4106: { label: 'High', color: 'warning', icon: Notification },
  4107: { label: 'High', color: 'warning', icon: Notification },
  4108: { label: 'High', color: 'warning', icon: Notification },
  4109: { label: 'High', color: 'warning', icon: Notification },
  4110: { label: 'High', color: 'warning', icon: Notification },
  4111: { label: 'High', color: 'warning', icon: Notification },
  4112: { label: 'High', color: 'warning', icon: Notification },
  4113: { label: 'High', color: 'warning', icon: Notification },
  4114: { label: 'High', color: 'warning', icon: Notification },
  4115: { label: 'High', color: 'warning', icon: Notification },
  4116: { label: 'High', color: 'warning', icon: Notification },
  4117: { label: 'High', color: 'warning', icon: Notification },
  4118: { label: 'High', color: 'warning', icon: Notification },
  4119: { label: 'High', color: 'warning', icon: Notification },
  4120: { label: 'High', color: 'warning', icon: Notification },
  4121: { label: 'High', color: 'warning', icon: Notification },
  4096: { label: 'High', color: 'warning', icon: Notification },
  4097: { label: 'High', color: 'warning', icon: Notification },
  4098: { label: 'High', color: 'warning', icon: Notification },
  4099: { label: 'High', color: 'warning', icon: Notification },
  4100: { label: 'Low', color: 'success', icon: Setting2 }
};