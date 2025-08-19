import { Model, DataTypes, Sequelize } from "sequelize";
import { sequelize } from "./index";

interface PackageAttributes {
  id?: number;
  shipment_id: number;
  length: number;
  width: number;
  height: number;
  weight: number;
  description?: string;
  declared_value: number;
  package_number: number;
  hash_id?: string;
  deleted_at?: Date;
  created_at?: Date;
  updated_at?: Date;
  shipment?: any;
}

interface PackageCreationAttributes {
  shipment_id: number;
  length: number;
  width: number;
  height: number;
  weight: number;
  description?: string;
  declared_value: number;
  package_number: number;
  hash_id?: string;
  deleted_at?: Date;
}

class Package
  extends Model<PackageAttributes, PackageCreationAttributes>
  implements PackageAttributes
{
  public id!: number;
  public shipment_id!: number;
  public length!: number;
  public width!: number;
  public height!: number;
  public weight!: number;
  public description?: string;
  public declared_value!: number;
  public package_number!: number;
  public hash_id?: string;
  public deleted_at?: Date;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  public shipment?: any;

  public get dimensions(): string {
    return `${this.length} x ${this.width} x ${this.height} in`;
  }

  public get volume(): number {
    return this.length * this.width * this.height;
  }

  public get dimensionalWeight(): number {
    // Dimensional weight calculation (length x width x height) / 166
    return Math.ceil(this.volume / 166);
  }
}

Package.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    shipment_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "shipments",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    length: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    width: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    height: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    weight: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    declared_value: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    package_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1,
      },
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
    tableName: "packages",
    modelName: "Package",
    timestamps: true,
    underscored: true,
    paranoid: true, // Enable soft deletes
  }
);

export default Package;
