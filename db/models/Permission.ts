import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  BelongsToMany,
} from "sequelize";
import sequelize from "../config/database";

export interface PermissionAttributes {
  id: number;
  name: string;
  description: string;
  resource: string;
  action: string;
  scope?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PermissionCreationAttributes {
  name: string;
  description: string;
  resource: string;
  action: string;
  scope?: string;
  isActive?: boolean;
}

class Permission extends Model<
  InferAttributes<Permission>,
  InferCreationAttributes<Permission>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare description: string;
  declare resource: string;
  declare action: string;
  declare scope: CreationOptional<string>;
  declare isActive: CreationOptional<boolean>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  // Static associations
  static associations: {
    roles: BelongsToMany<Permission, any>;
  };

  // Instance associations
  declare roles?: any[];
}

Permission.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        len: [2, 100],
      },
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        len: [5, 255],
      },
    },
    resource: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: [2, 50],
      },
    },
    action: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: [2, 50],
      },
    },
    scope: {
      type: DataTypes.STRING(50),
      allowNull: true,
      validate: {
        len: [1, 50],
      },
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
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
    tableName: "permissions",
    modelName: "Permission",
  }
);

export default Permission;
