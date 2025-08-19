import { Model, DataTypes, Sequelize } from "sequelize";
import { sequelize } from "./index";
import User from "./User";

interface RoleAttributes {
  id?: number;
  name: string;
  description?: string;
  is_active: boolean;
  hash_id?: string;
  deleted_at?: Date;
  created_at?: Date;
  updated_at?: Date;
  users?: User[];
}

interface RoleCreationAttributes
  extends Omit<RoleAttributes, "id" | "created_at" | "updated_at" | "users" | "hash_id" | "deleted_at"> {}

class Role
  extends Model<RoleAttributes, RoleCreationAttributes>
  implements RoleAttributes
{
  public id!: number;
  public name!: string;
  public description?: string;
  public is_active!: boolean;
  public hash_id?: string;
  public deleted_at?: Date;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  public users?: User[];
}

Role.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        len: [1, 50],
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    hash_id: {
      type: DataTypes.UUID,
      allowNull: true,
      defaultValue: DataTypes.UUIDV4,
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
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
    tableName: "roles",
    modelName: "Role",
    timestamps: true,
    underscored: true,
    paranoid: true, // Enable soft deletes
  }
);

export default Role;
