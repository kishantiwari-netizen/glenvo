import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  BelongsTo,
} from "sequelize";
import sequelize from "../config/database";

export interface RefreshTokenAttributes {
  id: number;
  token: string;
  userId: number;
  expiresAt: Date;
  isRevoked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface RefreshTokenCreationAttributes {
  token: string;
  userId: number;
  expiresAt: Date;
  isRevoked?: boolean;
}

class RefreshToken extends Model<
  InferAttributes<RefreshToken>,
  InferCreationAttributes<RefreshToken>
> {
  declare id: CreationOptional<number>;
  declare token: string;
  declare userId: number;
  declare expiresAt: Date;
  declare isRevoked: CreationOptional<boolean>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  // Static associations
  static associations: {
    user: BelongsTo<RefreshToken, any>;
  };

  // Instance associations
  declare user?: any;
}

RefreshToken.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    token: {
      type: DataTypes.STRING(500),
      allowNull: false,
      unique: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    isRevoked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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
    tableName: "refresh_tokens",
    modelName: "RefreshToken",
  }
);

export default RefreshToken;
