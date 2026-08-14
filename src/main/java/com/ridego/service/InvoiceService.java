package com.ridego.service;

import com.ridego.dto.response.InvoiceResponse;

public interface InvoiceService {
    InvoiceResponse getInvoiceData(String userEmail, Long bookingId);
    byte[] generateInvoicePdf(String userEmail, Long bookingId);
}
