package com.ridego.controller;

import com.ridego.dto.request.CategoryCreateRequest;
import com.ridego.dto.request.CategoryUpdateRequest;
import com.ridego.dto.response.ApiResponse;
import com.ridego.dto.response.CategoryResponse;
import com.ridego.service.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/categories")
@Tag(name = "Admin Category Management", description = "Admin-restricted endpoints for managing vehicle categories")
@PreAuthorize("hasRole('ADMIN')")
public class AdminCategoryController {

    @Autowired
    private CategoryService categoryService;

    @PostMapping
    @Operation(summary = "Add vehicle category", description = "Creates a new vehicle category with rates and codes.")
    public ResponseEntity<ApiResponse<CategoryResponse>> createCategory(@Valid @RequestBody CategoryCreateRequest request) {
        CategoryResponse response = categoryService.createCategory(request);
        return new ResponseEntity<>(ApiResponse.success("Vehicle category created successfully", response), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update vehicle category", description = "Updates category details and rates.")
    public ResponseEntity<ApiResponse<CategoryResponse>> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody CategoryUpdateRequest request) {

        CategoryResponse response = categoryService.updateCategory(id, request);
        return ResponseEntity.ok(ApiResponse.success("Vehicle category updated successfully", response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get category by ID", description = "Retrieves category by ID.")
    public ResponseEntity<ApiResponse<CategoryResponse>> getCategoryById(@PathVariable Long id) {
        CategoryResponse response = categoryService.getCategoryById(id);
        return ResponseEntity.ok(ApiResponse.success("Category retrieved successfully", response));
    }

    @GetMapping
    @Operation(summary = "Get all categories", description = "Retrieves all vehicle categories (includes inactive ones for admins).")
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getAllCategories(
            @RequestParam(required = false, defaultValue = "false") boolean activeOnly) {

        List<CategoryResponse> response = categoryService.getAllCategories(activeOnly);
        return ResponseEntity.ok(ApiResponse.success("Categories retrieved successfully", response));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deactivate category", description = "Marks vehicle category as inactive.")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok(ApiResponse.success("Vehicle category deactivated successfully", null));
    }
}
