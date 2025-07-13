import { DataTypes, Model } from 'sequelize'
import sequelize from './index'

export class Setting extends Model {
  public id!: number
  public css!: string
}

Setting.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    css: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: '',
    },
  },
  {
    sequelize,
    tableName: 'settings',
    timestamps: false,
  }
)
