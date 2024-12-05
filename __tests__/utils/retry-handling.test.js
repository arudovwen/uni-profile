import { it, expect, describe } from "vitest";
import { withRetryHandling} from "../../utils/retry-handling";
import { mount } from "@vue/test-utils";

// Mock async function for testing
const mockAsyncFunction = async (params) => {
  if (params === 'success') {
    return 'Success';
  } else {
    throw new Error('Simulated error');
  }
};

describe('withRetryHandling function', () => {
  it('should retry and succeed after one failure', async () => {
    const retryWrapper = withRetryHandling(mockAsyncFunction, { numberOfTries: 3 });

    const result = await retryWrapper('success');

    expect(result).toBe('Success');
  });


});
