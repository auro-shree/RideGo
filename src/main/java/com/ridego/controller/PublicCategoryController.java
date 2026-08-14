package com.ridego.controller;

import com.ridego.dto.response.ApiResponse;
import com.ridego.dto.response.CategoryResponse;
import com.ridego.service.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@Tag(name = "Vehicle Categories (Public/User)", description = "Endpoints for retrieving active vehicle categories")
public class PublicCategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping
    @Operation(summary = "Get active vehicle categories", description = "Returns list of active vehicle categories available for booking.")
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getActiveCategories() {
        List<CategoryResponse> categories = categoryService.getAllCategories(true);
        return ResponseEntity.ok(ApiResponse.success("Active categories retrieved successfully", categories));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get vehicle category details", description = "Returns details for a category by ID.")
    public ResponseEntity<ApiResponse<CategoryResponse>> getCategoryById(@PathVariable Long id) {
        CategoryResponse category = categoryService.getCategoryById(id);
        return ResponseEntity.ok(ApiResponse.success("Category details retrieved successfully", category));
    }
}
