/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import simulateNetwork from '../utils/simulateNetwork.js';
import {
  CUSTOMER_ENQUIRY_STACK_KEY,
  CUSTOMER_ENQUIRY_SUBMITTED_KEY,
  CUSTOMER_SESSION_KEY,
  getLocal,
  setLocal,
  removeLocal
} from './storageUtils.js';
import INITIAL_SWATCHES_RAW from '../data/mock-swatch.json';

/**
 * Customer Session Services
 */
export async function fetchCustomerSession() {
  await simulateNetwork();
  const session = getLocal(CUSTOMER_SESSION_KEY);
  return session || { step: 'phone', phoneNumber: '', countryCode: '+91', isAuthenticated: false };
}

export async function saveCustomerSession(sessionData) {
  await simulateNetwork();
  const current = getLocal(CUSTOMER_SESSION_KEY) || {};
  const updated = { ...current, ...sessionData };
  setLocal(CUSTOMER_SESSION_KEY, updated);
  return updated;
}

export async function requestCustomerOtp(phoneNumber, countryCode) {
  await simulateNetwork();
  const session = {
    step: 'otp',
    phoneNumber,
    countryCode,
    isAuthenticated: false,
    otpRequestedAt: Date.now()
  };
  setLocal(CUSTOMER_SESSION_KEY, session);
  return session;
}

export async function verifyCustomerOtp(otp, sessionData) {
  // Use simulated 2000ms delay for OTP verification
  await simulateNetwork(2000);
  const cleanedOtp = otp.trim().replace(/\D/g, '');

  if (cleanedOtp === '1111') {
    return { success: false, errorType: 'incorrect', message: 'Incorrect code. Try again.' };
  }
  if (cleanedOtp === '2222') {
    return { success: false, errorType: 'expired', message: 'This code has expired.' };
  }
  if (cleanedOtp === '3333') {
    return { success: false, errorType: 'network', message: 'Network unavailable' };
  }

  const updatedSession = {
    ...(sessionData || {}),
    step: 'enquiry_stack',
    isAuthenticated: true,
    loggedInAt: Date.now()
  };
  setLocal(CUSTOMER_SESSION_KEY, updatedSession);
  return { success: true, session: updatedSession };
}

export async function resendCustomerOtp(sessionData) {
  await simulateNetwork();
  const updatedSession = {
    ...(sessionData || {}),
    otpRequestedAt: Date.now()
  };
  setLocal(CUSTOMER_SESSION_KEY, updatedSession);
  return updatedSession;
}

export async function clearCustomerSession() {
  await simulateNetwork();
  removeLocal(CUSTOMER_SESSION_KEY);
  return null;
}

/**
 * Customer Enquiry Stack Services
 */
export async function fetchEnquiryStack() {
  await simulateNetwork();
  const stack = getLocal(CUSTOMER_ENQUIRY_STACK_KEY);
  return stack || [];
}

export async function saveEnquiryStack(items) {
  await simulateNetwork();
  setLocal(CUSTOMER_ENQUIRY_STACK_KEY, items);
  return items;
}

export async function addEnquiryItem(swatchToScan) {
  await simulateNetwork();
  const currentStack = getLocal(CUSTOMER_ENQUIRY_STACK_KEY) || [];
  const sourceSwatch = swatchToScan || INITIAL_SWATCHES_RAW[currentStack.length % INITIAL_SWATCHES_RAW.length];
  const newItem = {
    instanceId: `enq-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    ...sourceSwatch,
    qty: '',
    unit: sourceSwatch.unit || 'm'
  };

  const updatedStack = [newItem, ...currentStack];
  setLocal(CUSTOMER_ENQUIRY_STACK_KEY, updatedStack);
  return updatedStack;
}

export async function updateEnquiryItemQty(instanceId, qty) {
  await simulateNetwork();
  const currentStack = getLocal(CUSTOMER_ENQUIRY_STACK_KEY) || [];
  const cleanVal = qty.replace(/\D/g, '');
  const updatedStack = currentStack.map((item) =>
    item.instanceId === instanceId ? { ...item, qty: cleanVal } : item
  );
  setLocal(CUSTOMER_ENQUIRY_STACK_KEY, updatedStack);
  return updatedStack;
}

export async function deleteEnquiryItem(instanceId) {
  await simulateNetwork();
  const currentStack = getLocal(CUSTOMER_ENQUIRY_STACK_KEY) || [];
  const updatedStack = currentStack.filter((item) => item.instanceId !== instanceId);
  setLocal(CUSTOMER_ENQUIRY_STACK_KEY, updatedStack);
  return updatedStack;
}

export async function submitCustomerEnquiry(items) {
  await simulateNetwork();
  const currentStack = items || getLocal(CUSTOMER_ENQUIRY_STACK_KEY) || [];
  setLocal(CUSTOMER_ENQUIRY_SUBMITTED_KEY, {
    submittedAt: Date.now(),
    items: currentStack
  });
  return true;
}

export async function fetchEnquirySubmittedState() {
  await simulateNetwork();
  const data = getLocal(CUSTOMER_ENQUIRY_SUBMITTED_KEY);
  return !!data;
}

export async function startNewCustomerEnquiry() {
  await simulateNetwork();
  removeLocal(CUSTOMER_ENQUIRY_SUBMITTED_KEY);

  const sourceSwatch = INITIAL_SWATCHES_RAW[0];
  const newItem = {
    instanceId: `enq-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    ...sourceSwatch,
    qty: '',
    unit: sourceSwatch.unit || 'm'
  };

  const newStack = [newItem];
  setLocal(CUSTOMER_ENQUIRY_STACK_KEY, newStack);
  return newStack;
}
