package com.ridego.controller;

import com.ridego.dto.response.ApiResponse;
import com.ridego.dto.response.InvoiceResponse;
import com.ridego.service.InvoiceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/invoices")
@Tag(name = "Invoice Generation & PDF Download", description = "Endpoints for viewing invoice metadata and downloading PDF receipts")
public class InvoiceController {

    @Autowired
    private InvoiceService invoiceService;

    @GetMapping("/booking/{bookingId}")
    @Operation(summary = "Get invoice metadata by booking ID", description = "Retrieves structured JSON payload containing invoice details, customer specs, vehicle specs, and financial breakdown.")
    public ResponseEntity<ApiResponse<InvoiceResponse>> getInvoiceData(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long bookingId) {

        InvoiceResponse response = invoiceService.getInvoiceData(userDetails.getUsername(), bookingId);
        return ResponseEntity.ok(ApiResponse.success("Invoice metadata retrieved successfully", response));
    }

    @GetMapping("/booking/{bookingId}/download")
    @Operation(summary = "Download invoice PDF document", description = "Generates and streams a PDF receipt for the specified booking.")
    public ResponseEntity<byte[]> downloadInvoicePdf(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long bookingId) {

        InvoiceResponse invoiceData = invoiceService.getInvoiceData(userDetails.getUsername(), bookingId);
        byte[] pdfBytes = invoiceService.generateInvoicePdf(userDetails.getUsername(), bookingId);

        String filename = "Invoice_" + invoiceData.getInvoiceNumber() + ".pdf";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                .contentType(MediaType.APPLICATION_PDF)
                .contentLength(pdfBytes.length)
                .body(pdfBytes);
    }
}
