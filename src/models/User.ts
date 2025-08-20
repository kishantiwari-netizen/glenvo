import { Model, DataTypes, Sequelize } from "sequelize";
import bcrypt from "bcryptjs";
import { sequelize } from "./index";

interface UserAttributes {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone_number?: string;
  date_of_birth?: Date;
  profile_picture?: string;
  account_type: "individual" | "business";
  business_type?: string;
  agreement_acceptance: boolean;
  marketing_opt_in: boolean;
  social_media_acceptance: boolean;
  is_email_verified: boolean;
  is_active: boolean;
  last_login_at?: Date;
  password_reset_token?: string;
  password_reset_expires?: Date;
  role_id?: number;
  easypost_user_id?: string;
  easypost_api_key?: string;
  easypost_webhook_url?: string;
  stripe_customer_id?: string;
  hash_id?: string;
  deleted_at?: Date;
  created_at?: Date;
  updated_at?: Date;
  role?: any;
  shipping_profile?: any;
}

interface UserCreationAttributes {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone_number?: string;
  date_of_birth?: Date;
  profile_picture?: string;
  account_type?: "individual" | "business";
  business_type?: string;
  agreement_acceptance?: boolean;
  marketing_opt_in?: boolean;
  social_media_acceptance?: boolean;
  is_email_verified?: boolean;
  is_active?: boolean;
  last_login_at?: Date;
  password_reset_token?: string;
  password_reset_expires?: Date;
  role_id?: number;
  easypost_user_id?: string;
  easypost_api_key?: string;
  easypost_webhook_url?: string;
  stripe_customer_id?: string;
  hash_id?: string;
  deleted_at?: Date;
}

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;
  public first_name!: string;
  public last_name!: string;
  public email!: string;
  public password!: string;
  public phone_number?: string;
  public date_of_birth?: Date;
  public profile_picture?: string;
  public account_type!: "individual" | "business";
  public business_type?: string;
  public agreement_acceptance!: boolean;
  public marketing_opt_in!: boolean;
  public social_media_acceptance!: boolean;
  public is_email_verified!: boolean;
  public is_active!: boolean;
  public last_login_at?: Date;
  public password_reset_token?: string;
  public password_reset_expires?: Date;
  public role_id?: number;
  public easypost_user_id?: string;
  public easypost_api_key?: string;
  public easypost_webhook_url?: string;
  public stripe_customer_id?: string;
  public hash_id?: string;
  public deleted_at?: Date;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  public role?: any; // For Sequelize associations
  public shipping_profile?: any; // For Sequelize associations

  // Instance methods
  public async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }

  public async hashPassword(): Promise<void> {
    if (this.changed("password")) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  public get fullName(): string {
    return `${this.first_name} ${this.last_name}`;
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    first_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: [1, 50],
      },
    },
    last_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: [1, 50],
      },
    },
    email: {
      type: DataTypes.STRING(100),
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
    phone_number: {
      type: DataTypes.STRING(20),
      allowNull: true,
      validate: {
        is: /^\+?[\d\s\-\(\)]+$/,
      },
    },
    date_of_birth: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    profile_picture: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    is_email_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    last_login_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    password_reset_token: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    account_type: {
      type: DataTypes.ENUM("individual", "business"),
      allowNull: false,
      defaultValue: "individual",
      validate: {
        isIn: [["individual", "business"]],
      },
    },
    business_type: {
      type: DataTypes.ENUM(
        "eCommerce Retailer",
        "Wholesale Distributor",
        "Manufacturer",
        "Dropshipper",
        "Marketplace Seller",
        "Other"
      ),
      allowNull: true,
    },
    agreement_acceptance: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    marketing_opt_in: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    social_media_acceptance: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    password_reset_expires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "roles",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
    easypost_user_id: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    easypost_api_key: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    easypost_webhook_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    stripe_customer_id: {
      type: DataTypes.STRING(255),
      allowNull: true,
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
    tableName: "users",
    modelName: "User",
    timestamps: true,
    underscored: true,
    paranoid: true, // Enable soft deletes
    hooks: {
      beforeCreate: async (user: User) => {
        await user.hashPassword();
      },
      beforeUpdate: async (user: User) => {
        await user.hashPassword();
      },
    },
  }
);

export default User;
