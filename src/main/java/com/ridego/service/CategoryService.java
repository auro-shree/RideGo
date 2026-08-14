package com.ridego.service;

import com.ridego.dto.request.CategoryCreateRequest;
import com.ridego.dto.request.CategoryUpdateRequest;
import com.ridego.dto.response.CategoryResponse;

import java.util.List;

public interface CategoryService {
    CategoryResponse createCategory(CategoryCreateRequest request);
    CategoryResponse updateCategory(Long id, CategoryUpdateRequest request);
    CategoryResponse getCategoryById(Long id);
    List<CategoryResponse> getAllCategories(Boolean activeOnly);
    void deleteCategory(Long id);
}
