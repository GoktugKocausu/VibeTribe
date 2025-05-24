package com.example.vibetribesdemo.Validation;

import com.example.vibetribesdemo.DTOs.EventRequestDto;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class TimeRangeValidator implements ConstraintValidator<ValidTimeRange, EventRequestDto> {

    @Override
    public boolean isValid(EventRequestDto dto, ConstraintValidatorContext context) {
        if (dto.getStartTime() == null || dto.getEndTime() == null) {
            return true; // Let @NotNull handle null checks
        }
        return dto.getEndTime().isAfter(dto.getStartTime());
    }
}
