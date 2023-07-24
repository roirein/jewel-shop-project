import { createSelector } from "@reduxjs/toolkit";

export const modelsSelector = (state) => state.models;

export const selectModel = createSelector(modelsSelector, (models) => models.models)