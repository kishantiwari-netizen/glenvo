import { Model, FindOptions } from "sequelize";

/**
 * Utility functions for soft delete operations
 */

/**
 * Find a record by primary key including soft-deleted records
 * @param model - The Sequelize model
 * @param id - The primary key value
 * @param options - Additional find options
 * @returns The found record or null
 */
export const findWithDeleted = async <T extends Model>(
  model: any,
  id: number | string,
  options: FindOptions = {}
): Promise<T | null> => {
  return await model.findByPk(id, {
    ...options,
    paranoid: false, // Include soft-deleted records
  });
};

/**
 * Find all records including soft-deleted records
 * @param model - The Sequelize model
 * @param options - Find options
 * @returns Array of records
 */
export const findAllWithDeleted = async <T extends Model>(
  model: any,
  options: FindOptions = {}
): Promise<T[]> => {
  return await model.findAll({
    ...options,
    paranoid: false, // Include soft-deleted records
  });
};

/**
 * Find and count records including soft-deleted records
 * @param model - The Sequelize model
 * @param options - Find options
 * @returns Object with count and rows
 */
export const findAndCountAllWithDeleted = async <T extends Model>(
  model: any,
  options: FindOptions = {}
): Promise<{ count: number; rows: T[] }> => {
  return await model.findAndCountAll({
    ...options,
    paranoid: false, // Include soft-deleted records
  });
};

/**
 * Get only soft-deleted records
 * @param model - The Sequelize model
 * @param options - Find options
 * @returns Array of soft-deleted records
 */
export const findDeleted = async <T extends Model>(
  model: any,
  options: FindOptions = {}
): Promise<T[]> => {
  const records = await model.findAll({
    ...options,
    paranoid: false, // Include soft-deleted records
  });

  // Filter only deleted records
  return records.filter((record: any) => record.deleted_at !== null);
};

/**
 * Check if a record is soft-deleted
 * @param record - The model instance
 * @returns True if the record is soft-deleted
 */
export const isSoftDeleted = (record: any): boolean => {
  return record.deleted_at !== null && record.deleted_at !== undefined;
};

/**
 * Force delete a record (permanent deletion)
 * @param record - The model instance
 * @returns Promise<void>
 */
export const forceDelete = async (record: any): Promise<void> => {
  await record.destroy({ force: true });
};

/**
 * Restore a soft-deleted record
 * @param record - The model instance
 * @returns Promise<void>
 */
export const restoreRecord = async (record: any): Promise<void> => {
  await record.restore();
};
