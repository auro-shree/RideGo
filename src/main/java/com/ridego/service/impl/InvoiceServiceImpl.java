package com.ridego.service.impl;

import com.lowagie.text.Chunk;
import com.lowagie.text.Document;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.ridego.dto.response.InvoiceResponse;
import com.ridego.entity.Booking;
import com.ridego.entity.User;
import com.ridego.enums.UserRole;
import com.ridego.exception.ResourceNotFoundException;
import com.ridego.exception.UnauthorizedException;
import com.ridego.repository.BookingRepository;
import com.ridego.repository.UserRepository;
import com.ridego.service.InvoiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;

@Service
public class InvoiceServiceImpl implements InvoiceService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a");
    private static final DateTimeFormatter CODE_DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyyMMdd");

    @Override
    @Transactional(readOnly = true)
    public InvoiceResponse getInvoiceData(String userEmail, Long bookingId) {
        Booking booking = validateUserAndBooking(userEmail, bookingId);
        return mapToInvoiceResponse(booking);
    }

    @Override
    @Transactional(readOnly = true)
    public byte[] generateInvoicePdf(String userEmail, Long bookingId) {
        InvoiceResponse invoice = getInvoiceData(userEmail, bookingId);

        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document();
            PdfWriter.getInstance(document, out);
            document.open();

            // Fonts & Colors
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 20, new Color(30, 41, 59));
            Font subtitleFont = FontFactory.getFont(FontFactory.HELVETICA, 10, new Color(100, 116, 139));
            Font sectionHeaderFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, Color.WHITE);
            Font labelFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, new Color(51, 65, 85));
            Font valueFont = FontFactory.getFont(FontFactory.HELVETICA, 10, new Color(71, 85, 105));
            Font boldValueFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11, new Color(15, 23, 42));

            // Header Section
            Paragraph title = new Paragraph("RIDEGO - BIKE RENTALS", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);

            Paragraph subtitle = new Paragraph("Official Payment Receipt & Rental Invoice", subtitleFont);
            subtitle.setAlignment(Element.ALIGN_CENTER);
            subtitle.setSpacingAfter(15);
            document.add(subtitle);

            // Invoice Summary Bar
            PdfPTable metaTable = new PdfPTable(2);
            metaTable.setWidthPercentage(100);
            metaTable.setSpacingAfter(15);

            metaTable.addCell(createCell("Invoice No: " + invoice.getInvoiceNumber(), labelFont, false));
            metaTable.addCell(createRightCell("Issue Date: " + invoice.getIssuedAt().format(DATE_FORMATTER), valueFont));
            metaTable.addCell(createCell("Booking Ref: " + invoice.getBookingCode(), labelFont, false));
            metaTable.addCell(createRightCell("Booking Status: " + invoice.getBookingStatus(), labelFont));

            document.add(metaTable);

            // Section 1: Customer & Vehicle Specs
            PdfPTable detailsTable = new PdfPTable(2);
            detailsTable.setWidthPercentage(100);
            detailsTable.setSpacingAfter(15);

            // Left: Customer
            PdfPCell custHeader = new PdfPCell(new Phrase("CUSTOMER INFORMATION", sectionHeaderFont));
            custHeader.setBackgroundColor(new Color(30, 41, 59));
            custHeader.setPadding(6);
            detailsTable.addCell(custHeader);

            // Right: Vehicle
            PdfPCell vehHeader = new PdfPCell(new Phrase("VEHICLE SPECIFICATIONS", sectionHeaderFont));
            vehHeader.setBackgroundColor(new Color(30, 41, 59));
            vehHeader.setPadding(6);
            detailsTable.addCell(vehHeader);

            String custBody = "Name: " + invoice.getUser().getName() + "\n"
                    + "Email: " + invoice.getUser().getEmail() + "\n"
                    + "Phone: " + (invoice.getUser().getPhoneNumber() != null ? invoice.getUser().getPhoneNumber() : "N/A");
            detailsTable.addCell(createPaddingCell(custBody, valueFont));

            String vehBody = "Vehicle: " + invoice.getVehicle().getBrand() + " " + invoice.getVehicle().getModel() + "\n"
                    + "Reg Number: " + invoice.getVehicle().getRegistrationNumber() + "\n"
                    + "Type: " + invoice.getVehicle().getVehicleType();
            detailsTable.addCell(createPaddingCell(vehBody, valueFont));

            document.add(detailsTable);

            // Section 2: Rental Stations & Schedule
            PdfPTable stationTable = new PdfPTable(1);
            stationTable.setWidthPercentage(100);
            stationTable.setSpacingAfter(15);

            PdfPCell stationHeader = new PdfPCell(new Phrase("RENTAL SCHEDULE & STATION LOCATIONS", sectionHeaderFont));
            stationHeader.setBackgroundColor(new Color(30, 41, 59));
            stationHeader.setPadding(6);
            stationTable.addCell(stationHeader);

            String scheduleBody = "Pickup Station: " + invoice.getPickupLocation().getName() + " (" + invoice.getPickupLocation().getCity() + ")\n"
                    + "Pickup Time: " + invoice.getPickupDateTime().format(DATE_FORMATTER) + "\n\n"
                    + "Return Station: " + invoice.getReturnLocation().getName() + " (" + invoice.getReturnLocation().getCity() + ")\n"
                    + "Return Time: " + invoice.getReturnDateTime().format(DATE_FORMATTER);
            stationTable.addCell(createPaddingCell(scheduleBody, valueFont));

            document.add(stationTable);

            // Section 3: Financial Charges Breakdown
            PdfPTable financialTable = new PdfPTable(2);
            financialTable.setWidthPercentage(100);
            financialTable.setWidths(new float[]{3.5f, 1.5f});
            financialTable.setSpacingAfter(20);

            PdfPCell descHeader = new PdfPCell(new Phrase("DESCRIPTION", sectionHeaderFont));
            descHeader.setBackgroundColor(new Color(30, 41, 59));
            descHeader.setPadding(6);
            financialTable.addCell(descHeader);

            PdfPCell amtHeader = new PdfPCell(new Phrase("AMOUNT ($)", sectionHeaderFont));
            amtHeader.setBackgroundColor(new Color(30, 41, 59));
            amtHeader.setHorizontalAlignment(Element.ALIGN_RIGHT);
            amtHeader.setPadding(6);
            financialTable.addCell(amtHeader);

            addTableRow(financialTable, "Base Rental Charge", invoice.getRentalAmount().toString(), valueFont);
            addTableRow(financialTable, "Coupon Discount", "-$" + invoice.getDiscountAmount().toString(), valueFont);
            addTableRow(financialTable, "Tax / GST (18%)", "$" + invoice.getTaxAmount().toString(), valueFont);
            addTableRow(financialTable, "Security Deposit (Refundable)", "$" + invoice.getSecurityDeposit().toString(), valueFont);
            if (invoice.getAdditionalCharges() != null && invoice.getAdditionalCharges().compareTo(BigDecimal.ZERO) > 0) {
                addTableRow(financialTable, "Additional Charges / Late / Damage Fees", "$" + invoice.getAdditionalCharges().toString(), valueFont);
            }

            // Total Row
            PdfPCell totalLabelCell = new PdfPCell(new Phrase("TOTAL AMOUNT PAID", boldValueFont));
            totalLabelCell.setBackgroundColor(new Color(241, 245, 249));
            totalLabelCell.setPadding(8);
            financialTable.addCell(totalLabelCell);

            PdfPCell totalValCell = new PdfPCell(new Phrase("$" + invoice.getTotalAmount().toString(), boldValueFont));
            totalValCell.setBackgroundColor(new Color(241, 245, 249));
            totalValCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
            totalValCell.setPadding(8);
            financialTable.addCell(totalValCell);

            document.add(financialTable);

            // Footer Section
            Paragraph footer = new Paragraph("Payment Status: " + invoice.getPaymentStatus() + " | Thank you for choosing RideGo!", boldValueFont);
            footer.setAlignment(Element.ALIGN_CENTER);
            document.add(footer);

            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate PDF invoice: " + e.getMessage(), e);
        }
    }

    private Booking validateUserAndBooking(String userEmail, Long bookingId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", bookingId));

        boolean isAdmin = user.getRoles().stream().anyMatch(r -> r.getName() == UserRole.ROLE_ADMIN);
        if (!isAdmin && !booking.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("You do not have permission to view or download this invoice");
        }

        return booking;
    }

    private InvoiceResponse mapToInvoiceResponse(Booking booking) {
        String invoiceNumber = "INV-" + booking.getCreatedAt().format(CODE_DATE_FORMATTER) + "-" + String.format("%06d", booking.getId());

        InvoiceResponse.UserSummary userSummary = InvoiceResponse.UserSummary.builder()
                .id(booking.getUser().getId())
                .name(booking.getUser().getName())
                .email(booking.getUser().getEmail())
                .phoneNumber(booking.getUser().getPhoneNumber())
                .build();

        InvoiceResponse.VehicleSummary vehicleSummary = InvoiceResponse.VehicleSummary.builder()
                .id(booking.getVehicle().getId())
                .brand(booking.getVehicle().getBrand())
                .model(booking.getVehicle().getModel())
                .registrationNumber(booking.getVehicle().getRegistrationNumber())
                .vehicleType(booking.getVehicle().getVehicleType())
                .build();

        InvoiceResponse.LocationSummary pickupSummary = InvoiceResponse.LocationSummary.builder()
                .id(booking.getPickupLocation().getId())
                .name(booking.getPickupLocation().getName())
                .city(booking.getPickupLocation().getCity())
                .address(booking.getPickupLocation().getAddress())
                .build();

        InvoiceResponse.LocationSummary returnSummary = InvoiceResponse.LocationSummary.builder()
                .id(booking.getDropLocation().getId())
                .name(booking.getDropLocation().getName())
                .city(booking.getDropLocation().getCity())
                .address(booking.getDropLocation().getAddress())
                .build();

        BigDecimal extraFees = BigDecimal.ZERO;
        if (booking.getLateReturnCharges() != null) extraFees = extraFees.add(booking.getLateReturnCharges());
        if (booking.getDamageCharges() != null) extraFees = extraFees.add(booking.getDamageCharges());
        if (booking.getAdditionalCharges() != null) extraFees = extraFees.add(booking.getAdditionalCharges());

        return InvoiceResponse.builder()
                .invoiceNumber(invoiceNumber)
                .bookingId(booking.getId())
                .bookingCode(booking.getBookingCode())
                .issuedAt(booking.getCreatedAt())
                .user(userSummary)
                .vehicle(vehicleSummary)
                .pickupLocation(pickupSummary)
                .returnLocation(returnSummary)
                .pickupDateTime(booking.getStartTime())
                .returnDateTime(booking.getEndTime())
                .rentalAmount(booking.getRentalAmount())
                .taxAmount(booking.getTaxAmount())
                .discountAmount(booking.getDiscountAmount())
                .securityDeposit(booking.getSecurityDeposit())
                .additionalCharges(extraFees)
                .totalAmount(booking.getTotalAmount())
                .paymentStatus(booking.getPaymentStatus())
                .bookingStatus(booking.getStatus())
                .build();
    }

    private PdfPCell createCell(String text, Font font, boolean border) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        if (!border) cell.setBorder(PdfPCell.NO_BORDER);
        cell.setPadding(4);
        return cell;
    }

    private PdfPCell createRightCell(String text, Font font) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setBorder(PdfPCell.NO_BORDER);
        cell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        cell.setPadding(4);
        return cell;
    }

    private PdfPCell createPaddingCell(String text, Font font) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setPadding(8);
        return cell;
    }

    private void addTableRow(PdfPTable table, String desc, String val, Font font) {
        PdfPCell descCell = new PdfPCell(new Phrase(desc, font));
        descCell.setPadding(6);
        table.addCell(descCell);

        PdfPCell valCell = new PdfPCell(new Phrase(val, font));
        valCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        valCell.setPadding(6);
        table.addCell(valCell);
    }
}
