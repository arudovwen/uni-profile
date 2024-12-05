import { it, expect, describe } from "vitest";
import getDocumentType from "~/utils/docName";
import { mount } from "@vue/test-utils";

describe('getDocumentType function', () => {
  describe('when type is "kyb"', () => {
    it('should return "Certificate of Incorporation" for id 0', () => {
      expect(getDocumentType(0, 'kyb')).toBe('Certificate of Incorporation');
    });

    it('should return "Memorandum and Articles of Association" for id 1', () => {
      expect(getDocumentType(1, 'kyb')).toBe('Memorandum and Articles of Association');
    });

    it('should return "CAC Status Report" for id 2', () => {
      expect(getDocumentType(2, 'kyb')).toBe('CAC Status Report');
    });

    it('should return "Utility Bill" for id 3', () => {
      expect(getDocumentType(3, 'kyb')).toBe('Utility Bill');
    });

    it('should return an empty string for an invalid id', () => {
      expect(getDocumentType(999, 'kyb')).toBe('');
    });
  });

  describe('when type is not "kyb"', () => {
    it('should return "Bank statement" for id 0', () => {
      expect(getDocumentType(0)).toBe('Bank statement');
    });

    it('should return "Proforma Invoice" for id 1', () => {
      expect(getDocumentType(1)).toBe('Proforma Invoice');
    });

    it('should return "Evidence of previously successful supply contracts (PO and Paid Invoices)" for id 2', () => {
      expect(getDocumentType(2)).toBe('Evidence of previously successful supply contracts (PO and Paid Invoices)');
    });

    it('should return "Others" for id 3', () => {
      expect(getDocumentType(3)).toBe('Others');
    });

    it('should return an empty string for an invalid id', () => {
      expect(getDocumentType(999)).toBe('');
    });
  });
});
