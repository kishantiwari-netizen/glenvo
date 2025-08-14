import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  HasMany,
} from "sequelize";
import * as bcrypt from "bcryptjs";
import sequelize from "../config/database";

export interface UserAttributes {
  id: string;
  fullName: string;
  email: string;
  password: string;
  companyName?: string;
  roleId: number;
  isActive: boolean;
  emailVerified: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserCreationAttributes {
  fullName: string;
  email: string;
  password: string;
  companyName?: string;
  roleId: number;
  isActive?: boolean;
  emailVerified?: boolean;
}

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<string>;
  declare fullName: string;
  declare email: string;
  declare password: string;
  declare companyName: CreationOptional<string>;
  declare roleId: number;
  declare isActive: CreationOptional<boolean>;
  declare emailVerified: CreationOptional<boolean>;
  declare lastLoginAt: CreationOptional<Date>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  // Instance methods
  async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }

  // Static associations
  static associations: {
    refreshTokens: HasMany<User, any>;
    role: any;
  };

  // Instance associations
  declare role?: any;
  declare refreshTokens?: any[];
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    fullName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        len: [2, 100],
      },
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        len: [6, 255],
      },
    },
    companyName: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "roles",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    lastLoginAt: {
      type: DataTypes.DATE,
      allowNull: true,
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
    tableName: "users",
    modelName: "User",
    hooks: {
      beforeCreate: async (user: any) => {
        if (user.password) {
          const saltRounds = 12;
          user.password = await bcrypt.hash(user.password, saltRounds);
        }
      },
      beforeUpdate: async (user: any) => {
        if (user.changed("password")) {
          const saltRounds = 12;
          user.password = await bcrypt.hash(user.password, saltRounds);
        }
      },
    },
  }
);

export default User;
