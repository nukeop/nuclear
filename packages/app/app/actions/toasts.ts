import { v4 } from 'uuid';
import { get } from 'lodash';
import { createStandardAction } from 'typesafe-actions';
import { Notification } from '@nuclear/ui/lib/types';
import { Toast } from './actionTypes';
import { Setting } from '@nuclear/core';
import React from 'react';

export const addNotification = createStandardAction(Toast.ADD_NOTIFICATION)<Notification>();

export const removeNotification = createStandardAction(Toast.REMOVE_NOTIFICATION)<string>();

export function notify(title: string, details: string, icon?:  Node | React.ReactElement<{
  src: string;
}>, settings?: Setting[] | { [key: string]: unknown }) {
  return generateNotification(title, details, icon, {}, settings);
}

export function error(title: string, details: string, icon?:  Node | React.ReactElement<{
  src: string;
}>, settings?: Setting[] | { [key: string]: unknown }) {
  return generateNotification(title, details, icon, {error: true}, settings);
}

export function warning(title: string, details: string, icon?:  Node | React.ReactElement<{
  src: string;
}>, settings?: Setting[] | { [key: string]: unknown }) {
  return generateNotification(title, details, icon, {warning: true}, settings);
}

export function success(title: string, details: string, icon?:  Node | React.ReactElement<{
  src: string;
}>, settings?: Setting[] | { [key: string]: unknown }) {
  return generateNotification(title, details, icon, {success: true}, settings);
}

export function info(title: string, details: string, icon?:  Node | React.ReactElement<{
  src: string;
}>, settings?: Setting[] | { [key: string]: unknown }) {
  return generateNotification(title, details, icon, {info: true}, settings);
}

function generateNotification(title: string, details: string, icon?:  Node | React.ReactElement<{
  src: string;
}>, type?: {[type:string]: boolean}, settings?: Setting[] | { [key: string]: unknown }) {
  return dispatch => {
    const id = v4();
    dispatch(addNotification(Object.assign({}, {
      onClick: () => {
        dispatch(removeNotification(id));
      },
      id, title, details, icon
    },
    type)));

    const timeout = get(settings, 'notificationTimeout') as number ?? 3;
    setTimeout(() => dispatch(removeNotification(id)), timeout * 1000);
  };
}
