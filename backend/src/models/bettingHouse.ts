import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from './index';

interface BettingHouseAttributes {
  id: number;
  name: string;
  apiName: string;
  apiUrl: string;
  updateInterval: number;
  currency: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface BettingHouseCreationAttributes extends Optional<BettingHouseAttributes, 'id'> {}

export class BettingHouse extends Model<BettingHouseAttributes, BettingHouseCreationAttributes>
  implements BettingHouseAttributes {
  public id!: number;
  public name!: string;
  public apiName!: string;
  public apiUrl!: string;
  public updateInterval!: number;
  public currency!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

BettingHouse.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    apiName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    apiUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    updateInterval: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'betting_houses',
  }
);
