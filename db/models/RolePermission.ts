import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "../config/database";

export interface RolePermissionAttributes {
  id: number;
  roleId: number;
  permissionId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface RolePermissionCreationAttributes {
  roleId: number;
  permissionId: number;
}

class RolePermission extends Model<
  InferAttributes<RolePermission>,
  InferCreationAttributes<RolePermission>
> {
  declare id: CreationOptional<number>;
  declare roleId: number;
  declare permissionId: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

RolePermission.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "roles",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    permissionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "permissions",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "role_permissions",
    modelName: "RolePermission",
    indexes: [
      {
        unique: true,
        fields: ["roleId", "permissionId"],
        name: "role_permissions_unique",
      },
    ],
  }
);

export default RolePermission;
