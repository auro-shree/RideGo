package com.ridego.service.impl;

import com.ridego.dto.request.CategoryCreateRequest;
import com.ridego.dto.request.CategoryUpdateRequest;
import com.ridego.dto.response.CategoryResponse;
import com.ridego.entity.VehicleCategory;
import com.ridego.exception.BadRequestException;
import com.ridego.exception.ResourceNotFoundException;
import com.ridego.mapper.CategoryMapper;
import com.ridego.repository.VehicleCategoryRepository;
import com.ridego.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private VehicleCategoryRepository categoryRepository;

    @Override
    @Transactional
    public CategoryResponse createCategory(CategoryCreateRequest request) {
        if (categoryRepository.existsByCode(request.getCode())) {
            throw new BadRequestException("Vehicle category with code '" + request.getCode() + "' already exists!");
        }

        VehicleCategory category = VehicleCategory.builder()
                .name(request.getName())
                .code(request.getCode())
                .description(request.getDescription())
                .hourlyRate(request.getHourlyRate())
                .dailyRate(request.getDailyRate())
                .depositAmount(request.getDepositAmount())
                .active(true)
                .build();

        VehicleCategory savedCategory = categoryRepository.save(category);
        return CategoryMapper.toCategoryResponse(savedCategory);
    }

    @Override
    @Transactional
    public CategoryResponse updateCategory(Long id, CategoryUpdateRequest request) {
        VehicleCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("VehicleCategory", "id", id));

        category.setName(request.getName());
        category.setDescription(request.getDescription());
        category.setHourlyRate(request.getHourlyRate());
        category.setDailyRate(request.getDailyRate());
        category.setDepositAmount(request.getDepositAmount());

        if (request.getActive() != null) {
            category.setActive(request.getActive());
        }

        VehicleCategory updatedCategory = categoryRepository.save(category);
        return CategoryMapper.toCategoryResponse(updatedCategory);
    }

    @Override
    @Transactional(readOnly = true)
    public CategoryResponse getCategoryById(Long id) {
        VehicleCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("VehicleCategory", "id", id));
        return CategoryMapper.toCategoryResponse(category);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryResponse> getAllCategories(Boolean activeOnly) {
        List<VehicleCategory> categories;
        if (Boolean.TRUE.equals(activeOnly)) {
            categories = categoryRepository.findByActive(true);
        } else {
            categories = categoryRepository.findAll();
        }

        return categories.stream()
                .map(CategoryMapper::toCategoryResponse)
                .toList();
    }

    @Override
    @Transactional
    public void deleteCategory(Long id) {
        VehicleCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("VehicleCategory", "id", id));
        category.setActive(false);
        categoryRepository.save(category);
    }
}
