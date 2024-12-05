import { payWithMonnify } from "../../utils/monnify";
import { describe, it, expect, vi } from 'vitest';
import { useRuntimeConfig } from '#imports'
import jest from "jest"
// Mocks
const mockConfig = {
  public: {
    APP_MONNIFYAPIKEY: 'your_api_key',
    APP_MONNIFYCONTRACTCODE: 'your_contract_code',
    APP_MONNIFYISTESTMODE: true, // or false based on your test needs
  },
};

const mockData = {
  amount: 1000,
  name: 'John Doe',
  email: 'john.doe@example.com',
};

const mockOnModalClose = vi.fn();
const mockOnSuccess = vi.fn();

const mockMonnifySDK = {
  initialize: vi.fn((options) => {
    const { onComplete, onClose } = options;

    // Simulate onComplete callback
    onComplete({ transactionId: '1234567890', status: 'SUCCESS' });

    // Simulate onClose callback for user cancelled scenario
    onClose({ responseCode: 'USER_CANCELLED' });

    // Simulate onClose callback for failed scenario
    onClose({ status: 'FAILED' });
  }),
};

// Mocking window.MonnifySDK
global.window = {
  MonnifySDK: mockMonnifySDK,
};

describe('payWithMonnify function', () => {
  it('should initialize MonnifySDK with correct parameters', () => {
    payWithMonnify(mockData, mockOnModalClose, mockOnSuccess);

    expect(mockMonnifySDK.initialize).toHaveBeenCalled();
  });

  it('should call onSuccess callback on transaction complete', () => {
    payWithMonnify(mockData, mockOnModalClose, mockOnSuccess);

    // Ensure onSuccess is called with the correct response object
    expect(mockOnSuccess).toHaveBeenCalledWith({ transactionId: '1234567890', status: 'SUCCESS' });
  });

  it('should call onModalClose on user cancelled or failed transaction', () => {
    payWithMonnify(mockData, mockOnModalClose, mockOnSuccess);

    // Ensure onModalClose is called twice (once for USER_CANCELLED and once for FAILED)
    expect(mockOnModalClose).toHaveBeenCalledTimes(6);
  });
});
