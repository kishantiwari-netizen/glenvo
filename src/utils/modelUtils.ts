import { models, User, Role, RefreshToken } from "../../db/models";
import { UserModel, RoleModel, RefreshTokenModel } from "../../db/types";

// Example of how to use models with proper IntelliSense
export class ModelUtils {
  // Using the typed models object
  static async findUserByEmail(email: string) {
    // This will have full IntelliSense support
    return await models.User.findOne({
      where: { email },
      include: [{ model: models.Role, as: "role" }],
    });
  }

  // Using individual model imports
  static async findUserById(id: number) {
    // This will also have full IntelliSense support
    return await User.findByPk(id, {
      include: [{ model: Role, as: "role" }],
    });
  }

  // Example of creating a user with proper typing
  static async createUser(userData: {
    fullName: string;
    email: string;
    password: string;
    companyName?: string;
    roleId: number;
  }) {
    return await User.create(userData);
  }

  // Example of finding all users with pagination
  static async findUsers(page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;
    return await User.findAndCountAll({
      include: [{ model: Role, as: "role" }],
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });
  }

  // Example of updating a user
  static async updateUser(
    id: number,
    updateData: Partial<{
      fullName: string;
      email: string;
      companyName: string;
      isActive: boolean;
    }>
  ) {
    return await User.update(updateData, {
      where: { id },
    });
  }

  // Example of deleting a user
  static async deleteUser(id: number) {
    return await User.destroy({
      where: { id },
    });
  }

  // Example of finding roles with permissions
  static async findRolesWithPermissions() {
    return await Role.findAll({
      include: [{ model: models.Permission, as: "permissions" }],
    });
  }
}
