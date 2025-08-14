import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  HasMany,
  BelongsToMany,
} from "sequelize";
import sequelize from "../config/database";

export interface RoleAttributes {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface RoleCreationAttributes {
  name: string;
  description: string;
  isActive?: boolean;
}

class Role extends Model<InferAttributes<Role>, InferCreationAttributes<Role>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare description: string;
  declare isActive: CreationOptional<boolean>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  // Static associations
  static associations: {
    users: HasMany<Role, any>;
    permissions: BelongsToMany<Role, any>;
  };

  // Instance associations
  declare users?: any[];
  declare permissions?: any[];
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
        len: [2, 50],
      },
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        len: [5, 255],
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
    tableName: "roles",
    modelName: "Role",
  }
);

export default Role;
