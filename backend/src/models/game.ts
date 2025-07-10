import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from './index';

interface GameAttributes {
  id: number;
  name: string;
  provider: string;
  category: string;
  minRtp: number;
  maxRtp: number;
  currentRtp: number;
  imageUrl?: string | null;
  description?: string | null;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface GameCreationAttributes extends Optional<GameAttributes, 'id'> {}

export class Game extends Model<GameAttributes, GameCreationAttributes>
  implements GameAttributes {
  public id!: number;
  public name!: string;
  public provider!: string;
  public category!: string;
  public minRtp!: number;
  public maxRtp!: number;
  public currentRtp!: number;
  public imageUrl?: string | null;
  public description?: string | null;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Game.init(
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
    provider: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    minRtp: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    maxRtp: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    currentRtp: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    imageUrl: DataTypes.STRING,
    description: DataTypes.TEXT,
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'games',
  }
);
