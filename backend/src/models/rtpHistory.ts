import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from './index';
import { User } from './user';
import { Game } from './game';

interface RtpHistoryAttributes {
  id: number;
  userId: number;
  gameId: number;
  rtpValue: number;
  timestamp?: Date;
  notes?: string | null;
}

interface RtpHistoryCreationAttributes extends Optional<RtpHistoryAttributes, 'id'> {}

export class RtpHistory extends Model<RtpHistoryAttributes, RtpHistoryCreationAttributes>
  implements RtpHistoryAttributes {
  public id!: number;
  public userId!: number;
  public gameId!: number;
  public rtpValue!: number;
  public timestamp!: Date;
  public notes?: string | null;
}

RtpHistory.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    gameId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rtpValue: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    notes: DataTypes.TEXT,
  },
  {
    sequelize,
    tableName: 'rtp_history',
  }
);

User.hasMany(RtpHistory, { foreignKey: 'userId' });
RtpHistory.belongsTo(User, { foreignKey: 'userId' });
Game.hasMany(RtpHistory, { foreignKey: 'gameId' });
RtpHistory.belongsTo(Game, { foreignKey: 'gameId' });
