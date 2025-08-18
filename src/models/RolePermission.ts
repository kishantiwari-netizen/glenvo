import { Model, DataTypes, Sequelize } from "sequelize";
import { sequelize } from "./index";

interface RolePermissionAttributes {
  id?: number;
  role_id: number;
  permission_id: number;
  created_at?: Date;
  updated_at?: Date;
}

interface RolePermissionCreationAttributes
  extends Omit<RolePermissionAttributes, "id" | "created_at" | "updated_at"> {}

class RolePermission
  extends Model<RolePermissionAttributes, RolePermissionCreationAttributes>
  implements RolePermissionAttributes
{
  public id!: number;
  public role_id!: number;
  public permission_id!: number;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

RolePermission.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "roles",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    permission_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "permissions",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },
  {
    sequelize,
    tableName: "role_permissions",
    modelName: "RolePermission",
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ["role_id", "permission_id"],
      },
    ],
  }
);

export default RolePermission;
